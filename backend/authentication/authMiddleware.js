// verify JWT on protected routes

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';

export const verifyToken = (req, reply, done => {{
    const authHeader = req.headers.authorization;
    if (!authHeader) return reply.code(401).send({ error: 'Missing authrization header' });
    
    //  const
}})