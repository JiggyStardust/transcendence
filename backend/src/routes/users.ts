import { signup, login, verify_player } from "../authentication/authController";
import { updateDisplayName, updatePassword } from "../authentication/userController";
import type { FastifyPluginAsync } from "fastify";
import { verifyToken } from "../authentication/authMiddleware";

const userRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  // public routes
  fastify.post("/signup", signup);
  fastify.post("/login", login);

  // protected routes
  fastify.post("/verify_player", {
      preHandler: [verifyToken],
      handler: verify_player,
      schema: {
        body: {
          type: "object",
          required: ["username", "password", "guestList"],
          properties: {
            username: { type: "string" },
            password: { type: "string" },
            guestList: {
              type: "array",
              items: { type: "integer" },
            }
          },
          additionalProperties: false
        }
      }
    });

  fastify.patch("/user", { preHandler: [verifyToken] }, updateDisplayName);
  fastify.patch("/user/password", { preHandler: [verifyToken] }, updatePassword);

  return;
};

export default userRoutes;
