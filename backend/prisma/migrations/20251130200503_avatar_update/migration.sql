/*
  Warnings:

  - You are about to drop the `Avatar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `avatarID` on the `User` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Avatar";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isTwoFAenabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFAsecret" TEXT,
    "tokenHash" TEXT,
    "tokenExpiresAt" DATETIME,
    "tokenRevoked" BOOLEAN NOT NULL DEFAULT false,
    "avatarURL" TEXT NOT NULL DEFAULT '/uploads/avatars/default.jpeg',
    "avatarType" TEXT NOT NULL DEFAULT 'DEFAULT',
    "status" TEXT NOT NULL DEFAULT 'OFFLINE',
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("createdAt", "displayName", "id", "isDeleted", "isTwoFAenabled", "passwordHash", "status", "tokenExpiresAt", "tokenHash", "tokenRevoked", "twoFAsecret", "updatedAt", "username") SELECT "createdAt", "displayName", "id", "isDeleted", "isTwoFAenabled", "passwordHash", "status", "tokenExpiresAt", "tokenHash", "tokenRevoked", "twoFAsecret", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE INDEX "User_username_idx" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
