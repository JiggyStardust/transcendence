import { FastifyInstance } from "fastify";
import { createMatch } from "../database/utils/createMatch";

export default async function matchesRoutes(fastify: FastifyInstance) {
    fastify.post("/matches", async (req, reply) => {
        try {
            const { userIds, scores, winner } = req.body as {
                userIds: number[];
                scores: number[];
                winner: boolean[];
            };

            // Validation
            if (!userIds || !scores || ! winner) {
                return reply.code(400).send({ 
                    error: "Missing required fields: userIds, scores, winner" });
            }

            // create match using db function
            const result = await createMatch(fastify.db, userIds, scores, winner);

            if (result.ok) {
                return reply.code(201).send(result.data);
            } else {
                const statusCode = result.data === "NOT_ENOUGH_PARTICIPANTS" ||
                    result.data === "INVALID_MATCH_PAYLOAD" ? 400 : 500;
                    return reply.code(statusCode).send({ error: result.data }); 
            }
        } catch (error) {
                console.log("Error in POST /matches:", error);
                return reply.code(500).send({ error: "Internal server error" });
            }
    });
}

