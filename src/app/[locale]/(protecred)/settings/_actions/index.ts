"use server";

import { prisma } from "@/lib/db";
import { UpdateUserBasicSettingsInput } from "@/lib/types";
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
	try {
		return prisma.user.update({
			where: { id },
			data: {
				firstName,
				lastName,
				email,
				phone,
			},
		});
	} catch (error) {
		console.error("Error updating user settings:", error);
		return { message: "updateFailed" };
	}
}

/**
 * Gets the basic settings for a user.
 * @param userId - The user's ID.
 * @returns The user object.
 */
export async function getUserBasicSettings(userId: string) {
	try {
		const result = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				phone: true,
				verificationStatus: true,
			},
		});
		if (!result) {
			return { message: "userNotFound" };
		}
		return result;
	} catch (error) {
		console.error("Error fetching user settings:", error);
		return { message: "manualError" };
	}
}

const UPLOAD_DIR =
	process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

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
	try {
		let fileBuffer: Buffer;
		let fileExt = "jpg";

		if (Buffer.isBuffer(file)) {
			fileBuffer = file as Buffer;
		} else {
			fileBuffer = Buffer.from(await file.arrayBuffer());
			const mimeType = (file as File).type || "";
			const match = mimeType.match(/\/(jpeg|jpg|png|webp|heic|heif|pdf)$/i);
			if (match) {
				const ext = match[1].toLowerCase();
				fileExt = ext === "jpeg" ? "jpg" : ext;
			} else {
				throw new Error("Unsupported file type");
			}
		}

		const safeDocType =
			(documentType || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 50) || "doc";

		const fileName = `${userId}_${safeDocType}.${fileExt}`;

		await fs.mkdir(UPLOAD_DIR, { recursive: true });

		const filePath = path.join(UPLOAD_DIR, fileName);
		await fs.writeFile(filePath, fileBuffer);
		return prisma.user.update({
			where: { id: userId },
			data: { verificationStatus: "PENDING" },
			select: {
				id: true,
				verificationStatus: true,
				firstName: true,
				lastName: true,
				email: true,
				phone: true,
			},
		});
	} catch (error) {
		console.error("Error verifying user:", error);
		return { message: "verificationFailed" };
	}
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
	try {
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
		return { success: true };
	} catch (error) {
		console.error("Error changing user password:", error);
		return { message: "passwordChangeFailed" };
	}
};
