import { auth } from "@/app/api/auth/[...nextauth]/route";
import { ROUTES } from "@/constants/routes";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isAuth = !!session;
  const isLoginPage = request.nextUrl.pathname.startsWith(ROUTES.SIGNIN);

  if (!isAuth && !isLoginPage) {
    return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
  }

  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  return NextResponse.next();
}

// Where middleware should run
export const config = {
  matcher: [
    // Protect all routes except the login and API
    "/((?!_next|api/auth|auth/signin|auth/signup|favicon.ico).*)",
  ],
};
