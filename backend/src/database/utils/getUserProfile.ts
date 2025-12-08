import type { PrismaClient } from "@prisma/client";
import type { IUserProfile, DbResult } from "../types";
import { err, ok } from "../types";

/**
 * Retrieve a user by username.
 *
 * @param prisma - Prisma client instance
 * @param username - Target username
 * @returns DbResult with user data or error "NOT_FOUND"
 */
export const getUserProfile = async (prisma: PrismaClient, username: string): Promise<DbResult<IUserProfile>> => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarURL: true,
        avatarType: true,
      },
    });

    return ok(user as IUserProfile);
  } catch (error) {
    console.error("db.getUserProfile: Error getting user:", error ?? "Unknown error");
    return err("NOT_FOUND");
  }
};
