import { NextResponse, type NextRequest } from "next/server";

export default function middleware(req: NextRequest): NextResponse {
  const token = req.cookies.get("authtoken");
  const { pathname } = req.nextUrl;

  console.log(`Request path: ${pathname}`);

  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const publicRoutes = ["/login", "/signup", "/", "/verify", /^\/verify\/.+/];

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some((route) =>
    typeof route === "string" ? pathname === route : route.test(pathname)
  );

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/product/:path*",
    "/:path*",
  ],
};
