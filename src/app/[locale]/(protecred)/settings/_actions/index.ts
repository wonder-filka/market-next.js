"use server";

import { prisma } from "@/lib/db";
import { UpdateUserBasicSettingsInput } from "@/lib/types";
import { writeFile } from "fs/promises";
import path from "path";
import { promises as fs } from "fs";
import bcrypt from "bcryptjs";

/**
 * Updates the basic settings for a user.
 * @param input - The user settings to update.
 * @returns The updated user object.
 */
export async function updateUserBasicSettings(
	input: UpdateUserBasicSettingsInput
) {
	const { id, firstName, lastName, email, phone } = input;

	return prisma.user.update({
		where: { id },
		data: {
			firstName,
			lastName,
			email,
			phone,
		},
	});
}

/**
 * Gets the basic settings for a user.
 * @param userId - The user's ID.
 * @returns The user object.
 */
export async function getUserBasicSettings(userId: string) {
	return prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
			phone: true,
			isVerifed: true,
		},
	});
}

/**
 * Handles user verification: saves the uploaded document and updates verification status.
 * @param params - The verification data.
 * @param params.userId - The user's ID.
 * @param params.documentType - The type of document.
 * @param params.file - The uploaded file (Buffer or File object).
 * @returns The updated user object.
 */
export const verifyUser = async (
	userId: string,
	documentType: string,
	file: File
) => {
	let fileBuffer: Buffer;
	let fileExt = "jpg";

	if (file instanceof Buffer) {
		fileBuffer = file;
	} else {
		fileBuffer = Buffer.from(await file.arrayBuffer());

		// Расширенная проверка типа
		const mimeType = file.type;
		const match = mimeType.match(/\/(jpeg|jpg|png|webp|heic|heif|pdf)$/);

		if (match) {
			const ext = match[1];
			fileExt = ext === "jpeg" ? "jpg" : ext; // нормализуем .jpeg → .jpg
		} else {
			throw new Error("Unsupported file type");
		}
	}

	const fileName = `${userId}_${documentType}.${fileExt}`;
	console.log("fileName", fileName);

	const dirPath = path.join(process.cwd(), "public", "verification");
	await fs.mkdir(dirPath, { recursive: true });

	const filePath = path.join(dirPath, fileName);
	await writeFile(filePath, fileBuffer);

	return prisma.user.update({
		where: { id: userId },
		data: { isVerifed: true },
		select: {
			id: true,
			isVerifed: true,
			firstName: true,
			lastName: true,
			email: true,
			phone: true,
		},
	});
};


/**
 * Changes the user's password.
 * @param userId - The user's ID.
 * @param currentPassword - The user's current password.
 * @param newPassword - The new password to set.
 * @returns True if password changed, otherwise throws error.
 */
export const changeUserPassword = async (
	userId: string,
	currentPassword: string,
	newPassword: string
) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { passwordHash: true },
	});

	if (!user || !user.passwordHash) {
		throw new Error("User not found");
	}

	const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
	if (!isMatch) {
		throw new Error("Current password is incorrect");
	}

	const hashedPassword = await bcrypt.hash(newPassword, 10);

	await prisma.user.update({
		where: { id: userId },
		data: { passwordHash: hashedPassword },
	});

	return true;
};
