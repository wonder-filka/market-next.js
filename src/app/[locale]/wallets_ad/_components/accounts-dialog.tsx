// app/(admin)/wallets/accounts-dialog.tsx
'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Wallet, User, Account } from '../../../../../prisma/generated/prisma';

type WalletWithUserAndAccounts = Wallet & {
  user: (User & { accounts: Account[] }) | null;
};

export function AccountsDialog({
  open,
  onOpenChange,
  wallet,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  wallet: WalletWithUserAndAccounts;
}) {
  const user = wallet.user;
  const rows = useMemo(() => user?.accounts ?? [], [user?.accounts]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent   className="">
        <DialogHeader>
          <DialogTitle>
            Аккаунты пользователя {user ? `${user.firstName} ${user.lastName}` : '—'}
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground mb-2">
          Баланс кошелька: <b>{wallet.balance.toFixed(2)} {wallet.currency}</b>
        </div>

        <div className="rounded border overflow-x-auto">
          <Table >
            <TableHeader>
              <TableRow>
                <TableHead>MT5 ID</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Валюта</TableHead>
                <TableHead>Баланс</TableHead>
                <TableHead>Free Margin</TableHead>
                <TableHead>Создан</TableHead>
               
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((acc) => (
                <TableRow key={acc.id}>
                  <TableCell>{acc.mt5Id}</TableCell>
                  <TableCell>{acc.type}</TableCell>
                  <TableCell>{acc.currency}</TableCell>
                  <TableCell>{acc.balance.toFixed(2)}</TableCell>
                  <TableCell>{acc.freeMargin.toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(acc.createdAt), 'dd.MM.yyyy, HH:mm')}</TableCell>
                </TableRow>
              ))}

              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-sm text-muted-foreground text-center py-6">
                    У пользователя нет аккаунтов
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
