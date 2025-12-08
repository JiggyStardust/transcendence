import { signup, login, verify_player } from '../authentication/authController';
import { updateDisplayName, updatePassword } from '../authentication/userController';
import type { FastifyPluginAsync } from "fastify";

const userRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
    // public routes
    fastify.post('/signup', signup);
    fastify.post('/login', login);
    fastify.post('/verify_player', verify_player);

    // protected routes
    fastify.patch('/updateDisplayName', updateDisplayName);
    fastify.patch('/updatePassword', updatePassword);
    return;
}

export default userRoutes;
