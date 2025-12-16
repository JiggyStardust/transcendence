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

        const result: IMatchHistoryData[] = matches.map(mp => ({
            matchId: mp.matchId,
            userId: mp.userId,
            score: mp.score,
            isWinner: mp.isWinner,
            createdAt: mp.createdAt,

            participants: mp.match.participants.map(p => ({
                userId: p.userId,
                score: p.score,
                isWinner: p.isWinner,
                createdAt: p.createdAt,
                user: p.user,
            })),
        }));
        return ok(result);
    } catch (e) {
        console.error("db.getUserMatches: Error fetching matches:", e);
        return err("ERROR_FETCHING_MATCHES");
    }
}
