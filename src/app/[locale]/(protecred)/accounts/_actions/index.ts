'use server'

import { Account, Wallet } from "@/generated/prisma"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

function genMt5Id() {
  // 9 случайных цифр + префикс "mt"
  const num = Math.floor(Math.random() * 1_000_000_000)
    .toString()
    .padStart(9, "0")
  return `mt${num}`  // например: "mt004582371"
}

export async function createAccount(currency: string, userId: string) {
  try {
    if (!userId) throw new Error("Unauthorized")

    const account = await prisma.account.create({
      data: {
        userId,
        currency,
        mt5Id: genMt5Id(), 
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

type TransferInput = {
  wallet: Wallet
  account: Account
  amount: number
}

export async function transferFundsToAccount({ wallet, account, amount }: TransferInput) {
  try {
    const available = wallet.balance - (wallet.withdrawn ?? 0)

    if (available < amount) {
      throw new Error('insufficientFunds')
    }

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          withdrawn: (wallet.withdrawn ?? 0) + amount,
        },
      }),
      prisma.account.update({
        where: { id: account.id },
        data: {
          balance: account.balance + amount,
          freeMargin: account.freeMargin + amount,
        },
      }),
    ])
    revalidatePath('/accounts')
  } catch (error: any) {
    console.error('[TransferFundsToAccount]', error)
    throw new Error(error.message || 'unexpectedError')
  }
}

export async function getUser(userId: string) {
  try {
    console.log('Fetching user with ID:', userId)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true, accounts: true },
    })
    return user
  } catch (error) {
    console.error('[GetUser]', error)
    throw new Error('userFetchFailed')
  }
}