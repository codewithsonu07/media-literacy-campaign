"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          action: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  siteKey: string;
  action: "analysis" | "submission";
  onToken: (token: string) => void;
  onError?: (message: string) => void;
}

export default function TurnstileWidget({
  siteKey,
  action,
  onToken,
  onError,
}: TurnstileWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const tokenCallback = useRef(onToken);
  const errorCallback = useRef(onError);

  useEffect(() => {
    tokenCallback.current = onToken;
    errorCallback.current = onError;
  }, [onError, onToken]);

  useEffect(() => {
    if (!siteKey || !scriptReady || !container.current || !window.turnstile) {
      return;
    }

    const widgetId = window.turnstile.render(container.current, {
      sitekey: siteKey,
      action,
      callback: (token) => tokenCallback.current(token),
      "expired-callback": () => {
        tokenCallback.current("");
        errorCallback.current?.("The security check expired. Complete it again.");
      },
      "error-callback": () => {
        tokenCallback.current("");
        errorCallback.current?.("The security check failed. Try again.");
      },
    });

    return () => window.turnstile?.remove(widgetId);
  }, [action, scriptReady, siteKey]);

  if (!siteKey) return null;

  return (
    <div className="space-y-1">
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() =>
          errorCallback.current?.("The security check could not be loaded.")
        }
      />
      <div ref={container} aria-label="Security check" />
    </div>
  );
}
