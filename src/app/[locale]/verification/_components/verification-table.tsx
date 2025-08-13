'use client';

import { useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  ColumnFiltersState,
} from '@tanstack/react-table';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { setVerificationStatus } from '../_actions';

type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED';

type Doc = {
  filename: string;
  url: string;
  absolutePath: string;
  documentType: string;
  uploadedAt?: string;
};

export type AdminUserRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  verificationStatus: VerificationStatus;
  documents: Doc[];
  createdAt?: string;
  updatedAt?: string;
};

export default function VerificationTable({
  items,
  total,
}: {
  items: AdminUserRow[];
  total: number;
}) {
  const [data, setData] = useState(items);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const StatusBadge = ({ status }: { status: VerificationStatus }) => {
    const map: Record<VerificationStatus, { text: string; className: string }> = {
      UNVERIFIED: { text: 'Не верифицирован', className: 'bg-gray-100 text-gray-700' },
      PENDING: { text: 'На проверке', className: 'bg-amber-100 text-amber-800' },
      VERIFIED: { text: 'Верифицирован', className: 'bg-emerald-100 text-emerald-800' },
    };
    const s = map[status];
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs ${s.className}`}>
        {s.text}
      </span>
    );
  };

  function updateRowLocally(userId: string, next: VerificationStatus, clearDocs = false) {
    setData(prev =>
      prev.map(u =>
        u.id === userId ? { ...u, verificationStatus: next, documents: clearDocs ? [] : u.documents } : u
      )
    );
  }

  const columns = useMemo<ColumnDef<AdminUserRow>[]>(() => {
    return [
      {
        accessorKey: 'user',
        header: () => 'Пользователь',
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div>
              <div className="font-medium">
                {u.lastName} {u.firstName}
              </div>
              <div className="text-xs text-muted-foreground">ID: {u.id}</div>
            </div>
          );
        },
        accessorFn: (row) => `${row.firstName} ${row.lastName} ${row.email ?? ''}`,
        enableGlobalFilter: true,
      },
      {
        accessorKey: 'contacts',
        header: () => 'Контакты',
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div>
              <div>{u.email}</div>
              <div className="text-xs text-muted-foreground">{u.phone}</div>
            </div>
          );
        },
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'verificationStatus',
        header: () => 'Статус',
        cell: ({ row }) => <StatusBadge status={row.original.verificationStatus} />,
      },
      {
        id: 'documents',
        header: () => 'Документы',
        cell: ({ row }) => <DocsPreview docs={row.original.documents} />,
      },
      {
        id: 'actions',
        header: () => null,
        cell: ({ row }) => (
          <StatusChanger
            user={row.original}
            isPending={isPending}
            startTransition={startTransition}
            onOptimisticChange={(next, clearDocs) => updateRowLocally(row.original.id, next, clearDocs)}
            onRollback={(prev) => updateRowLocally(row.original.id, prev)}
          />
        ),
      },
    ];
  }, [isPending]);

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Поиск по имени, email, телефону…"
            className="md:max-w-sm"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.currentTarget.value)}
          />
          <div className="text-sm text-muted-foreground">Всего пользователей: {total}</div>
        </div>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="align-top">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StatusChanger({
  user,
  isPending,
  startTransition,
  onOptimisticChange,
  onRollback,
}: {
  user: AdminUserRow;
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
  onOptimisticChange: (next: VerificationStatus, clearDocs: boolean) => void;
  onRollback: (prev: VerificationStatus) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<VerificationStatus | null>(null);

  function apply(next: VerificationStatus, clearDocs: boolean) {
    startTransition(async () => {
      const prev = user.verificationStatus;
      onOptimisticChange(next, clearDocs);

      const res = await setVerificationStatus(user.id, next);
      if ('message' in res) {
        onRollback(prev);
        alert(res.message);
      }
    });
  }

  return (
    <>
      <Select
        defaultValue={user.verificationStatus}
        onValueChange={(val) => {
          const next = val as VerificationStatus;
          if (next === 'UNVERIFIED') {
            // показать подтверждение о удалении фото
            setPendingChoice(next);
            setConfirmOpen(true);
          } else {
            apply(next, false);
          }
        }}
        disabled={isPending}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Выбрать статус" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="UNVERIFIED">Не верифицирован</SelectItem>
          <SelectItem value="PENDING">На проверке</SelectItem>
          <SelectItem value="VERIFIED">Верифицирован</SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Снять верификацию?</AlertDialogTitle>
            <AlertDialogDescription>
              Если вы установите статус «Не верифицирован», все загруженные фото/документы пользователя
              будут удалены из системы. Продолжить?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingChoice) {
                  setConfirmOpen(false);
                  apply(pendingChoice, true);
                }
              }}
            >
              Подтвердить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
function humanizeType(s: string) {
  return s
    .split(/[_\-]+/) // разбиваем по _ или -
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1)) // каждое слово с заглавной буквы
    .join(' '); // соединяем пробелами
}

function DocsPreview({ docs }: { docs: Doc[] }) {
  if (!docs?.length) return <div className="text-xs text-muted-foreground">Документов нет</div>;

  const items = docs.slice(0, 3);

  return (
    <div className="flex items-center gap-2">
      {items.map((d) => {
        const lower = d.filename.toLowerCase();
        const isPdf = lower.endsWith('.pdf');
        const isHeic = /\.(heic|heif)$/i.test(lower);
        const isRasterImage = /\.(png|jpe?g|webp)$/i.test(lower);

        return (
          <div key={d.filename} className="border rounded p-1 w-[80px]">
            <div className="text-[10px] text-muted-foreground mb-1">
              {humanizeType(d.documentType)}
            </div>

            {isRasterImage ? (
              // обычные картинки — через next/image, НО без оптимизатора
              <a href={d.url} target="_blank" rel="noreferrer">
                <Image
                  src={d.url}
                  alt={d.filename}
                  width={64}
                  height={64}
                  sizes="64px"
                  unoptimized
                  className="object-cover rounded w-[64px] h-[64px]"
                />
              </a>
            ) : isHeic ? (
              // HEIC/HEIF — лучше как ссылка (не все браузеры умеют показывать)
              <a href={d.url} target="_blank" rel="noreferrer" className="block">
                <div className="w-[64px] h-[64px] grid place-items-center rounded bg-muted text-[10px]">
                  HEIC
                </div>
              </a>
            ) : isPdf ? (
              // PDF — ссылка-ярлык
              <a
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="block text-xs underline text-blue-700"
              >
                PDF
              </a>
            ) : (
              // прочие — просто файл
              <a href={d.url} target="_blank" rel="noreferrer" className="block text-xs underline">
                Файл
              </a>
            )}

            {d.uploadedAt && (
              <div className="text-[10px] text-muted-foreground mt-1">
                {format(new Date(d.uploadedAt), 'dd.MM.yyyy, HH:mm')}
              </div>
            )}
          </div>
        );
      })}
      {docs.length > items.length && (
        <span className="text-xs text-muted-foreground">+{docs.length - items.length}</span>
      )}
    </div>
  );
}
