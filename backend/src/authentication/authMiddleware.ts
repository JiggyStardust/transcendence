// verify JWT on protected routes

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import type { preHandlerHookHandler } from "fastify";

// TODO: review and test this function before use
export const verifyToken: preHandlerHookHandler = (req, reply, done) => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    reply.code(401).send({ error: "Missing authentication token" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded; // is any okay here?
    done();
  } catch (err) {
    reply.code(401).send({ error: "Invalid or expired token" });
  }
};

/*export const verifyToken: preHandlerHookHandler = async (req, reply) => {
  try {
    await req.jwtVerify();

  } catch (err) {
    reply.code(401).send({ error: "invalid or expired token" });
  }
}*/


