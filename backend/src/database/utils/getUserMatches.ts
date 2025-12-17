import { PrismaClient } from "@prisma/client";
import type {  IMatchHistoryData, DbResult } from "../types";
import {err, ok} from "../types";

export const getUserMatches = async (
    prisma: PrismaClient,
    userId: number
): Promise<DbResult<IMatchHistoryData[]>> => {
    try {
        const matches = await prisma.matchParticipant.findMany({
            where: { userId: userId },
            include: {
                match: {
                    include: {
                        participants: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc'
            },
        });

        const result: IMatchHistoryData[] = matches.map(mp => {
            // find opponent
            const opponent = mp.match.participants.find(p => p.userId !== userId);
            return {
                matchId: mp.matchId,
                createdAt: mp.createdAt,
                isWinner: mp.isWinner,
                userScore: mp.score,
                opponentScore: opponent?.score ?? 0,
                opponentDisplayName: opponent?.user.displayName ?? 'Unknown',
                opponentAvatarUrl: opponent?.user.avatarURL ?? '',
            };
        });
        return ok(result);
    } catch (e) {
        console.error("db.getUserMatches: Error fetching matches:", e);
        return err("ERROR_FETCHING_MATCHES");
    }
}
