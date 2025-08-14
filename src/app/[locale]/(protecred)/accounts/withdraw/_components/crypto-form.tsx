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
import { useEffect, useMemo, useState, useTransition } from 'react';

type Props = {
  available: number;
  fiatCurrency: string; // для отображения доступного остатка в вашей валюте кошелька
};

type Coin = 'BTC' | 'ETH' | 'USDT';
type Net = 'BITCOIN' | 'ETHEREUM' | 'TRON';

const NETWORKS_BY_COIN: Record<Coin, Net[]> = {
  BTC: ['BITCOIN'],
  ETH: ['ETHEREUM'],
  USDT: ['ETHEREUM', 'TRON'], // ERC-20, TRC-20
};

const validateAddress = (net: Net, addr: string) => {
  if (!addr) return false;
  if (net === 'ETHEREUM') return /^0x[a-fA-F0-9]{40}$/.test(addr);
  if (net === 'TRON') return /^T[1-9A-HJ-NP-Za-km-z]{33,34}$/.test(addr); // упрощённо
  if (net === 'BITCOIN') return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(addr); // упрощённо
  return false;
};

export function CryptoForm({ available, fiatCurrency }: Props) {
  const t = useI18n();
  const [pending, startTransition] = useTransition();
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const Schema = z
    .object({
      coin: z.enum(['BTC', 'ETH', 'USDT'], { required_error: 'required' }),
      network: z.enum(['BITCOIN', 'ETHEREUM', 'TRON'], { required_error: 'required' }),
      address: z.string().min(10, 'invalidAddress'),
      amount: z
        .number({ invalid_type_error: 'invalidNumber' })
        .positive('positive')
        .refine((v) => v <= available, 'amountTooHigh'),
      // опционально: memo/tag для некоторых сетей
      memo: z.string().optional(),
    })
    .refine((data) => NETWORKS_BY_COIN[data.coin].includes(data.network), {
      message: 'networkCoinMismatch',
      path: ['network'],
    })
    .refine((data) => validateAddress(data.network, data.address), {
      message: 'invalidAddress',
      path: ['address'],
    });

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      coin: 'USDT' as Coin,
      network: 'TRON' as Net,
      address: '',
      amount: undefined as unknown as number,
      memo: '',
    },
  });

  // Подменяем доступные сети под выбранную монету
  const coin = form.watch('coin');
  const networkOptions = useMemo(() => NETWORKS_BY_COIN[coin], [coin]);

  useEffect(() => {
    const currentNet = form.getValues('network');
    if (!networkOptions.includes(currentNet)) {
      form.setValue('network', networkOptions[0], { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin]);

  const onSubmit = (data: z.infer<typeof Schema>) => {
    setServerMsg(null);
    startTransition(async () => {
      try {
        console.log(data)
        await new Promise((r) => setTimeout(r, 600));
        setServerMsg(t('withdraw.requestSubmitted') || 'Заявка отправлена. Мы обработаем её в ближайшее время.');
        form.reset({
          coin: 'USDT',
          network: 'TRON',
          address: '',
          amount: undefined as unknown as number,
          memo: '',
        });
      } catch {
        setServerMsg(t('withdraw.requestFailed') || 'Не удалось отправить заявку. Попробуйте позже.');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4 rounded-2xl border p-4 sm:p-6">
        <div className="text-sm text-muted-foreground">
          {t('withdraw.crypto.help') || 'Вывод в криптовалюте: BTC / ETH / USDT (ERC-20, TRC-20)'}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="coin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('withdraw.crypto.coin') || 'Монета'}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange} disabled={pending}>
                    <SelectTrigger><SelectValue placeholder="Выберите монету" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">BTC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormErrorMessage error={form.formState.errors.coin?.message} t={t} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="network"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('withdraw.crypto.network') || 'Сеть'}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange} disabled={pending}>
                    <SelectTrigger><SelectValue placeholder="Выберите сеть" /></SelectTrigger>
                    <SelectContent>
                      {networkOptions.includes('BITCOIN') && <SelectItem value="BITCOIN">Bitcoin</SelectItem>}
                      {networkOptions.includes('ETHEREUM') && <SelectItem value="ETHEREUM">Ethereum (ERC-20)</SelectItem>}
                      {networkOptions.includes('TRON') && <SelectItem value="TRON">Tron (TRC-20)</SelectItem>}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormErrorMessage error={form.formState.errors.network?.message} t={t} />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('withdraw.crypto.address') || 'Адрес кошелька'}</FormLabel>
              <FormControl>
                <Input placeholder="Получающий адрес" disabled={pending} {...field} />
              </FormControl>
              <FormErrorMessage error={form.formState.errors.address?.message} t={t} />
            </FormItem>
          )}
        />

        {/* Опционально: memo/tag для некоторых сетей */}
        {/* <FormField
          control={form.control}
          name="memo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Memo / Tag (если требуется)</FormLabel>
              <FormControl>
                <Input placeholder="Memo / Tag" disabled={pending} {...field} />
              </FormControl>
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('withdraw.amountCrypto') || 'Сумма к выводу'}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.00000001"
                  min={0}
                  max={available}
                  disabled={pending}
                  placeholder="0.00000000"
                  value={Number.isFinite(field.value as number) ? String(field.value) : ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? (undefined) : Number(e.target.value))}
                />
              </FormControl>
              <div className="text-xs text-muted-foreground">
                {t('withdraw.availableShort') || 'Доступно'}: {available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fiatCurrency}
              </div>
              <FormErrorMessage error={form.formState.errors.amount?.message} t={t} />
            </FormItem>
          )}
        />

        {serverMsg && <div className="text-sm">{serverMsg}</div>}

        <Button type="submit" className="w-full" disabled={pending}>
          {t('withdraw.submitCrypto') || 'Вывести на криптокошелёк'}
        </Button>
      </form>
    </Form>
  );
}
