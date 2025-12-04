// verify JWT on protected routes

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import type { preHandlerHookHandler } from "fastify";

// TODO: review and test this function before use
export const verifyToken: preHandlerHookHandler = (req, reply, done) => {
  const token = req.cookies.accessToken;
  //if (!token) {
    //reply.code(401).send({ error: "Missing authorization header" });
    //return;
 // }

  //const token = authHeader.split(" ")[1];
  // "hello".split(' ') => array ["hello"] => invalid access by index 1
  // token expecting to be string, if !token we could return error before calling verify
  if (!token) {
    reply.code(401).send({ error: "Missing authentication token" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    done();
  } catch (err) {
    reply.code(401).send({ error: "Invalid or expired token" });
  }
};
