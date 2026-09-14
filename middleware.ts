import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "auth_token";
const JWT_SECRET =
  process.env.JWT_SECRET || "fallback_default_jwt_secret_key_change_in_production";
const secretKey = new TextEncoder().encode(JWT_SECRET);

const protectedRoutes = ["/write"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, secretKey);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent logged in users from loading login/register pages
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      try {
        await jwtVerify(token, secretKey);
        return NextResponse.redirect(new URL("/profile", request.url));
      } catch {
        // Invalid or expired token, allow sign in
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/write/:path*", "/login", "/register"],
};
