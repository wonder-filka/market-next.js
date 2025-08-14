'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCard, Bitcoin } from 'lucide-react';
import { CardForm } from './card-form';
import { CryptoForm } from './crypto-form';
import { useI18n } from '@/locales/client';

type DepositPageProps = {
  safeRates: Record<string, number>;
  userId: string;
  btcAddress?: string | null;
  usdtAddress?: string | null;
};

export default function DepositComponent({ safeRates, userId }: DepositPageProps) {
  const t = useI18n();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs defaultValue="card" className="flex flex-col md:flex-row">
        <TabsList className="flex flex-col h-full w-full">
          <TabsTrigger value="card" className="w-full text-wrap min-h-14 rounded-2xl">
            <CreditCard className="h-5 w-5" />
            <span className="ml-2">{t('depositPage.tabs.card')}</span>
          </TabsTrigger>
          <TabsTrigger value="crypto" className="w-full text-wrap min-h-14 rounded-2xl">
            <Bitcoin className="h-5 w-5" />
            <span className="ml-2">{t('depositPage.tabs.crypto')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="card" className="md:min-w-md">
          <CardForm safeRates={safeRates} />
        </TabsContent>

        <TabsContent value="crypto" className="md:min-w-md">
          <CryptoForm userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
