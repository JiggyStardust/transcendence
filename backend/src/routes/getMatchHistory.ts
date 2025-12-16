import { FastifyInstance } from "fastify";
import { getUserMatches } from "../database/utils/getUserMatches";

export default async function matchHistory(fastify: FastifyInstance) {
    fastify.get("/match_history", async (req, reply) => {
        try {
            const { userId } = req.query as { userId: number };

            //validation
            if (userId === undefined) {
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
