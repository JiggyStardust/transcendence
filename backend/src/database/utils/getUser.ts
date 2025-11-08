import type { PrismaClient } from "@prisma/client";
import type { IPrismaReturn, IUserData } from "../types";

export const getUser = async (
  prisma: PrismaClient,
  username: string,
): Promise<IPrismaReturn<IUserData>> => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { username },
      select: {
        id: true,
        username: true,
        passwordHash: true,
        isTwoFactorEnabled: true,
      },
    });

    return { data: user };
  } catch (error) {
    console.error("db.getUser: Error creating user:", error ?? "Unknown error");
    return { data: undefined };
  }
};
