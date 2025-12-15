import type { PrismaClient } from "@prisma/client";
import type { IMatchData, DbResult} from "../types"; // not sure about this either?
import {err, ok} from "../types";

/**
 * Create a new user.
 *
 * @param prisma - Prisma client instance

 * @param userIds 
 * @returns DbResult with new entry in the match table or error "SOME_ERROR"
 */

// I'm not sure exactly how we are going to collect the data
// Frontend collects
/*const gameState = {
  startedAt,
  endedAt,
  winnerUserId,
  participants: [
    { userId: 7, score: 11, startedAt, endedAt },
    { userId: 12, score: 8, startedAt, endedAt }
  ]
};

// Backend receives
await prisma.match.create({
  data: {
    startedAt: gameState.startedAt,
    endedAt: gameState.endedAt,
    winnerId: gameState.winnerUserId,
    participants: {
      create: gameState.participants
    }
  }
});*/

export const createMatch = async (
  prisma: PrismaClient,
  userIds: number[], // participants
): Promise<DbResult<IMatchData>> => { 
  try {
    if (userIds.length < 2) {
        return err("NOT_ENOUGH_PARTICIPANTS")
    }

    const match = await prisma.match.create({
      data: {
        startedAt: new Date(),
        participants: {
            create: userIds.map((id) => ({ userId: id }))
        }
      },
      include: {
        participants: true
      }
    });

    return ok(match as IMatchData);
  } catch (e) {
    console.error("db.createMatch: Error creating match:", e ?? "Unknown error",
    );
    return err("ERROR_CREATING_MATCH");
  }
};
