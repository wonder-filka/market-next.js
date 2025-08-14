// lib/mail.ts
import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;
  const secure = port === 465 || process.env.SMTP_SECURE === 'true';

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return transporter;
}


function buildTemplates(code: string, locale: "en" | "ru") {
  const dict = {
    ru: {
      subject: 'Код для сброса пароля',
      intro: 'Ваш код для сброса пароля:',
      validity: 'Код действителен 10 минут.',
      ignore: 'Если вы не запрашивали сброс, просто игнорируйте это письмо.',
    },
    en: {
      subject: 'Password reset code',
      intro: 'Your password reset code:',
      validity: 'The code is valid for 10 minutes.',
      ignore: 'If you did not request a reset, please ignore this email.',
    },
  } as const;

  const t = dict[locale] ?? dict.ru;

  const html = `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; color:#0f172a; max-width:520px; margin:0 auto;">
    <h2 style="font-weight:600; margin:0 0 12px">${t.subject}</h2>
    <p style="margin:0 0 16px">${t.intro}</p>
    <div style="font-size:32px; letter-spacing:6px; font-weight:700; padding:12px 16px; text-align:center; border:1px solid #e2e8f0; border-radius:12px; background:#f8fafc; color:#111827;">
      ${code}
    </div>
    <p style="margin:16px 0 0">${t.validity}</p>
    <p style="margin:6px 0 0; color:#475569">${t.ignore}</p>
  </div>`.trim();

  const text = `${t.subject}\n\n${t.intro} ${code}\n${t.validity}\n${t.ignore}`;

  return { subject: t.subject, html, text };
}


export async function sendPasswordResetCode(
  email: string,
  code: string,
  locale: "en" | "ru" 
): Promise<boolean> {
  const from = process.env.SMTP_FROM || '2TradeIn <support@2trade.in>';
  const { subject, html, text } = buildTemplates(code, locale);

  try {
    const res =  await getTransporter().sendMail({
      from,
      to: email,
      subject,
      html,
      text,
    });
    console.log("res", res)
    return true;
  } catch (err) {
    console.error('sendPasswordResetCode error:', err);
    return false;
  }
}


// lib/mail.ts (добавь ниже существующего кода)
export async function sendSupportEmail(opts: {
  fromEmail: string;
  message: string;
  locale: 'ru' | 'en';
  subject?: string;
  // необязательно, но удобно передавать метаданные
  meta?: { name?: string; userId?: string; phone?: string };
}): Promise<boolean> {
  const supportTo = process.env.SUPPORT_INBOX || process.env.SMTP_FROM;
  if (!supportTo) {
    console.error('sendSupportEmail error: SUPPORT_INBOX or SMTP_FROM is required');
    return false;
  }

  const dict = {
    ru: {
      subject: 'Новое сообщение в поддержку',
      intro: 'Поступило новое сообщение с формы обратной связи.',
      from: 'Отправитель',
      email: 'Email',
      phone: 'Телефон',
      userId: 'ID пользователя',
      message: 'Сообщение',
    },
    en: {
      subject: 'New support message',
      intro: 'A new message has been submitted via the feedback form.',
      from: 'Sender',
      email: 'Email',
      phone: 'Phone',
      userId: 'User ID',
      message: 'Message',
    },
  } as const;

  const t = dict[opts.locale] ?? dict.ru;
  const subject = opts.subject || t.subject;

  const safe = (s?: string) =>
    String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');

  const html = `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; color:#0f172a; max-width:640px; margin:0 auto;">
    <h2 style="font-weight:600; margin:0 0 12px">${t.subject}</h2>
    <p style="margin:0 0 16px">${t.intro}</p>

    <table style="border-collapse:collapse; width:100%; margin-bottom:12px">
      <tbody>
        ${opts.meta?.name ? `<tr><td style="padding:6px 8px; color:#475569">${t.from}:</td><td style="padding:6px 8px"><b>${safe(opts.meta.name)}</b></td></tr>` : ''}
        <tr><td style="padding:6px 8px; color:#475569">${t.email}:</td><td style="padding:6px 8px"><b>${safe(opts.fromEmail)}</b></td></tr>
        ${opts.meta?.phone ? `<tr><td style="padding:6px 8px; color:#475569">${t.phone}:</td><td style="padding:6px 8px">${safe(opts.meta.phone)}</td></tr>` : ''}
        ${opts.meta?.userId ? `<tr><td style="padding:6px 8px; color:#475569">${t.userId}:</td><td style="padding:6px 8px"><code>${safe(opts.meta.userId)}</code></td></tr>` : ''}
      </tbody>
    </table>

    <div style="border:1px solid #e2e8f0; border-radius:12px; padding:12px 16px; background:#f8fafc;">
      <div style="font-weight:600; margin-bottom:6px">${t.message}:</div>
      <div style="white-space:pre-wrap; line-height:1.5">${safe(opts.message)}</div>
    </div>
  </div>`.trim();

  const text =
`${t.subject}

${t.intro}
${t.from}: ${opts.meta?.name ?? '-'}
${t.email}: ${opts.fromEmail}
${t.phone}: ${opts.meta?.phone ?? '-'}
${t.userId}: ${opts.meta?.userId ?? '-'}

${t.message}:
${opts.message}`;

  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM || 'No Reply <no-reply@example.com>',
      to: supportTo,
      subject,
      html,
      text,
      replyTo: opts.fromEmail, 
    });
    return true;
  } catch (err) {
    console.error('sendSupportEmail error:', err);
    return false;
  }
}
