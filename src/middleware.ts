import { createI18nMiddleware } from "next-international/middleware";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./lib/session";

const I18nMiddleware = createI18nMiddleware({
	locales: ["ru", "en"],
	defaultLocale: "ru",
	urlMappingStrategy: "rewrite",
});

const protectedRoutes = [
	"/ru/report",
	"/en/report",
	"/en/accounts",
	"/ru/accounts",
	"/en/portfolio",
	"/ru/portfolio",
	"/en/settings",
	"/ru/settings",
	"/en/dashboard",
	"/ru/dashboard",
];

export async function middleware(request: NextRequest) {
	const response = I18nMiddleware(request);

	const path = request.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const cookie = (await cookies()).get("session")?.value;
	const session = await decrypt(cookie);
	if (session) {
		const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
		const newSession = await encrypt({
			userId: session.userId,
			expiresAt: newExpiresAt,
		});
		response.cookies.set("session", newSession, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			expires: newExpiresAt,
			sameSite: "lax",
			path: "/",
		});
	}

	const adminSupportRoutesPrefixes = [
		"/ru/admin",
		"/en/admin",
		"/ru/chat",
		"/en/chat",
		// These need to specifically check for startsWith for dynamic segments
		"/ru/chat/", // Catches /ru/chat/ and /ru/chat/:chatId
		"/en/chat/", // Catches /en/chat/ and /en/chat/:chatId <-- **THIS WAS MISSED AND IS NOW ADDED**
	];

	const requiresAdminSupportAuth = adminSupportRoutesPrefixes.some(
		(prefix) => path.startsWith(prefix) || path === prefix
	);

	 const adminId = process.env.ADMIN_ID;
	if (requiresAdminSupportAuth) {
		if (
			!session?.userId ||
			(session.userId !== adminId)
		) {
			const redirectToHome = NextResponse.redirect(
				new URL("/", request.nextUrl)
			);
			return redirectToHome;
		}
		return response;
	}

	if (isProtectedRoute && !session?.userId) {
		const redirectResponse = NextResponse.redirect(
			new URL("/", request.nextUrl)
		);
		redirectResponse.cookies.delete("session");
		return redirectResponse;
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
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|robots.txt)(?!.*\\.).*)",
		"/socket.io",
	],
};
