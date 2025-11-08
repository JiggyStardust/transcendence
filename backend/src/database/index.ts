// single entry: exports ExtendedPrismaClient, db, types, functions

import { PrismaClient } from "@prisma/client";

/**
 * Extended Prisma client with helper methods for common user operations.
 *
 * It adds to normal Prisma client following methods:
 * - `createUser(username, passwordHash, displayName?)`
 * - `getUser(username)`
 * - `isUserExists(username)`
 *
 * Example:
 * ```ts
 * const db = new ExtendedPrismaClient();
 * const user = await db.getUser("alice");
 * ```
 */
class ExtendedPrismaClient extends PrismaClient {
  /** Create a new user */
  async createUser(
    username: string,
    passwordHash: string,
    displayName?: string,
  ) {
    const { createUser } = await import("./utils/createUser");
    return createUser(this, username, passwordHash, displayName);
  }

  /** Get a user by username */
  async getUser(username: string) {
    const { getUser } = await import("./utils/getUser");
    return getUser(this, username);
  }

  /** Check if a user exists */
  async isUserExists(username: string) {
    const { isUserExists } = await import("./utils/isUserExists");
    return isUserExists(this, username);
  }
}

export const db = new ExtendedPrismaClient();
