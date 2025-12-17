import jwt from "jsonwebtoken";
import { REFRESH_EXPIRATION, JWT_SECRET, JWT_REFRESH_SECRET, ACCESS_COOKIE, REFRES_COOKIE } from "../constants";
import type { preHandlerHookHandler } from "fastify";
import { generateAccessToken, generateRefreshToken } from "./authService";

const { TokenExpiredError, JsonWebTokenError } = jwt;

function isExpiringSoon(exp: number, thresholdSeconds = 600): boolean {
  const now = Math.floor(Date.now() / 1000);
  return exp - now <= thresholdSeconds;
}

export const verifyToken: preHandlerHookHandler = (req, reply, done) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return reply.code(401).send({ error: "Missing authentication token" });
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as any;
    req.user = { id: decoded.id, username: decoded.username };
    return done();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      if (!refreshToken) {
        return reply.code(401).send({ error: "Session expired" });
      }

      try {
        const refreshDecoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
        const refreshPayload = { id: refreshDecoded.id, username: refreshDecoded.username };
        const newAccessToken = generateAccessToken(refreshPayload);
        reply
          .clearCookie(ACCESS_COOKIE, { path: "/", sameSite: "lax", secure: true })
          .setCookie(ACCESS_COOKIE, newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
          });
        if (isExpiringSoon(refreshDecoded.exp)) {
          const newRefreshToken = generateRefreshToken(refreshPayload);
          console.log("New resresh token generated:", refreshDecoded);
          reply.setCookie(REFRES_COOKIE, newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: REFRESH_EXPIRATION,
            path: "/",
          });
        }
        req.user = { id: refreshDecoded.id, username: refreshDecoded.username };
        return done();
      } catch (err) {
        console.log("Invalid refresh token", err);
        return reply.code(401).send({ error: "Invalid refresh token" });
      }
    }
    if (err instanceof JsonWebTokenError) {
      return reply.code(401).send({ error: "Invalid token" });
    }

    return reply.code(401).send({ error: "Unauthorized" });
  }
};
