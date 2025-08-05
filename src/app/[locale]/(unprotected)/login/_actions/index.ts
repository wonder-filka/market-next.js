"use server";

import { prisma } from "@/lib/db";
import { LoginSchema } from "@/lib/schemas";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function login(data: z.infer<typeof LoginSchema>) {
	try {
		const parsed = LoginSchema.safeParse(data);
		if (!parsed.success) {
			return { message: "Invalid form data" };
		}

		const user = await prisma.user.findUnique({
			where: { email: parsed.data.email },
		});

		if (!user) {
			return { message: "incorrectCredentials" };
		}

		const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
		if (!valid) {
			return { message: "incorrectCredentials" };
		}

		await createSession(user.id);
	} catch (error) {
		console.error(error);
		return { message: "Error db" };
	}
}
