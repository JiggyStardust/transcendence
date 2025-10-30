import db from '../database.js';
import { signup, login } from '../authentication/authController.js';
import { verifyToken } from '../authentication/authMiddleware.js';

async function userRoutes(fastify, options) {
    // public routes
    fastify.post('/signup', signup);
    fastify.post('/login', login);

    // protected routes - user profile, friend list, match history
    // user profile
    fastify.get('/profile', { preHandler: verifyToken }, async (req, reply) => {
        const user = db.prepare('SELECT id, username FROM users WHERE id = ?').get(req.user.id);
        if (!user) return reply.code(404).send({ error: 'User not found' });
        reply.send({ user });
    })
    
    // friend list -=> this is to get the friendlist, we should also be able to add someone to friendlist
    fastify.get('/friends', { preHandler: verifyToken }, async (req, reply) => {
        const friends = db.prepare(`
            SELECT f.friends_id AS ID, u.username
            FROM friends f
            JOIN users u ON f.friends = u.id
            WHERE f.users_id = ?
            `).all(req.user.id);
            reply.send({ friends });
    });

    // match history => for getting match history, but where should we add matches?
    fastify.get('/matches', { preHandler: verifyToken }, async (req, reply) => {
        const matches = db.prepare(`
            SELECT *
            FROM matches
            WHERE player1_id = ? OR player2_id = ?
            ORDER BY date DESC
            `).all(req.user.id, req.user.id);
            reply.send({ matches });
    });
}

export default userRoutes;
