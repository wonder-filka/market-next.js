"use server";

import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export async function getPostitions() {
	const userId = await getSessionUserId();
	if (!userId) {
		throw new Error("unauthenticated");
	}

	try {
		const positions = await prisma.position.findMany({
			where: { userId },
			include: {
				account: {
					select: {
						mt5Id: true,
					},
				},
			},
			orderBy: { date: "desc" },
		});
		return positions;
	} catch (e: any) {
		console.error("getReportData error", e);
		return [];
	}
}
