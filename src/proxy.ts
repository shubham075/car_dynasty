import { NextResponse, type NextRequest } from "next/server";

// Optimistic gate only: bounce visitors with no session cookie away from the
// admin before rendering. The real check (DB-backed) is requireUser() in the
// admin layout, pages and every admin Server Action.
const SESSION_COOKIE = "cd_session";

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  if (!req.cookies.has(SESSION_COOKIE)) {
    const url = new URL("/admin/login", req.nextUrl);
    if (pathname !== "/admin") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
