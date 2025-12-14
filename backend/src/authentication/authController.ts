import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, generate2FASecret, verify2FAToken } from "./authService";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { IUserData } from "../database/types";
import speakeasy from "speakeasy";
import { validatePassword, PASSWORD_ERROR_MESSAGE } from "utils/validatePassword";
import { validateUsername, USERNAME_ERROR_MESSAGE } from "utils/validateUsername";

export interface IUserPayload {
  id: string;
  username: string;
}

export type AuthenticatedRequest<TBody> = FastifyRequest<{ Body: TBody }> & {
  user?: IUserPayload;
};

/** For signup & username/password login */
export interface IAuthRequestBody {
  username: string;
  password: string;
}

/** Enable 2FA – you don’t actually need a body here */
export interface IEnable2FARequestBody {}

/** Confirm 2FA setup (first-time, 6-digit code from app) */
export interface IVerify2FASetupBody {
  token: string;
}

/** Login step that checks 2FA code */
export interface IVerify2FALoginBody {
  username: string;
  token: string;
}

// generates qr code
export async function enable2FA(req: AuthenticatedRequest<IEnable2FARequestBody>, reply: FastifyReply) {
  if (!req.user || !req.user.id || !req.user.username) {
    return reply.code(401).send({ error: "Unauthorized - no username or no userID" });
  }

  const userID = Number(req.user.id);
  const username = req.user.username;

  try {
    const { qr, secret } = await generate2FASecret(username, userID);

    await req.server.db.user.update({
      where: { id: userID },
      data: { twoFAsecret: secret },
    });

    reply.send({ qr });
  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: "Failed to enable 2FA" });
  }
}

// confirms the setup - user sends a 6-digit token from the app
export async function verify2FASetup(req: AuthenticatedRequest<IVerify2FASetupBody>, reply: FastifyReply) {
  if (!req.user || !req.user.id || !req.body) return reply.code(401).send({ error: "Unauthorized" });

  const userID = req.user.id;
  const { token } = req.body;

  const user = await req.server.db.user.findUnique({
    where: { id: userID },
    select: {
      id: true,
      twoFAsecret: true,
    },
  });

  if (!user || !user.twoFAsecret) return reply.code(400).send({ error: "Invalid credentials" });

  const verified = verify2FAToken(user.twoFAsecret, token);
  if (!verified) return reply.code(400).send({ error: "Invalid code" });

  try {
    await req.server.db.user.update({
      where: { id: userID },
      data: { isTwoFAenabled: true },
    });
  } catch (e: any) {
    console.log("Error: verify2FASetup: ", e);
    reply.code(400).send({ error: "Invalid credentials" });
  }

  // Do we need body here?
  reply.send({ success: true });
}

// verifies the 2FA code durng login before issuing JWT
export async function verify2FALogin(req: AuthenticatedRequest<IVerify2FALoginBody>, reply: FastifyReply) {
  const { username, token } = req.body;

  const user = await req.server.db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      twoFAsecret: true,
    },
  });

  if (!user) return reply.code(401).send({ error: "Invalid credentials" });

  const verified = speakeasy.totp.verify({
    secret: user.twoFAsecret,
    encoding: "base32",
    token,
  });

  if (!verified) return reply.code(401).send({ error: "Invalid 2FA code" });
  const jwtToken = generateAccessToken({ id: user.id, username: user.username });

  // TODO: seems Refresh token is missing for 2FA
  reply.send({ token: jwtToken });
}

export async function signup(req: FastifyRequest<{ Body: IAuthRequestBody }>, reply: FastifyReply) {
  const { username, password } = req.body;

  if (!username || !password) {
    return reply.code(400).send({ error: "Username and password are required" });
  }

  if (!validatePassword(password)) {
    return reply.code(400).send({ error: PASSWORD_ERROR_MESSAGE });
  }

  if (!validateUsername(username)) {
    return reply.code(400).send({ error: USERNAME_ERROR_MESSAGE });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await req.server.db.createUser(username, hashedPassword);
    if (!result.ok) {
      return reply.code(409).send({ message: "User with this username already exists" });
    }
    return reply.code(201).send({ message: "User created" });
  } catch (err: any) {
    console.error(err);
    return reply.code(500).send({ error: "Internal server error" });
  }
}

export async function login(req: FastifyRequest<{ Body: IAuthRequestBody }>, reply: FastifyReply) {
  const { username, password } = req.body;

  if (!username || !password) {
    return reply.code(400).send({ error: "Username and password are required" });
  }

  const result = await req.server.db.getUser(username);
  if (!result.ok) return reply.code(401).send({ error: "Invalid username or password" });

  const user: IUserData = result.data;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return reply.code(401).send({ error: "Invalid username or password" });

  if (user.isTwoFAenabled) {
    return reply.send({
      twoFARequired: true,
      userId: user.id,
      username: user.username,
    });
  }

  // normal login without 2FA
  const accessToken = generateAccessToken({
    id: user.id,
    username: user.username,
  });
  const refreshToken = generateRefreshToken({ id: user.id });

  reply
    .setCookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      //sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
      path: "/"
    })
    .setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      //sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    })
    .send({ message: "Logged in!" })
}

export async function verify_player(req: FastifyRequest<{ Body: IAuthRequestBody }>, reply: FastifyReply) {
  const { username, password } = req.body;

  if (!username || !password) {
    return reply.code(400).send({ error: "Username and password are required" });
  }

  const result = await req.server.db.getUser(username);
  if (!result.ok) return reply.code(401).send({ error: "Invalid username or password" });

  const user: IUserData = result.data;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return reply.code(401).send({ error: "Invalid username or password" });

  return {
    status: "verified",
    userID: user.id,
    username: user.username
  }; // also return displayName and avatarURL
}

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  
  reply
    .clearCookie("accessToken", { path: "/" })
    .clearCookie("refreshToken", { path: "/" })
    .send({ message: "Logged out!" })
}
