// verify JWT on protected routes

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import type { preHandlerHookHandler } from "fastify";
import { FastifyRequest } from "fastify";

// TODO: review and test this function before use
export const verifyToken: preHandlerHookHandler = (req, reply, done) => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    reply.code(401).send({ error: "Missing authentication token" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as FastifyRequest).user = decoded; // is any okay here?
    done();
  } catch (err) {
    reply.code(401).send({ error: "Invalid or expired token" });
  }
};


// I think this file can be deleted