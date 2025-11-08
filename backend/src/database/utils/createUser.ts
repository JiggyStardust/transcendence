import type { PrismaClient } from "@prisma/client";
import type { IPrismaReturn, INewUserData } from "../types";

export const createUser = async (
  prisma: PrismaClient,
  username: string,
  passwordHash: string,
  displayName?: string,
): Promise<IPrismaReturn<INewUserData>> => {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        displayName: displayName ?? username,
        passwordHash: passwordHash,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    return { data: user };
  } catch (error) {
    console.error(
      "db.createUser: Error creating user:",
      error ?? "Unknown error",
    );
    return { data: undefined };
  }
};
