import { signup, login, verify_player, logout } from "../authentication/authController";
import { updateDisplayName, updatePassword } from "../authentication/userController";
import type { FastifyPluginAsync } from "fastify";
import meRoutes from "./me";
import publicProfileRoutes from "./publicProfileRoutes";

const userRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  // public routes
  fastify.post("/signup", signup);
  fastify.post("/login", login);
  fastify.post("/verify_player", verify_player);
   fastify.post("/logout", logout);

  // protected routes
  fastify.patch("/user", { preHandler: [fastify.authenticate] }, updateDisplayName);
  fastify.patch("/user/password", { preHandler: [fastify.authenticate] }, updatePassword);

  return;
};

export default userRoutes;
