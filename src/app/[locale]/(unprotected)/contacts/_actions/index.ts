'use server';
import 'server-only';
import { sendSupportEmail } from '@/lib/mail';

type Input = {
  email: string;
  message: string;
  // опционально можно принять userId/имя/телефон, если есть авторизованный пользователь
  name?: string;
  userId?: string;
  phone?: string;
  locale?: 'ru' | 'en';
};

export async function submitFeedbackAction(input: Input) {
  // Простейшая защита и валидация на сервере (не обязательно с Zod)
  const email = (input.email ?? '').trim();
  const message = (input.message ?? '').trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false as const, error: 'invalidEmail' as const };

  if (message.length < 10)
    return { ok: false as const, error: 'tooShortMessage' as const };

  const ok = await sendSupportEmail({
    fromEmail: email,
    message,
    locale: input.locale ?? 'ru',
    meta: {
      name: input.name,
      userId: input.userId,
      phone: input.phone,
    },
  });

  return ok ? { ok: true as const } : { ok: false as const, error: 'emailSendFailed' as const };
}
