import type { PrismaClient } from "@prisma/client";
import type { IUserData, DbResult} from "../types";
import {err, ok} from "../types";

/**
 * Retrieve a user by username.
 *
 * @param prisma - Prisma client instance
 * @param username - Target username
 * @returns DbResult with user data or error "NOT_FOUND"
 */
export const getUser = async (
  prisma: PrismaClient,
  username: string,
): Promise<DbResult<IUserData>> => {
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

    return ok(user as IUserData);
  } catch (error) {
    console.error("db.getUser: Error creating user:", error ?? "Unknown error");
    return err("NOT_FOUND");
  }
};
