'use client';

import { useMemo, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';

type CardFormProps = {
  safeRates: Record<string, number>;
};

type FormSchema = { amountRub: number };

export function CardForm({ safeRates }: CardFormProps) {
  const t = useI18n();
  const [isShowMessage, setIsShowMessage] = useState(false);

  const formSchema = useMemo(
    () =>
      z.object({
        amountRub: z.coerce.number().min(10000, t('depositPage.card.errors.min')),
      }),
    [t]
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { amountRub: 0 },
  });

  const rubRate = safeRates?.['RUB'] || 0;
  const amountRub = form.watch('amountRub');
  const usdAmount = useMemo(() => {
    if (!amountRub || !rubRate) return '0.00';
    return (+amountRub / rubRate).toFixed(2);
  }, [amountRub, rubRate]);

  const onSubmit = () => {
    setIsShowMessage(true);
  }
  return (
    <Card className="flex justify-center min-h-[200px]">
      <CardContent>
        {isShowMessage ? (
          <div>{t('depositPage.card.message')}</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
              <FormField
                control={form.control}
                name="amountRub"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('depositPage.card.amountRub.label')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        placeholder={t('depositPage.card.amountRub.placeholder')}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('depositPage.card.creditedPrefix')}{' '}
                      <span className="font-bold text-blue-700">{usdAmount} USD</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-blue-700 w-full">
                {t('depositPage.card.button')}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
