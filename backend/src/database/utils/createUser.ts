import type { PrismaClient } from "@prisma/client";
import type { INewUserData, DbResult} from "../types";
import {err, ok} from "../types";

/**
 * Create a new user.
 *
 * @param prisma - Prisma client instance
 * @param username - Unique username
 * @param passwordHash - Hashed password
 * @param displayName - Optional display name (defaults to username)
 * @returns DbResult with created user data or error "USERNAME_TAKEN"
 */
export const createUser = async (
  prisma: PrismaClient,
  username: string,
  passwordHash: string,
  displayName?: string,
): Promise<DbResult<INewUserData>> => {
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

    return ok(user as INewUserData);
  } catch (e) {
    console.error(
      "db.createUser: Error creating user:",
      e ?? "Unknown error",
    );
    return err("USERNAME_TAKEN");
  }
};
