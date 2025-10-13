import db from '../database.js';
import bcrypt from 'bcrypt'; // why does it have these little lines?
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'super_secret_key'; // need dotenv to store these in .env file

async function userRoutes(fastify, options) {
    // route - create new user
    fastify.post('/signup', async (req, reply) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return reply.code(400).send({error: 'Username and password are required' });
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            // parameterized queries keep us safe from SQL injections
            db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, password);
            reply.code(201).send({ message: 'User created successfully!' });
        } catch (err) {
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                reply.code(400).send({ error: 'Username already exists' });
            } else {
                console.error(err);
                reply.code(500).send({ error: 'Internal erver error' });
            }           
        }
    });
}

export default userRoutes;
