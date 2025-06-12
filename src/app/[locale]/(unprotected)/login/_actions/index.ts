'use server'

import { prisma } from "@/lib/db";
import { LoginSchema } from "@/lib/schemas";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function login(data: z.infer<typeof LoginSchema>) {
  const parsed = LoginSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    throw new Error("incorrectCredentials");
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    throw new Error("incorrectCredentials");
  }

  await createSession(user.id);
  redirect("/");
}
