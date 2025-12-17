import "dotenv/config";

export const JWT_SECRET = requireEnvVar(process.env.JWT_SECRET, "JWT_SECRET");
export const JWT_REFRESH_SECRET = requireEnvVar(process.env.JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET");

// Allow values in seconds only
export const ACCESS_EXPIRATION = checkAccessLimit(process.env.JWT_ACCESS_EXPIRATION, 30 * 24 * 60 * 60);
export const REFRESH_EXPIRATION = checkAccessLimit(process.env.JWT_REFRESH_EXPIRATION, 7 * 24 * 60 * 60);

// Ensure that the sensitive data is present and has been loaded from the local .env file
function requireEnvVar(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

// Validate format of given access limits
function checkAccessLimit(value: string | undefined, fallback: number): number {
  if (!value) throw new Error("Missing required env vars for JWT");
  return /^\d+$/.test(value) ? Number(value) : fallback;
}

export const ACCESS_COOKIE = "accessToken";
export const REFRES_COOKIE = "refreshToken";
