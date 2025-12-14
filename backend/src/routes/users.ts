import { signup, login, verify_player } from "../authentication/authController";
import { updateDisplayName, updatePassword } from "../authentication/userController";
import type { FastifyPluginAsync } from "fastify";

const userRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  // public routes
  fastify.post("/signup", signup);
  fastify.post("/login", login);
  fastify.post("/verify_player", {
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
    }, verify_player);

  // protected routes
  fastify.patch("/user", { preHandler: [fastify.authenticate] }, updateDisplayName);
  fastify.patch("/user/password", { preHandler: [fastify.authenticate] }, updatePassword);

  return;
};

export default userRoutes;
