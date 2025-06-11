"use server";
import { PrismaClient, User } from "@prisma/client";
import { redirect } from 'next/navigation'

const prisma = new PrismaClient();

export const getUser = async (
    email: string
  ): Promise<User | null> => {
    try {
      const user = await prisma.user.findFirst({
        where: {
            email: email
        },
      });
      return user;
    } catch (error) {
      throw new Error("Error get user");
    }
  };
