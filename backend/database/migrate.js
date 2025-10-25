const fs = require("node:fs");
const path = require("node:path");
const fastify = require("fastify")({ logger: true });
const database = require("better-sqlite3");

const dbPath = path.join(__dirname, "data", "database.db");
const db = new database(dbPath);

// create table to track migration progress
db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    run_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

function getMigratedFiles() {
  const rows = db.prepare("SELECT name FROM migrations").all();
  return rows.map((row) => row.name);
}

function runMigration() {
  const migratedFiles = new Set(getMigratedFiles());
  const migrationsDir = path.join(__dirname, "..", "migrations");
  const migrationAllFiles = fs.readdirSync(migrationsDir).sort();

  for (const file of migrationAllFiles) {
    if (!migratedFiles.has(file)) {
      const filePath = path.join(migrationsDir, file);
      const sqlRequest = fs.readFileSync(filePath, "utf8");
      fastify.log.info(
        new Date().toISOString() + ": Running migration: " + file,
      );
      db.exec(sqlRequest);
      db.prepare("INSERT INTO migrations (name) VALUES (?)").run(file);
    } else {
      fastify.log.info(
        new Date().toISOString() + ": Skipping migration: " + file,
      );
    }
  }

  fastify.log.info(new Date().toISOString() + ": Database is ready");
}

module.exports = runMigration;
