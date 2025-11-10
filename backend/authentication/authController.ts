// signup/login, returns JWT
// these functions wil be called by users.js

import db from '../database';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from './authService'
import type { FastifyReply, FastifyRequest } from 'fastify';
import { generate2FASecret, verify2FAToken } from './authService';
import 'fastify';
import speakeasy, {GeneratedSecret} from 'speakeasy';
import { JWT_SECRET } from './config'

declare module 'fastify' {
    interface FastifyRequest {
        user?:  {
            id: number;
            username: string;
            twofa_secret?: string;
        };
    }
}

interface IAuthRequestBody {
  username: string;
  password: string;
  token: string;
}

// Temporary
interface IUserData {
  id: number;
  username: string,
  password: string;
  twofa_secret?: string;
  twofa_enabled?: number;
}

export async function enable2FA(req: FastifyRequest<{ Body: IAuthRequestBody }>, reply: FastifyReply) {
    const userID = req.user?.id;
    const username = req.user?.username;

    if (!userID || !username) {
        return reply.code(401).send({ error: 'Unauthorized' });
    }

    try {
        const { qr } = await generate2FASecret(username, userID);
        reply.send({ qr });
    } catch (err) {
        console.error(err);
        reply.code(500).send({ error: 'Failed to enable 2FA' });
    }
}

export async function verify2FASetup(req: FastifyRequest<{ Body: IAuthRequestBody }>, reply: FastifyReply) {
    const userID = req.user?.id;
    const { token } = req.body;

    if (!userID) return reply.code(401).send({ error: 'Unauthorized' });

    const user = db.prepare<IUserData>('SELECT twofa_secret FROM users WHERE id = ?').get(userID);

    const verified = verify2FAToken(user?.twofa_secret, token);
    if (!verified) return reply.code(400).send({ error: 'Invalid code' });

    db.prepare('UPDATE users SET twofa_enabled = 1 WHERE id = ?').run(userID);
    reply.send({ success: true });
}

export async function verify2FALogin(req: FastifyRequest<{ Body: IAuthRequestBody }>, reply: FastifyReply) {
    const { username, token } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    const verified = speakeasy.totp.verify({
        secret: user?.twofa_secret,
        encoding: 'base32',
        token
    });

    if (!verified) return reply.code(401).send({ error: 'Invalid 2FA code' });
    const jwtToken = jwt.sign({ id: user?.id, username: user?.username },
        JWT_SECRET, { expiresIn: '1h' });
    
    reply.send({ token: jwtToken });
}

export async function signup(req: FastifyRequest<{ Body: IAuthRequestBody }>, reply: FastifyReply) {
    const { username, password } = req.body;
    if (!username || !password) {
        return reply.code(400).send({error: 'Username and password are required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // parameterized queries keep us safe from SQL injections
        db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);
        reply.code(201).send({ message: 'User created successfully!' });
    } catch (err: any) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            reply.code(400).send({ error: 'Username already exists' });
        } else {
            console.error(err);
            reply.code(500).send({ error: 'Internal server error' });
        }
    }
}

export async function login(req: FastifyRequest<{ Body: IAuthRequestBody }>, reply: FastifyReply) {
    const { username, password } = req.body;
    const user = db.prepare('SELECT id, username, password FROM users WHERE username = ?').get(username) as IUserData;
    if (!user) return reply.code(401).send({ error: 'Invalid username or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.code(401).send({ error: 'Invalid username or password' });

    const accessToken = generateAccessToken({ id: user.id, username: user.username });
    const refreshToken = generateRefreshToken({ id: user.id });

    reply.send({ accessToken, refreshToken });
}
