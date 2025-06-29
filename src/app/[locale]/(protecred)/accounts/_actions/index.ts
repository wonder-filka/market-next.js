'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createAccount(currency: string, userId: string) {
  try {
    if (!userId) throw new Error("Unauthorized")

    const account = await prisma.account.create({
      data: {
        userId,
        currency,
        mt5Id: String(Math.floor(Math.random() * 1_000_000_000)), 
        type: "hedging",
        isDemo: true,
        balance: 0,
        freeMargin: 0,
      },
    })

    revalidatePath("/accounts")
    return account
  } catch (error) {
    console.error("❌ Ошибка при создании аккаунта:", error)
    throw new Error("accountCreationFailed")
  }
}
