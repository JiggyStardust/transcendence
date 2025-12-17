import { FastifyInstance } from "fastify";
import { getUserMatches } from "../database/utils/getUserMatches";
import { verifyToken } from "../authentication/authMiddleware";

export default async function matchHistory(fastify: FastifyInstance) {
    fastify.get("/match_history", { preHandler: verifyToken }, async (req, reply) => {
        try {
            const userId = Number((req.query as { userId?: string }).userId);

            //validation
            if (!userId) {
                return reply.code(400).send({ error: " Missing required param: userId" });
            }

            // get match histor using bd function
            const result = await getUserMatches(fastify.db, userId);

            if (result.ok) {
                return reply.code(200).send(result.data);
            } else {
                return reply.code(500).send({ error: "Failed to fetch match history" });
            }
        } catch (error) {
            console.error(" Error in GET /match_history:", error);
            return reply.code(500).send({ error: "Internal server error" });
          }
    }); 
}
