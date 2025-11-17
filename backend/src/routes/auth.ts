import type { FastifyPluginAsync } from "fastify";
import { enable2FA, verify2FASetup, verify2FALogin } from "../authentication/authController";
import type { IVerify2FALoginBody, IVerify2FASetupBody, IEnable2FARequestBody } from "../authentication/authController";
import { verifyToken } from "../authentication/authMiddleware";

const authRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  // protected routes
  fastify.post<{ Body: IEnable2FARequestBody }>("/enable-2fa", { preHandler: verifyToken }, enable2FA);
  fastify.post<{ Body: IVerify2FASetupBody }>("/verify-setup-2fa", { preHandler: verifyToken }, verify2FASetup);

  // public route
  fastify.post<{ Body: IVerify2FALoginBody }>("/login-2fa", verify2FALogin);
};

export default authRoutes;
