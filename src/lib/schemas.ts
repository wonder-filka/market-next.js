import { z } from "zod";

export const RegistrationSchema = z.object({
	firstName: z.string().min(2, "minFirstName"),
	lastName: z.string().min(2, "minLastName"),
	email: z.string().email("invalidEmail"),
	phone: z.string().min(10, "invalidPhone"),
	password: z.string().min(8, "shortPassword").max(32, "longPassword"),
});
