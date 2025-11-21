import { commonPasswords } from "./commonPasswords";

/**
 * Password validation regex pattern
 *
 * Requirements:
 * - ^                      : Start of string
 * - (?=.*[a-z])           : At least one lowercase letter (positive lookahead)
 * - (?=.*[A-Z])           : At least one uppercase letter (positive lookahead)
 * - (?=.*\d)              : At least one digit (positive lookahead)
 * - (?=.*[^A-Za-z0-9])    : At least one special character (not letter or digit)
 * - \S{8,255}             : 8 to 255 non-whitespace characters
 * - $                      : End of string
 *
 */
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,255}$/;
export const PASSWORD_ERROR_MESSAGE =
  "Password must be at least 8 chars, with upper, lower, digit, special and not common";

export const validatePassword = (password: string): boolean => {
  if (!password || password.length < 8 || password.length > 255) {
    return false;
  }

  if (commonPasswords.includes(password.toLowerCase())) {
    return false;
  }

  return passwordPattern.test(password);
};
