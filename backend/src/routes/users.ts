import { signup, login, verify_player } from '../authentication/authController';
import { updateDisplayName, updatePassword } from '../authentication/userController';
import type { FastifyPluginAsync } from "fastify";
import meRoutes from "./me";
import publicProfileRoutes from "./publicProfileRoutes";

const userRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
    // public routes
    fastify.post('/signup', signup);
    fastify.post('/login', login);
    fastify.post('/verify_player', verify_player);

    // protected routes
    fastify.patch('/updateDisplayName', updateDisplayName);
    fastify.patch('/updatePassword', updatePassword);

    fastify.register(meRoutes); // endpoint => /me
    fastify.register(publicProfileRoutes); // endpoint => users/:username GET /api/users/maria
    return;
}

export default userRoutes;
