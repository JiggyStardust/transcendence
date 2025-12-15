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
    "avatarURL" TEXT NOT NULL DEFAULT '/uploads/avatars/default.png',
    "avatarType" TEXT NOT NULL DEFAULT 'DEFAULT',
    "status" TEXT NOT NULL DEFAULT 'OFFLINE',
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("avatarType", "avatarURL", "createdAt", "displayName", "id", "isDeleted", "isTwoFAenabled", "passwordHash", "status", "tokenExpiresAt", "tokenHash", "tokenRevoked", "twoFAsecret", "updatedAt", "username") SELECT "avatarType", "avatarURL", "createdAt", "displayName", "id", "isDeleted", "isTwoFAenabled", "passwordHash", "status", "tokenExpiresAt", "tokenHash", "tokenRevoked", "twoFAsecret", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE INDEX "User_username_idx" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
