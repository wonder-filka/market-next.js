import { createI18nMiddleware } from "next-international/middleware";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const I18nMiddleware = createI18nMiddleware({
	locales: ["ru", "en"],
	defaultLocale: "ru",
	urlMappingStrategy: "rewrite",
});

const protectedRoutes = [
	"/ru/quotes",
	"/en/quotes",
	"/en/accounts",
	"/ru/accounts",
	"/en/portfolio",
	"/ru/portfolio",
	"/en/settings",
	"/ru/settings",
];

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
		!request.nextUrl.pathname.startsWith("/accounts")
	) {
		return NextResponse.redirect(new URL("/accounts", request.nextUrl));
	}
	return response;
}

export const config = {
	matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
