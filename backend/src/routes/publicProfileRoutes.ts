import { FastifyPluginAsync } from "fastify";
import { verifyToken } from "../authentication/authMiddleware";

const publicProfileRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/users/:username", { preHandler: verifyToken }, async (req, reply) => {
    const { username } = req.params as { username: string };

    const user = await fastify.db.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarURL: true,
        createdAt: true,
      },
    });

    if (!user) {
      return reply.code(404).send({ error: "User not found" });
    }

    return reply.send(user);
  });
};

export default publicProfileRoutes;
