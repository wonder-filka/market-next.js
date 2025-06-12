'use server';

import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/helpers";
import { RegistrationSchema } from "@/lib/schemas";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function signup(data: z.infer<typeof RegistrationSchema>) {
	const parsed = RegistrationSchema.safeParse(data);
	if (!parsed.success) {
		throw new Error("Invalid form data");
	}
	const normalizedPhone = normalizePhone(parsed.data.phone);
	const existing = await prisma.user.findFirst({
		where: {
			OR: [{ email: parsed.data.email }, { phone: normalizedPhone }],
		},
	});
	if (existing) {
		throw new Error("userExists");
	}

	const passwordHash = await bcrypt.hash(parsed.data.password, 10);
	const user = await prisma.user.create({
		data: {
			firstName: parsed.data.firstName,
			lastName: parsed.data.lastName,
			email: parsed.data.email,
			phone: normalizedPhone,
			passwordHash,
		},
	});
	await createSession(user.id);
	redirect("/");
}
