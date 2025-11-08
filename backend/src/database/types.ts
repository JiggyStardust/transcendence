// shared types

export interface IPrismaReturn<T = unknown> {
  data: T | undefined;
}

// DTOs (Data Transfer Objects)
export interface INewUserData {
  id: number;
  username: string;
  createdAt: Date;
}

export interface IUserData {
  id: number;
  username: string;
  passwordHash: string;
  isTwoFactorEnabled: boolean;
}
