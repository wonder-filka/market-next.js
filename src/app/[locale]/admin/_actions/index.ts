"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function changePositionPrice(
	positionId: string,
	newPrice: number,
	pnl: number
) {
	try {
		const position = await prisma.position.findUnique({
			where: { id: positionId },
		});

		if (!position) {
			throw new Error("Position not found");
		}

		const updatedPosition = await prisma.position.update({
			where: { id: positionId },
			data: { 
				current: newPrice, 
				pnl: newPrice !== 0 ? pnl : 0 
			},
		});
		revalidatePath("/admin");
		return updatedPosition;
	} catch (error) {
		console.error("Error changing position price:", error);
		return null;
	}
}
