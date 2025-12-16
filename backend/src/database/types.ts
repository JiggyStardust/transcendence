// shared types
import { AvatarType } from ".prisma/client";

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
  isTwoFAenabled: boolean;
}

export interface IUserProfile {
  id: number;
  username: string;
  displayName: string;
  avatarURL: string;
  avatarType: AvatarType;
}

export interface IMatchData {
  id: number;
  createdAt: Date;
  winnerId: number;
  participants: { 
    userId: number; 
    score: number; 
    isWinner: boolean 
  }[];
}

// Uniform DB return type: { ok: boolean, data: T | string }
export type DbOk<T> = { ok: true; data: T };
export type DbErr = { ok: false; data: string };
export type DbResult<T> = DbOk<T> | DbErr;

export const ok = <T>(data: T): DbOk<T> => ({ ok: true, data });
export const err = (message: string): DbErr => ({ ok: false, data: message });
