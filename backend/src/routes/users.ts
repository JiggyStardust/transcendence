import { signup, login, verify_player, logout } from "../authentication/authController";
import { updateDisplayName, updatePassword } from "../authentication/userController";
import type { IUpdateDisplayNameBody } from "../authentication/userController";
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
          },
        },
        additionalProperties: false,
      },
    },
  });

  fastify.post("/logout", { preHandler: [verifyToken], handler: logout });

  fastify.patch<{ Body: IUpdateDisplayNameBody }>(
    "/user",
    {
      preHandler: [verifyToken],
      schema: {
        body: {
          type: "object",
          required: ["displayName"],
          properties: { displayName: { type: "string", minLength: 3 } },
          additionalProperties: false,
        },
      },
    },
    updateDisplayName,
  );
  fastify.patch("/user/password", { preHandler: [verifyToken] }, updatePassword);
};

export default userRoutes;
