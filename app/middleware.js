import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth", "/capture", "/api/capture", "/api/health", "/_next", "/favicon.ico"];

export function middleware(request) {
  const pw = process.env.DASHBOARD_PASSWORD;
  if (!pw) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const cookie = request.cookies.get("ops_auth")?.value;
  if (cookie) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
