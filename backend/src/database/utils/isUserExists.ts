import type { PrismaClient } from "@prisma/client";
import type { IPrismaReturn } from "../types";

export const isUserExists = async (
  prisma: PrismaClient,
  username: string,
): Promise<IPrismaReturn<boolean>> => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { username: true },
  });

  return { data: user !== null };
};
