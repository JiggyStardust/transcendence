// verify JWT on protected routes

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';
import type { preHandlerHookHandler } from "fastify";

// TODO: review and test this function before use
export const verifyToken: preHandlerHookHandler = (req, reply, done) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return reply.code(401).send({ error: 'Missing authorization header' });

    const token = authHeader.split(' ')[1];
    // "hello".split(' ') => array ["hello"] => invalid access by index 1
    // token expecting to be string, if !token we could return error before calling verify
    if (!token) {
      reply.code(401).send({ error: 'Invalid or expired token' });
      return;
    }
    try {
        // function verify() reterning JWT payload, not just user... id? username?
        // req.user = jwt.verify(token, JWT_SECRET);
        const decoded = jwt.verify(token, JWT_SECRET);
        // do we need additionaly check data to send right response...
        done();
    } catch (err) {
        reply.code(401).send({ error: 'Invalid or expired token' });
    }
};
