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

export async function transferFundsToAccount({ wallet, account, amount, rates }: TransferInput & { rates: Record<string, number> }) {
  try {
    // amount — в USD!
    const available = wallet.balance - (wallet.withdrawn ?? 0)
    if (available < amount) throw new Error('insufficientFunds')

    let creditedAmount = amount
    if (account.currency !== 'USD') {
      const rate = rates[account.currency]
      if (!rate) throw new Error('rateNotFound')
      creditedAmount = amount * rate // USD → EUR (или другая валюта)
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
          balance: account.balance + creditedAmount,
          freeMargin: account.freeMargin + creditedAmount,
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

export async function withdrawFromAccountToWallet({
  accountId,
  amount,
  rateToUSD,
}: {
  accountId: string
  amount: number
  rateToUSD: number
}) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: { user: { include: { wallet: true } } }
  })

  console.log("amount", amount)
    console.log("rateToUSD", rateToUSD)
    console.log("account.balance", account.balance)
  if (!account) throw new Error("accountNotFound")
  const wallet = account.user.wallet

  if (account.freeMargin < amount) throw new Error("insufficientFunds")

  // Рассчитываем сумму в USD для зачисления на кошелек
  const amountInUSD = +(amount * (rateToUSD ?? 1)).toFixed(2)

  await prisma.$transaction([
    prisma.account.update({
      where: { id: accountId },
      data: {
        balance: account.balance - amount,
        freeMargin: account.freeMargin - amount,
      },
    }),
    prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance + amountInUSD,
      },
    }),
  ])

  revalidatePath('/accounts')
}