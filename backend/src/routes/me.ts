import { FastifyInstance } from "fastify";
import { verifyToken } from "../authentication/authMiddleware";

export async function meRoutes(fastify: FastifyInstance) {
    fastify.get("/me", { preHandler: verifyToken }, async (req, reply) => {
        try {
            const userId = (req as any).user.id; // jwt payload

            const user = await fastify.db.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarURL: true,
                    createdAt: true,
                    updatedAt: true
                },
            });

            if (!user) {
                return reply.code(401).send({ error: "User not found" });
            }

            return user;

        } catch (error) {
            console.log(error);
            return reply.code(500).send({ error: "Server error" });
        }
    });
}

export default meRoutes;
