import { signup, login } from '../authentication/authController.js';
import type { FastifyPluginAsync } from "fastify";

const userRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
    // public routes
    fastify.post('/signup', signup);
    fastify.post('/login', login);
}

export default userRoutes;
