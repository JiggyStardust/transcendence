export const usernamePattern = /^[A-Za-z][A-Za-z0-9_]{2,19}$/;

export const USERNAME_ERROR_MESSAGE =
  "Username must be 3–20 characters long and can contain only letters, numbers, and underscores";

const forbiddenUsernames = new Set(["admin", "moderator", "demo"]);

export const validateUsername = (username: string): boolean => {
  if (!username) return false;

  const normalized = username.toLowerCase();

  if (normalized.length < 3 || normalized.length > 20) {
    return false;
  }

  if (forbiddenUsernames.has(normalized)) {
    return false;
  }

  return usernamePattern.test(username);
};
