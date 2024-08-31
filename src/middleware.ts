import { NextResponse, type NextRequest } from "next/server";

export default function middleware(req: NextRequest): NextResponse {
  const token = req.cookies.get("authtoken");
  const { pathname } = req.nextUrl;

  console.log(`Request path: ${pathname}`); // Log the request path

  // Ignore requests to static files or other assets in the `_next` directory
  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Define routes that are accessible without authentication
  const publicRoutes = ["/login", "/signup", "/", "/verify"];
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // If the user is already authenticated, redirect them away from login and signup pages
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If the user is not authenticated, redirect them to login page
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow requests to proceed normally
  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/product/:path*",
    "/:path*",
  ],
};
