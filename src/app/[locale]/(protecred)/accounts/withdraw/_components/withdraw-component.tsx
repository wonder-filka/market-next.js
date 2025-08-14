'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCard, Bitcoin } from 'lucide-react';
import { useI18n } from '@/locales/client';
import { Wallet } from '../../../../../../../prisma/generated/prisma';
import { CardForm } from './card-form';
import { CryptoForm } from './crypto-form';

type WithdrawPageProps = {
  wallet: Wallet;
};

export default function WithdrawComponent({ wallet }: WithdrawPageProps) {
  const t = useI18n();
  const available = Math.max(0, (wallet.balance ?? 0) - (wallet.withdrawn ?? 0));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl border p-4 sm:p-6">
        <div className="text-sm text-muted-foreground">{t('withdraw.availableLabel') || 'Доступно к выводу'}</div>
        <div className="mt-1 text-2xl font-semibold">
          {available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {wallet.currency}
        </div>
      </div>

      <Tabs defaultValue="card" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="card" className="gap-2 min-h-14 rounded-2xl">
            <CreditCard className="h-4 w-4" />
            {t('withdraw.toCardTab') || 'На карту (Visa/Mastercard)'}
          </TabsTrigger>
          <TabsTrigger value="crypto" className="gap-2 min-h-14 rounded-2xl">
            <Bitcoin className="h-4 w-4" />
            {t('withdraw.toCryptoTab') || 'На криптокошелёк'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="card" className="mt-6">
          <CardForm available={available} currency={wallet.currency} />
        </TabsContent>

        <TabsContent value="crypto" className="mt-6">
          <CryptoForm available={available} fiatCurrency={wallet.currency} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
