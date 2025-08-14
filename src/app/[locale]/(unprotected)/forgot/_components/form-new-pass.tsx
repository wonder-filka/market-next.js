// app/(...)/FormNewPass.tsx
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPasswordSchema } from '@/lib/schemas';
import { useI18n } from '@/locales/client';
import { resetPasswordFinalize } from '../_actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { FormErrorMessage } from '@/components/custom/form-error-message';
import { CheckCircle } from 'lucide-react';

type Props = { email: string; code: string };

export function FormNewPass({ email, code }: Props) {
  const t = useI18n();
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: '', confirm: '' },
  });

  const onSubmit = (data: z.infer<typeof NewPasswordSchema>) => {
    startTransition(async () => {
      const res = await resetPasswordFinalize(email, code, data.password);
      if (res.ok) {
        setIsSuccess(true);
        form.reset();
      } else {
        const msg =
          res.error === 'invalidCode' ? t('invalidCode') :
          res.error === 'emailNotFound' ? t('invalidEmail') :
          t('error');
        form.setError('password', { type: 'server', message: msg });
      }
    });
  };

  return isSuccess ? (
    <div className="text-green-600 text-sm w-full flex flex-col gap-4 items-center">
      {t('passwordChangedSuccess')}
      <CheckCircle />
    </div>
  ) : (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('newPassword')}</FormLabel>
              <FormControl>
                <Input type="password" disabled={isPending} placeholder="••••••••" {...field} />
              </FormControl>
              <FormErrorMessage error={form.formState.errors.password?.message} t={t} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('confirmPassword')}</FormLabel>
              <FormControl>
                <Input type="password" disabled={isPending} placeholder="••••••••" {...field} />
              </FormControl>
              <FormErrorMessage error={form.formState.errors.confirm?.message} t={t} />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {t('savePassword')}
        </Button>
      </form>
    </Form>
  );
}
