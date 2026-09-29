import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APEX_HOSTNAME, isSiteHost, isWorkersDevHost, isWwwHost } from "@/lib/preview-host";

const PREVIEW_ROBOTS_TXT = "User-agent: *\nDisallow: /\n";
const PREVIEW_ROBOTS_TAG = "noindex, nofollow";

function requestHost(request: NextRequest): string {
  return request.headers.get("host") ?? request.nextUrl.hostname;
}

function withSiteHeaders(response: NextResponse, host: string): NextResponse {
  if (!isSiteHost(host)) return response;
  response.headers.set("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  return response;
}

/** 301 www to apex. Preserve path and query. */
function redirectWwwToApex(request: NextRequest): NextResponse {
  const dest = new URL(request.url);
  dest.protocol = "https:";
  dest.hostname = APEX_HOSTNAME;
  dest.port = "";
  return NextResponse.redirect(dest, 301);
}

/**
 * Host gates only. OpenNext Cloudflare still requires Edge `middleware.ts`.
 */
export function middleware(request: NextRequest) {
  const host = requestHost(request);

  if (isWwwHost(host)) {
    return withSiteHeaders(redirectWwwToApex(request), host);
  }

  if (isWorkersDevHost(host)) {
    if (request.nextUrl.pathname === "/robots.txt") {
      return new NextResponse(PREVIEW_ROBOTS_TXT, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Robots-Tag": PREVIEW_ROBOTS_TAG,
          "Cache-Control": "public, max-age=300",
        },
      });
    }
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", PREVIEW_ROBOTS_TAG);
    return response;
  }

  return withSiteHeaders(NextResponse.next(), host);
}
