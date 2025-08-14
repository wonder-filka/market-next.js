'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState, useTransition } from 'react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import QRCode from 'qrcode';
import { Copy, CopyCheck, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';
import Image from 'next/image';

type CryptoFormProps = { userId: string };
type Network = 'EVM' | 'TRON';
type Currency = 'USDT' | 'USDT_TRON' | 'ETH' | 'BTC' | 'TRX';
type ApiCurrency = 'USDT' | 'ETH' | 'BTC' | 'TRX';
type CurrencyUI = '' | Currency;
export function CryptoForm({ userId }: CryptoFormProps) {
  const t = useI18n();
  const [network, setNetwork] = useState<Network>('TRON');
  const [currency, setCurrency] = useState<CurrencyUI>('');
  const [address, setAddress] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  async function fetchAddress(nextNetwork: Network, nextCurrency: Currency) {
    setError(null);
    setAddress(null);
    setQr(null);

    const apiCurrency: ApiCurrency =
      nextNetwork === 'TRON' && nextCurrency === 'USDT_TRON'
        ? 'USDT'
        : (nextCurrency as ApiCurrency);


    // простая валидация соответствия сети и валюты
    if (nextNetwork === 'TRON' && !['USDT_TRON', 'TRX'].includes(nextCurrency)) {
      setError(t('wallet.errorIncompatible')); // добавь ключ перевода вроде "Выбранная сеть не поддерживает эту валюту"
      return;
    }
    if (nextNetwork === 'EVM' && nextCurrency === 'TRX') {
      setError(t('wallet.errorIncompatible'));
      return;
    }

    try {
      const path = nextNetwork === 'TRON' ? '/api/wallets/tron' : '/api/wallets/evm';
      const r = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currency: apiCurrency }),
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

  useEffect(() => {
    if (!address) return;
    // Для QR просто кодируем сам адрес.
    // (При желании можно сделать tron:<addr> для Tron и ethereum:<addr> для EVM)
    QRCode.toDataURL(address)
      .then(setQr)
      .catch(() => setQr(null));
  }, [address]);


  const helpTitle =
    currency === 'USDT' ? t('wallet.help.usdt.title')
      : currency === 'USDT_TRON' ? t('wallet.help.usdt_tron.title')
        : currency === 'ETH' ? t('wallet.help.eth.title')
          : currency === 'BTC' ? t('wallet.help.btc.title')
            : currency === 'TRX' ? t('wallet.help.trx.title') // добавь этот ключ
              : '';

  const helpBullets = (() => {
    if (currency === 'USDT') return [t('wallet.help.usdt.bullets.0'), t('wallet.help.usdt.bullets.1'), t('wallet.help.usdt.bullets.2')];
    if (currency === 'USDT_TRON') return [t('wallet.help.usdt_tron.bullets.0'), t('wallet.help.usdt_tron.bullets.1'), t('wallet.help.usdt_tron.bullets.2')];
    if (currency === 'ETH') return [t('wallet.help.eth.bullets.0'), t('wallet.help.eth.bullets.1'), t('wallet.help.eth.bullets.2')];
    if (currency === 'BTC') return [t('wallet.help.btc.bullets.0'), t('wallet.help.btc.bullets.1'), t('wallet.help.btc.bullets.2')];
    if (currency === 'TRX') return [t('wallet.help.trx.bullets.0'), t('wallet.help.trx.bullets.1'), t('wallet.help.trx.bullets.2')];
    return [];
  })();

  async function onSelect(nextCurrency: Currency) {
    setCurrency(nextCurrency);
    startTransition(() => fetchAddress(network, nextCurrency));
  }

  async function copyAddress() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  if (isPending) return <div className='w-full min-h-[200px] flex justify-center items-center space-x-2'>
    <LoaderCircle size={25} className='text-gray-500 animate-spin' />
  </div>

  return (
    <Card>
      <CardContent className=" space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t('wallet.networkLabel')}
          </div>
          {/* {!!badge && <span className="text-xs rounded-full border px-2 py-0.5">{badge}</span>} */}
        </div>

        {/* Выбор сети */}
        <div className="flex items-center gap-3">
          <Select
            value={network}
            onValueChange={(v) => {
              const n = v as Network;
              setNetwork(n);
              setCurrency('');
              setAddress(null);
              setQr(null);
              setError(null);
            }}
          >
            <SelectTrigger className="w-full" disabled={isPending}>
              <SelectValue placeholder={t('wallet.selectNetwork')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRON">TRON (TRC-20)</SelectItem>
              <SelectItem value="EVM">Ethereum (ERC-20)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Выбор валюты */}
        <div className="flex items-center gap-3">
          <Select
            value={currency}
            onValueChange={(v) => onSelect(v as Currency)}
          >
            <SelectTrigger className="w-full" disabled={isPending}>
              <SelectValue placeholder={t('wallet.selectPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {/* Для EVM доступны USDT/ETH/BTC; для TRON — USDT/TRX */}
              {network === 'TRON' ? (
                <>
                  <SelectItem value="USDT_TRON">{t('wallet.options.USDT')}</SelectItem>
                  <SelectItem value="TRX">TRX</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="USDT">{t('wallet.options.USDT')}</SelectItem>
                  <SelectItem value="ETH">{t('wallet.options.ETH')}</SelectItem>
                  <SelectItem value="BTC">{t('wallet.options.BTC')}</SelectItem>
                </>
              )}
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
                <div className="text-[10px] text-center text-muted-foreground mt-1">
                  {t('wallet.qrText')} {address}
                </div>
                {/* <div className="text-[10px] text-center text-muted-foreground">
                  {t('wallet.qrUri')}{address}
                </div> */}
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
