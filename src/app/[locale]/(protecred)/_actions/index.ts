import { prisma } from "@/lib/db";

// Получить все UserAsset для пользователя по userId
export async function getUsersAssets() {
  try {
    const assets = await prisma.userAsset.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        deletedAt: null, // deletedAt РАВНО null — только не удалённые
      },
    });
    return assets;
  } catch (error) {
    console.error("Ошибка получения активов пользователя:", error);
    return []
  }
}

export async function getUserAssets(userId: string) {
  try {
    const assets = await prisma.userAsset.findMany({
      where: { userId, deletedAt: null }, // deletedAt РАВНО null — только не удалённые
      orderBy: { createdAt: "desc" }, // Самые новые первыми
    });
    return assets;
  } catch (error) {
    console.error("Ошибка получения активов пользователя:", error);
    throw new Error("Ошибка получения активов пользователя");
  }
}