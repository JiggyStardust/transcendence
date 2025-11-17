// signup/login, returns JWT
// these functions wil be called by users.js

import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "./authService";
import type { FastifyReply, FastifyRequest } from "fastify";

interface IAuthRequestBody {
  username: string;
  password: string;
}

export async function signup(
  req: FastifyRequest<{ Body: IAuthRequestBody }>,
  reply: FastifyReply,
) {
  const { username, password } = req.body;

  if (!username || !password) {
    return reply
      .code(400)
      .send({ error: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await req.server.db.createUser(username, hashedPassword);
    if (!result.ok) {
      return reply
        .code(409)
        .send({ message: "User with this username already exists" });
    }
    return reply.code(201).send({ message: "User created" });
  } catch (err: any) {
    console.error(err);
    return reply.code(500).send({ error: "Internal server error" });
  }
}

export async function login(
  req: FastifyRequest<{ Body: IAuthRequestBody }>,
  reply: FastifyReply,
) {
  const { username, password } = req.body;
  // TODO: strong password validation
  if (!username || !password) {
    return reply
      .code(400)
      .send({ error: "Username and password are required" });
  }

  const result = await req.server.db.getUser(username);
  if (!result.ok)
    return reply.code(401).send({ error: "Invalid username or password" });

  const user = result.data;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid)
    return reply.code(401).send({ error: "Invalid username or password" });

  const accessToken = generateAccessToken({
    id: user.id,
    username: user.username,
  });
  const refreshToken = generateRefreshToken({ id: user.id });
  // TODO: store refresh token as deterministic hash (SHA256)
  reply.send({ accessToken, refreshToken });
}
