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
  const from = process.env.SMTP_FROM || 'No Reply <no-reply@example.com>';
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
