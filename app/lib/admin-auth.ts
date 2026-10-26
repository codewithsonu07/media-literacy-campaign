import {
  createServiceSupabaseClient,
  createSupabaseServerClient,
  getModeratorEmails,
} from "./supabase/server.ts";

export async function requireModerator() {
  const emails = getModeratorEmails();
  if (emails.length === 0) {
    return {
      response: Response.json(
        { error: "Moderator access is not configured." },
        { status: 503 },
      ),
    };
  }

  try {
    const authClient = await createSupabaseServerClient(true);
    const {
      data: { user },
    } = await authClient.auth.getUser();
    if (!user) {
      return {
        response: Response.json(
          { error: "Sign in as a moderator to continue." },
          { status: 401 },
        ),
      };
    }
    if (!user.email || !emails.includes(user.email.toLowerCase())) {
      return {
        response: Response.json(
          { error: "This account is not allowed to moderate claims." },
          { status: 403 },
        ),
      };
    }
    return { client: createServiceSupabaseClient() };
  } catch (error) {
    console.error(
      "Moderator authentication failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return {
      response: Response.json(
        { error: "Moderator access is temporarily unavailable." },
        { status: 503 },
      ),
    };
  }
}
