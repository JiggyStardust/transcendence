import { PrismaClient } from "@prisma/client";

export interface IPrismaReturn<T = unknown> {
  data: T | undefined;
}

export interface INewUserData {
  id: number;
  username: string;
  createdAt: Date;
}

const createUser = async (
  prisma: PrismaClient,
  username: string,
  hashedPassword: string,
  displayName?: string,
): Promise<IPrismaReturn<INewUserData>> => {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        displayName: displayName ?? username,
        passwordHash: hashedPassword,
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

export interface IUserData {
  id: number;
  username: string;
  passwordHash: string;
  isTwoFactorEnabled: boolean;
}

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

class ExtendedPrismaClient extends PrismaClient {
  /**
   * Creates a new user in the database.
   * @param username - The user's unique username.
   * @param hashedPassword - The securely hashed password.
   * @param displayName - Optional display name (defaults to username).
   * @returns IPrismaReturn containing either the created user or undefined.
   */
  async createUser(
    username: string,
    hashedPassword: string,
    displayName?: string,
  ) {
    return createUser(this, username, hashedPassword, displayName);
  }

  /**
   * Get an user data.
   * @param username - The user's unique username.
   * @returns IPrismaReturn containing either the created user or undefined.
   */
  async getUser(username: string) {
    return getUser(this, username);
  }

  /**
   * Check if user exists in database.
   * @param username - The user's unique username.
   * @returns IPrismaReturn containing boolean.
   */
  async isUserExists(username: string) {
    return isUserExists(this, username);
  }
}

export const db = new ExtendedPrismaClient();
