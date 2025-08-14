'use server';
import 'server-only';
import { notifySupportNewMessage } from '@/lib/telegram';

type Input = {
  message: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export async function sendMessToTelegramAction(input: Input) {
  // Минимальная валидация без Zod
  const msg = (input.message ?? '').trim();
  if (!msg) return { ok: false as const, error: 'emptyMessage' as const };
  const safeMsg = msg.length > 3800 ? msg.slice(0, 3797) + '…' : msg;

  try {
    await notifySupportNewMessage({
      message: safeMsg,
      firstName: input.firstName,
      lastName: input.lastName ?? '',
      email: input.email ?? '',
      phone: input.phone ?? '',
    });
    return { ok: true as const };
  } catch (e) {
    console.error('Telegram notify (support) failed:', e);
    return { ok: false as const, error: 'telegramFailed' as const };
  }
}
