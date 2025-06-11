import { createI18nMiddleware } from "next-international/middleware";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const I18nMiddleware = createI18nMiddleware({
	locales: ["ru", "en"],
	defaultLocale: "ru",
	urlMappingStrategy: "rewrite",
});

const protectedRoutes = ["/ru/profile", "/en/profile", "/en/dashboard", "/ru/dashboard"];

export async function middleware(request: NextRequest) {
	const response = I18nMiddleware(request);

	const path = request.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const cookie = (await cookies()).get("session")?.value;
	const session = await decrypt(cookie);
	if (isProtectedRoute && !session?.userId) {
		return NextResponse.redirect(new URL("/", request.nextUrl));
	}

	if (
		!isProtectedRoute &&
		session?.userId &&
		!request.nextUrl.pathname.startsWith("/profile")
	) {
		return NextResponse.redirect(new URL("/profile", request.nextUrl));
	}
	return response;
}

export const config = {
	matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
