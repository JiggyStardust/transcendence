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

    const winnerId = winner[1] ? userIds[1] : userIds[0];
    if (!winnerId) {
      return err("INVALID_WINNER");
    }
    
    const match = await prisma.match.create({
      data: {
        winnerId,
        participants: {
            create: userIds.map((userId, i) => ({ 
              userId,
              score: scores[i],
              isWinner: winner[i],
            })),
          }
        },
        include: {
          participants: true
        }
      });

      const result: IMatchData = {
        id: match.id,
        createdAt: match.createdAt,
        winnerId: match.winnerId!,
        participants: match.participants.map(
          (p: (typeof match.participants)[number]) => ({
          userId: p.userId,
          score: p.score,
          isWinner: p.isWinner,
        })),
      };
      
      return ok(result);
    } catch (e) {
      console.error("db.createMatch: Error creating match:", e ?? "Unknown error",);
      return err("ERROR_CREATING_MATCH");
    }
};
