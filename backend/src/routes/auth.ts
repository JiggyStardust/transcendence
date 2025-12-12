import type { FastifyPluginAsync, RouteHandlerMethod } from "fastify";
import { enable2FA, verify2FASetup, verify2FALogin } from "../authentication/authController";
//import type { IVerify2FALoginBody, IVerify2FASetupBody, IEnable2FARequestBody } from "../authentication/authController";
//import { verifyToken } from "../authentication/authMiddleware";

const authRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  // protected routes
  fastify.post("/enable-2fa", { preHandler: [fastify.authenticate] }, enable2FA as RouteHandlerMethod);
  fastify.post("/verify-setup-2fa", { preHandler: [fastify.authenticate] }, verify2FASetup as RouteHandlerMethod);

  // public route
  fastify.post("/login-2fa", verify2FALogin as RouteHandlerMethod);
};

export default authRoutes;
