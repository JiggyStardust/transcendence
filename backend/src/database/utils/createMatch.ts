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



export const createMatch = async (
  prisma: PrismaClient,
  userIds: number[], // participants
  scores: number[],
  winner: boolean[],
): Promise<DbResult<IMatchData>> => { 
  try {
    if (userIds.length < 2) {
        return err("NOT_ENOUGH_PARTICIPANTS")
    }
    if (userIds.length !== scores.length || userIds.length !== winner.length) {
        return err("INVALID_MATCH_PAYLOAD");
    }

    const now = new Date();
    const winnerId = userIds[winnerIndexes[0]];
    const match = await prisma.match.create({
      data: {
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
