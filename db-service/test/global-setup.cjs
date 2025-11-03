const { execSync } = require("node:child_process");

module.exports = async () => {
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL = "file:./test.db?mode=memory&cache=shared";
  try {
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
  } catch {
    execSync("npx prisma db push", { stdio: "inherit" });
  }
};
