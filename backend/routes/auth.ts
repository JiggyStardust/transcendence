import type { FastifyPluginAsync } from 'fastify';
import {
    enable2FA,
    verify2FASetup,
    verify2FALogin
} from '../authentication/authController';
import { verifyToken } from '../authentication/authMiddleware';

const authRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
    // protected routes
    fastify.post('/enable-2fa', { preHandler: verifyToken }, enable2FA);
    fastify.post('/verify-setup-2fa', { preHandler: verifyToken }, verify2FASetup);

    // public route
    fastify.post('/login-2fa', verify2FALogin);
};

export default authRoutes;
