import { z } from "zod";

export const RegistrationSchema = z.object({
	firstName: z.string().min(2, "minFirstName"),
	lastName: z.string().min(2, "minLastName"),
	email: z.string().email("invalidEmail"),
	phone: z.string().min(10, "invalidPhone"),
	password: z.string().min(8, "shortPassword").max(128, "longPassword"),
	currency: z.enum(["RUB", "EUR", "GBP", "USD"]),
});

export const LoginSchema = z.object({
	email: z.string().email("invalidEmail"),
	password: z.string().min(8, "shortPassword"),
});

export const ForgotSchema = z.object({
	email: z.string().email("invalidEmail"),
});

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'shortPassword') 
    .max(128, 'longPassword'),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: 'passwordMismatch',
  path: ['confirm'],
});