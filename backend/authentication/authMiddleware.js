// verify JWT on protected routes

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';

export const verifyToken = (req, reply, done) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return reply.code(401).send({ error: 'Missing authorization header' });
    
    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        done();
    } catch (err) {
        reply.code(401).send({ error: 'Invalid or expired token' });
    }
};
