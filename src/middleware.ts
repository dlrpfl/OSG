import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 1. Admin Auth Check
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session');
    const isLoginPage = request.nextUrl.pathname === '/admin/login';

    if (!adminSession && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (adminSession && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
