'use server';

import { prisma } from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';

type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED';

type AdminUserWithDocs = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  verificationStatus: VerificationStatus;
  documents: Array<{
    filename: string;
    url: string;          // /verification/<filename>
    absolutePath: string; // абсолютный путь на диске
    documentType: string; // то, что после userId_ и до расширения
    uploadedAt?: string;  // ISO-время (mtime), если получилось прочитать
  }>;
};

type ListUsersParams = {
  status?: VerificationStatus; // фильтр по статусу
  search?: string;             // поиск по email/phone/имени/фамилии
  limit?: number;              // пагинация
  offset?: number;             // пагинация
  orderBy?: 'createdAt' | 'updatedAt'; // сортировка
  order?: 'asc' | 'desc';
};

type ListUsersResult =
  | { items: AdminUserWithDocs[]; total: number }
  | { message: string };

export async function getUsersForVerificationAdminAll(params: ListUsersParams = {}): Promise<ListUsersResult> {
  try {
    const {
      status,
      search,
      limit = 50,
      offset = 0,
      orderBy = 'createdAt',
      order = 'desc',
    } = params;

    // 1) where-условия
    const where: any = {};
    if (status) {
      where.verificationStatus = status;
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
      ];
    }

    // 2) параллельно считаем total и выбираем страницу пользователей
    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          verificationStatus: true,
        },
        orderBy: { [orderBy]: order },
        take: limit,
        skip: offset,
      }),
    ]);

    // 3) читаем директорию verification один раз, группируем файлы по userId
    const dirPath = path.join(process.cwd(), 'public', 'verification');

    let allFilenames: string[] = [];
    try {
      // могут быть тысячи файлов; если ожидается много — можно потом оптимизировать
      allFilenames = await fs.readdir(dirPath);
    } catch (err: any) {
      if (err?.code !== 'ENOENT') {
        console.error('[getUsersForVerificationAdminAll] readdir error:', err);
      }
      allFilenames = [];
    }

    // Группировка: userId = подстрока до первого "_"
    const filesByUserId = new Map<string, string[]>();
    for (const name of allFilenames) {
      const underscoreIdx = name.indexOf('_');
      if (underscoreIdx <= 0) continue; // не наш формат
      const uid = name.slice(0, underscoreIdx);
      if (!filesByUserId.has(uid)) filesByUserId.set(uid, []);
      filesByUserId.get(uid)!.push(name);
    }

    // 4) соберём documents для каждого пользователя из страницы
    const items: AdminUserWithDocs[] = [];
    for (const u of users) {
      const filenames = filesByUserId.get(u.id) ?? [];

      const documents = await Promise.all(
        filenames.map(async (filename) => {
          const absolutePath = path.join(dirPath, filename);

          // documentType = всё после userId_ до расширения
          const withoutUserId = filename.replace(`${u.id}_`, '');
          const documentType = withoutUserId.replace(/\.[^/.]+$/, '');

          try {
            const st = await fs.stat(absolutePath);
            return {
              filename,
              url: `/verification/${filename}`,
              absolutePath,
              documentType,
              uploadedAt: st.mtime?.toISOString(),
            };
          } catch {
            return {
              filename,
              url: `/verification/${filename}`,
              absolutePath,
              documentType,
            };
          }
        })
      );

      // сортируем документы по дате (новые сверху)
      documents.sort((a, b) => {
        const tA = a.uploadedAt ? Date.parse(a.uploadedAt) : 0;
        const tB = b.uploadedAt ? Date.parse(b.uploadedAt) : 0;
        return tB - tA;
      });

      items.push({
        ...u,
        documents,
      });
    }

    return { items, total };
  } catch (error) {
    console.error('[getUsersForVerificationAdminAll] fatal error:', error);
    return { message: 'usersFetchFailed' };
  }
}


export async function setVerificationStatus(userId: string, status: VerificationStatus) {
  try {
    if (!userId) return { message: 'userIdRequired' };
    if (!['UNVERIFIED', 'PENDING', 'VERIFIED'].includes(status)) {
      return { message: 'invalidStatus' };
    }

    // если снимаем верификацию — удаляем все загруженные документы
    if (status === 'UNVERIFIED') {
      const dirPath = path.join(process.cwd(), 'public', 'verification');
      try {
        const all = await fs.readdir(dirPath);
        const mine = all.filter((name) => name.startsWith(`${userId}_`));
        await Promise.all(
          mine.map(async (name) => {
            const p = path.join(dirPath, name);
            try {
              await fs.unlink(p);
            } catch (e) {
              // проглатываем, чтобы не валить всю операцию, но логируем
              console.error('[setVerificationStatus] unlink error:', p, e);
            }
          })
        );
      } catch (err: any) {
        if (err?.code !== 'ENOENT') {
          console.error('[setVerificationStatus] readdir error:', err);
        }
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { verificationStatus: status },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        verificationStatus: true,
      },
    });

    return updated;
  } catch (error) {
    console.error('[setVerificationStatus] error:', error);
    return { message: 'setStatusFailed' };
  }
}