'use client';

import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentLocale, useI18n } from '@/locales/client';

import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { FormErrorMessage } from '@/components/custom/form-error-message';
import { ForgotSchema } from '@/lib/schemas';
import { requestPasswordReset, verifyPasswordResetCode } from '../_actions';
import { FormNewPass } from './form-new-pass';

export const ForgotForm = () => {
  const t = useI18n();
  const locale = useCurrentLocale();
  const [isPending, startTransition] = useTransition();

  const [isSendCode, setIsSendCode] = useState(false);   // шаг 2 (ввод кода)
  const [isVerified, setIsVerified] = useState(false);   // шаг 3 (новый пароль)

  const [otp, setOtp] = useState('');
  const [otpMsg, setOtpMsg] = useState<string | null>(null);   // сообщения только для шага кода
  const [formError, setFormError] = useState<string | null>(null); // общая ошибка шага email

  const form = useForm<z.infer<typeof ForgotSchema>>({
    resolver: zodResolver(ForgotSchema),
    defaultValues: { email: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  // Шаг 1: отправка кода на email
  const onSubmitEmail: SubmitHandler<z.infer<typeof ForgotSchema>> = (data) => {
    setFormError(null);
    startTransition(async () => {
      try {
        const res = await requestPasswordReset(data.email, locale as 'ru' | 'en');
        if (res.ok) {
          setIsSendCode(true);
          setIsVerified(false);
          setOtp('');
          setOtpMsg(null);
        } else {
          if (res.error === 'emailNotFound') {
            form.setError('email', { type: 'server', message: t('emailNotFound') });
          } else if (res.error === 'rateLimited') {
            setFormError(t('rateLimited'));
          } else if (res.error === 'emailSendFailed') {
            setFormError(t('emailSendFailed'));
          } else {
            setFormError(t('error'));
          }
        }
      } catch {
        setFormError(t('error'));
      }
    });
  };

  // Шаг 2: проверка кода (UX-проверка — сервер НИЧЕГО не помечает)
  const onSubmitCode = () => {
    setOtpMsg(null);
    startTransition(async () => {
      try {
        const email = form.getValues('email');
        const res = await verifyPasswordResetCode(email, otp);
        if (res.ok) {
          setIsVerified(true); // показываем форму нового пароля
        } else {
          setOtpMsg(res.error === 'emailNotFound' ? t('emailNotFound') : t('invalidCode'));
        }
      } catch {
        setOtpMsg(t('invalidCode'));
      }
    });
  };

  // UI
  return (
    <>
      {isSendCode ? (
        isVerified ? (
          // Шаг 3: форма нового пароля (на сервере будет финальная проверка кода)
          <FormNewPass email={form.getValues('email')} code={otp} />
        ) : (
          // Шаг 2: ввод и проверка кода
          <div className="space-y-8 flex flex-col justify-center items-center">
            <div className="text-sm text-muted-foreground">{t('enterCode')}</div>

            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {otpMsg && <div className="text-red-600 text-sm">{otpMsg}</div>}

            <div className="flex flex-col w-full gap-4">
              <Button
                type="button"
                className="w-full"
                onClick={onSubmitCode}
                disabled={isPending || otp.length !== 6}
              >
                {t('sendCode')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setIsSendCode(false);
                  setIsVerified(false);
                  setOtp('');
                  setOtpMsg(null);
                  setFormError(null);
                  form.clearErrors();
                }}
                disabled={isPending}
              >
                {t('back')}
              </Button>
            </div>

            {isPending && <div className="text-xs text-muted-foreground">…</div>}
          </div>
        )
      ) : (
        // Шаг 1: ввод email
        <Form {...form}>
          <form noValidate className="space-y-4" onSubmit={form.handleSubmit(onSubmitEmail)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // очищаем только "серверную" ошибку поля, чтобы не дублировалось
                        if (form.formState.errors.email?.type === 'server') {
                          form.clearErrors('email');
                        }
                      }}
                    />
                  </FormControl>
                  <FormErrorMessage error={form.formState.errors.email?.message} t={t} />
                </FormItem>
              )}
            />

            {formError && <div className="text-red-600 text-sm">{formError}</div>}

            <Button disabled={isPending} type="submit" className="w-full mt-8">
              {t('sendCode')}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};
