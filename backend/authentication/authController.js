// signup/login, returns JWT
// these functions wil be called by users.js

import db from '.../database.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from './authService.js'

export async function signup(req, reply) { // can delete from users.js
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
            reply.code(500).send({ error: 'Internal server error' });
        }           
    }
}

export async function login(req, reply) {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) return reply.code(400).send({ error: 'Invalid username or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.code(400).send({ error: 'Invaid username or password' });

    const accessToken = generateAccessToken({ id: user.id, username: user.username });
    const refreshToken = generateRefreshToken({ id: user.id });

    reply.send({ accessToken, refreshToken });
}