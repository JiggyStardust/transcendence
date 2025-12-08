// single entry: exports ExtendedPrismaClient, db, types, functions

import { PrismaClient } from "@prisma/client";

/**
 * Extended Prisma client with helper methods for common user operations.
 *
 * Example:
 * ```ts
 * const db = new ExtendedPrismaClient();
 * const user = await db.getUser("alice");
 * ```
 */
class ExtendedPrismaClient extends PrismaClient {
  async createUser(username: string, passwordHash: string, displayName?: string) {
    const { createUser } = await import("./utils/createUser");
    return createUser(this, username, passwordHash, displayName);
  }

  async getUser(username: string) {
    const { getUser } = await import("./utils/getUser");
    return getUser(this, username);
  }

  async getUserProfile(username: string) {
    const { getUserProfile } = await import("./utils/getUserProfile");
    return getUserProfile(this, username);
  }
}

export const db = new ExtendedPrismaClient();
