-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "winnerId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("createdAt", "id", "winnerId") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "id", "winnerId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE INDEX "Match_winnerId_idx" ON "Match"("winnerId");
CREATE TABLE "new_MatchParticipant" (
    "matchId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("matchId", "userId"),
    CONSTRAINT "MatchParticipant_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MatchParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MatchParticipant" ("createdAt", "isWinner", "matchId", "score", "userId") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "isWinner", "matchId", "score", "userId" FROM "MatchParticipant";
DROP TABLE "MatchParticipant";
ALTER TABLE "new_MatchParticipant" RENAME TO "MatchParticipant";
CREATE INDEX "MatchParticipant_userId_idx" ON "MatchParticipant"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
