// generate access and refresh tokens

import jwt from  'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET, ACCESS_EXPIRATION, REFRESH_EXPIRATION } from './config.js';

export const generateAccessToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRATION });
export const generateRefreshToken = (payload) => jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRATION });
