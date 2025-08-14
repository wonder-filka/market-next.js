// app/(...)/_actions.ts
'use server';

import { prisma } from '@/lib/db';
import { sendPasswordResetCode } from '@/lib/mail';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const CODE_TTL_MINUTES = 10;
const MAX_ACTIVE_CODES_PER_USER = 3;

function hashCode(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex');
}
function genCode6(): string {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

export async function requestPasswordReset(emailRaw: string, locale: 'ru' | 'en') {
  const email = emailRaw.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false as const, error: 'emailNotFound' as const };

  const activeCount = await prisma.passwordResetCode.count({
    where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
  });
  if (activeCount >= MAX_ACTIVE_CODES_PER_USER) {
    return { ok: false as const, error: 'rateLimited' as const };
  }

  const code = genCode6();
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

  await prisma.passwordResetCode.create({
    data: { userId: user.id, codeHash, expiresAt },
  });

  const sent = await sendPasswordResetCode(email, code, locale);
  if (!sent) return { ok: false as const, error: 'emailSendFailed' as const };

  return { ok: true as const };
}

/** Предварительная проверка — НИЧЕГО не помечаем использованным */
export async function verifyPasswordResetCode(emailRaw: string, codeRaw: string) {
  const email = emailRaw.trim().toLowerCase();
  const code = codeRaw.trim();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false as const, error: 'emailNotFound' as const };

  const match = await prisma.passwordResetCode.findFirst({
    where: {
      userId: user.id,
      codeHash: hashCode(code),
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!match) return { ok: false as const, error: 'invalidCode' as const };
  return { ok: true as const };
}

/** Финализация — ПРОВЕРЯЕМ код и помечаем usedAt */
export async function resetPasswordFinalize(emailRaw: string, codeRaw: string, newPassword: string) {
  const email = emailRaw.trim().toLowerCase();
  const code = codeRaw.trim();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false as const, error: 'emailNotFound' as const };

  const match = await prisma.passwordResetCode.findFirst({
    where: {
      userId: user.id,
      codeHash: hashCode(code),
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });
  if (!match) return { ok: false as const, error: 'invalidCode' as const };

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
    prisma.passwordResetCode.update({ where: { id: match.id }, data: { usedAt: new Date() } }),
    // опционально: инвалидировать прочие активные коды
    prisma.passwordResetCode.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
        id: { not: match.id },
      },
      data: { usedAt: new Date() },
    }),
  ]);

  return { ok: true as const };
}
