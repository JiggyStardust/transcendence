import db from '../database.js';

async function userRoutes(fastify, options) {
    // route - create new user
    fastify.post('/signup', async (req, reply) => {
        const { username, password } = req.body;

        // is this the point where i need to worry about SQL injections?

        if (!username || !password) {
            return reply.code(400).send({error: 'Username and password are required' });
        }
        try {
            db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, password);
            reply.code(201).send({ message: 'User created successfully!' });
        } catch (err) {
            reply.code(400).send({ error: 'Username already exists' });
        }
    });
}

export default userRoutes;
