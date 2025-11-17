// generate access and refresh tokens

import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET, ACCESS_EXPIRATION, REFRESH_EXPIRATION } from "../constants";
import speakeasy, { GeneratedSecret } from "speakeasy";
import qrcode from "qrcode";

interface TwoFASecret {
  qr: string;
  secret: string;
}

export async function generate2FASecret(username: string, userID: number): Promise<TwoFASecret> {
  // tells the compiler what ths function returns
  const secret = speakeasy.generateSecret({ name: `MyApp (${username})` });

  // ensure otpauth_url exists before using it
  if (!secret.otpauth_url) {
    throw new Error("Failed to generate otpauth_url");
  }

  // generate qr code
  const qr = await qrcode.toDataURL(secret.otpauth_url);

  return { qr, secret: secret.base32 };
}

export function verify2FAToken(secret: string, token: string) {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1, // to allow a 30s time drift and make UX smoother
  });
}

export const generateAccessToken = (payload: JwtPayload | string) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRATION });
};
export const generateRefreshToken = (payload: JwtPayload | string) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRATION });
};
