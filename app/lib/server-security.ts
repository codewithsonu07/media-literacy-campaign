import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { createServiceSupabaseClient } from "./supabase/server.ts";

export type RateLimitAction = "analysis" | "submission";

const RATE_LIMITS: Record<
  RateLimitAction,
  { requests: number; windowSeconds: number }
> = {
  analysis: { requests: 30, windowSeconds: 60 },
  submission: { requests: 30, windowSeconds: 15 * 60 },
};

function errorResponse(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

export function checkSameOrigin(request: Request): Response | null {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return errorResponse("Cross-origin requests are not accepted.", 403);
      }
    } catch {
      return errorResponse("The request origin is invalid.", 403);
    }
  }

  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return errorResponse("Cross-origin requests are not accepted.", 403);
  }

  return null;
}

export function checkJsonRequest(request: Request): Response | null {
  const mediaType = request
    .headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  if (mediaType !== "application/json") {
    return errorResponse("Send the request as JSON.", 415);
  }
  return null;
}

export async function readJsonBody(
  request: Request,
  maxBytes: number,
): Promise<{ value: unknown; error: null } | { value: null; error: Response }> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return {
      value: null,
      error: errorResponse("The request body is too large.", 413),
    };
  }

  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > maxBytes) {
      return {
        value: null,
        error: errorResponse("The request body is too large.", 413),
      };
    }
    return { value: JSON.parse(body) as unknown, error: null };
  } catch {
    return {
      value: null,
      error: errorResponse("Send a valid JSON request.", 400),
    };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function verifyTurnstile(
  token: unknown,
  request: Request,
  action: RateLimitAction,
): Promise<Response | null> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV !== "production") return null;
    return errorResponse(
      "Bot protection is not configured. Please contact the site owner.",
      503,
    );
  }
  if (typeof token !== "string" || token.length < 10 || token.length > 2048) {
    return errorResponse("Complete the security check and try again.", 403);
  }

  let response: Response;
  try {
    response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
        }),
        signal: AbortSignal.timeout(8_000),
      },
    );
  } catch {
    return errorResponse(
      "Bot protection could not be reached. Please try again.",
      503,
    );
  }

  if (!response.ok) {
    return errorResponse(
      "Bot protection could not be reached. Please try again.",
      503,
    );
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    return errorResponse(
      "Bot protection returned an invalid response.",
      503,
    );
  }

  if (
    !isRecord(result) ||
    result.success !== true ||
    result.hostname !== new URL(request.url).hostname ||
    result.action !== action
  ) {
    return errorResponse("The security check expired. Please try again.", 403);
  }

  return null;
}

function getClientAddress(request: Request): string | null {
  const direct = request.headers.get("x-real-ip")?.trim();
  if (direct && isIP(direct)) return direct;
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded
      ?.split(",")
      .map((address) => address.trim())
      .find((address) => isIP(address)) ?? null
  );
}

export async function enforceBurstLimit(
  request: Request,
  action: RateLimitAction,
): Promise<Response | null> {
  const { requests, windowSeconds } = RATE_LIMITS[action];
  const secret = process.env.RATE_LIMIT_SECRET;
  const address = getClientAddress(request);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !secret ||
    (process.env.NODE_ENV === "production" && secret.length < 32) ||
    !supabaseUrl ||
    !serviceRoleKey ||
    !address
  ) {
    if (process.env.NODE_ENV !== "production") return null;
    return errorResponse(
      "API abuse protection is not configured. Please contact the site owner.",
      503,
    );
  }

  const requestKey = createHmac("sha256", secret)
    .update(`${action}:${address}`)
    .digest("hex");

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase.rpc("consume_api_rate_limit", {
      p_request_key: requestKey,
      p_max_requests: requests,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      console.error("API burst-limit check failed:", error.code);
      return errorResponse(
        "API abuse protection is temporarily unavailable.",
        503,
      );
    }
    if (!data || !data.allowed) {
      const retryAfter = Math.max(
        1,
        Number(data?.retry_after_seconds) || windowSeconds,
      );
      return Response.json(
        { error: "Too many rapid requests. Please retry shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        },
      );
    }
  } catch (error) {
    console.error(
      "API burst-limit configuration failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    if (process.env.NODE_ENV === "production") {
      return errorResponse(
        "API abuse protection is temporarily unavailable.",
        503,
      );
    }
  }

  return null;
}
