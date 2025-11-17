// generate access and refresh tokens

import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET, ACCESS_EXPIRATION, REFRESH_EXPIRATION } from '../constants';

export const generateAccessToken = (payload: JwtPayload | string) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRATION});
}
export const generateRefreshToken = (payload: JwtPayload | string) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRATION});
}
