'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState, useTransition } from 'react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import QRCode from 'qrcode';
import { Copy, CopyCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';
import Image from 'next/image';

type CryptoFormProps = { userId: string };
type Currency = 'USDT' | 'ETH' | 'BTC';

export function CryptoForm({ userId }: CryptoFormProps) {
  const t = useI18n();

  const [currency, setCurrency] = useState<Currency>();
  const [address, setAddress] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  async function fetchAddress(nextCurrency: Currency) {
    setError(null);
    setAddress(null);
    setQr(null);
    try {
      const r = await fetch('/api/wallets/evm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currency: nextCurrency }),
      });
      const data = await r.json();
      if (!r.ok || 'message' in data) {
        setError(t('wallet.errorGeneric'));
        return;
      }
      setAddress(String(data.address));
    } catch {
      setError(t('wallet.errorNetwork'));
    }
  }

  // QR: кодируем ТОЛЬКО адрес
  useEffect(() => {
    if (!address) return;
    QRCode.toDataURL(address)
      .then(setQr)
      .catch(() => setQr(null));
  }, [address]);

  const badge =
    currency === 'USDT' ? t('wallet.badge.usdt')
    : currency === 'ETH' ? t('wallet.badge.eth')
    : currency === 'BTC' ? t('wallet.badge.btc')
    : '';

  const helpTitle =
    currency === 'USDT' ? t('wallet.help.usdt.title')
    : currency === 'ETH' ? t('wallet.help.eth.title')
    : currency === 'BTC' ? t('wallet.help.btc.title')
    : '';

  // Буллеты как отдельные ключи без переменных
  const helpBullets = (() => {
    if (currency === 'USDT') {
      return [
        t('wallet.help.usdt.bullets.0'),
        t('wallet.help.usdt.bullets.1'),
        t('wallet.help.usdt.bullets.2'),
      ];
    }
    if (currency === 'ETH') {
      return [
        t('wallet.help.eth.bullets.0'),
        t('wallet.help.eth.bullets.1'),
        t('wallet.help.eth.bullets.2'),
      ];
    }
    if (currency === 'BTC') {
      return [
        t('wallet.help.btc.bullets.0'),
        t('wallet.help.btc.bullets.1'),
        t('wallet.help.btc.bullets.2'),
      ];
    }
    return [];
  })();

  async function copyAddress() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card>
      <CardContent className="py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{t('wallet.networkLabel')}</div>
          {!!badge && <span className="text-xs rounded-full border px-2 py-0.5">{badge}</span>}
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={currency}
            onValueChange={(v) => {
              const next = v as Currency;
              setCurrency(next);
              startTransition(() => fetchAddress(next));
            }}
          >
            <SelectTrigger className="w-full" disabled={isPending}>
              <SelectValue placeholder={t('wallet.selectPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USDT">{t('wallet.options.USDT')}</SelectItem>
              <SelectItem value="ETH">{t('wallet.options.ETH')}</SelectItem>
              <SelectItem value="BTC">{t('wallet.options.BTC')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        {address && (
          <div className="grid sm:grid-cols-1 gap-4 items-start">
            <div>
              <div className="text-sm text-muted-foreground">{t('wallet.addressLabel')}</div>

              <div className="flex items-center gap-2">
                <div className="font-mono break-all text-sm">{address}</div>
                <Button onClick={copyAddress} variant="ghost" aria-label="Copy address">
                  {copied ? <CopyCheck /> : <Copy />}
                </Button>
              </div>

              <div className="flex flex-col mt-4 w-full justify-center items-center">
                {qr ? (
                  <Image src={qr} width={140} height={140} alt="QR" className="border rounded" />
                ) : (
                  <div className="text-xs text-muted-foreground">{t('wallet.qrGenerating')}</div>
                )}
                {/* подписи без переменных + адрес рядом */}
                <div className="text-[10px] text-center text-muted-foreground mt-1">
                  {t('wallet.qrText')} {address}
                </div>
                <div className="text-[10px] text-center text-muted-foreground">
                  {t('wallet.qrUri')}{address}
                </div>
              </div>

              {!!helpTitle && (
                <div className="mt-3 space-y-1">
                  <div className="font-medium">{helpTitle}</div>
                  <ul className="list-disc pl-5 text-sm">
                    {helpBullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
