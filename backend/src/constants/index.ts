/* JWT_SECRET, ACCESS_EXPIRATION etc
        - these values control how the programme creates and validated login tokens
        - JWT secrets is s ecret key used to sign in to JSON we token (jwt)
        - access tokens are short-lived, refresh tokens are long-lived and both are signed with secret keys

*/

import 'dotenv/config';
import { SignOptions } from "jsonwebtoken";

export const JWT_SECRET = requireEnvVar(process.env.JWT_SECRET, "JWT_SECRET");
export const JWT_REFRESH_SECRET = requireEnvVar(process.env.JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET");

// Allow values like "15m", "7d", "3600"
export const ACCESS_EXPIRATION =  checkAccessLimit(process.env.JWT_ACCESS_EXPIRATION) ?? '15m' as SignOptions["expiresIn"];
export const REFRESH_EXPIRATION =  checkAccessLimit(process.env.JWT_REFRESH_EXPIRATION) ?? '7d' as SignOptions["expiresIn"];

// Ensure that the sensitive data is present and has been loaded from the local .env file
function requireEnvVar(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

// Validate format of given access limits
function checkAccessLimit(value: string | undefined): SignOptions["expiresIn"] | undefined {
  if (!value) return undefined;
  return /^\d+$/.test(value) ? Number(value) : (value as SignOptions["expiresIn"]);
}
