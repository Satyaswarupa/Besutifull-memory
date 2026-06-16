import { NextResponse } from "next/server";

const AUTH_COOKIE = "memories_token";
const PROTECTED_PATHS = ["/profile", "/gallery"];
const AUTH_PATHS = ["/login", "/signup"];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && token) {
    return NextResponse.redirect(new URL("/gallery", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/gallery/:path*", "/login", "/signup"],
};
