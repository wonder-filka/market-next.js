'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useI18n } from '@/locales/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormErrorMessage } from '@/components/custom/form-error-message';
import { useState, useTransition } from 'react';

const cardNumberOnlyDigits = (v: string) => v.replace(/\D/g, '');

type Props = {
  available: number;
  currency: string;
};

export function CardForm({ available, currency }: Props) {
  const t = useI18n();
  const [pending, startTransition] = useTransition();
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const Schema = z.object({
    brand: z.enum(['VISA', 'MASTERCARD'], { required_error: 'required' }),
    holder: z.string().min(2, 'tooShort'),
    cardNumber: z
      .string()
      .transform(cardNumberOnlyDigits)
      .refine((val) => /^\d{12,19}$/.test(val), 'invalidCard'),
    amount: z
      .number({ invalid_type_error: 'invalidNumber' })
      .positive('positive')
      .refine((v) => v <= available, 'amountTooHigh'),
  });

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: { brand: 'VISA', holder: '', cardNumber: '', amount: undefined as unknown as number },
  });

  const onSubmit = (data: z.infer<typeof Schema>) => {
    setServerMsg(null);
    startTransition(async () => {
      try {
        console.log(data)
        await new Promise((r) => setTimeout(r, 600));
        setServerMsg(t('withdraw.requestSubmitted') || 'Заявка отправлена. Мы обработаем её в ближайшее время.');
        form.reset({ brand: 'VISA', holder: '', cardNumber: '', amount: undefined as unknown as number });
      } catch {
        setServerMsg(t('withdraw.requestFailed') || 'Не удалось отправить заявку. Попробуйте позже.');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4 rounded-2xl border p-4 sm:p-6">
        <div className="text-sm text-muted-foreground">{t('withdraw.card.help') || 'Вывод на банковскую карту Visa / Mastercard'}</div>

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('withdraw.card.brand') || 'Платёжная система'}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange} disabled={pending}>
                  <SelectTrigger><SelectValue placeholder="Visa / Mastercard" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VISA">VISA</SelectItem>
                    <SelectItem value="MASTERCARD">Mastercard</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormErrorMessage error={form.formState.errors.brand?.message} t={t} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="holder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('withdraw.card.holder') || 'Имя на карте'}</FormLabel>
              <FormControl>
                <Input placeholder="IVAN IVANOV" disabled={pending} {...field} />
              </FormControl>
              <FormErrorMessage error={form.formState.errors.holder?.message} t={t} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('withdraw.card.number') || 'Номер карты'}</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  disabled={pending}
                  value={field.value}
                  onChange={(e) => field.onChange(cardNumberOnlyDigits(e.target.value))}
                />
              </FormControl>
              <FormErrorMessage error={form.formState.errors.cardNumber?.message} t={t} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('withdraw.amount') || 'Сумма'} ({currency})
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  max={available}
                  disabled={pending}
                  placeholder={`0.00 ${currency}`}
                  value={Number.isFinite(field.value as number) ? String(field.value) : ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? (undefined) : Number(e.target.value))}
                />
              </FormControl>
              <div className="text-xs text-muted-foreground">
                {t('withdraw.availableShort') || 'Доступно'}: {available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
              </div>
              <FormErrorMessage error={form.formState.errors.amount?.message} t={t} />
            </FormItem>
          )}
        />

        {serverMsg && <div className="text-sm">{serverMsg}</div>}

        <Button type="submit" className="w-full" disabled={pending}>
          {t('withdraw.submitCard') || 'Вывести на карту'}
        </Button>
      </form>
    </Form>
  );
}
