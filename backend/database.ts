import Database from 'better-sqlite3'

// create or open db file
const db = new Database('users.db');

// create a users table
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        twofa_secret TEXT
    )
`).run();

try {
    db.prepare(`
        ALTER TABLE users ADD COLUMN twofa_enabled INTEGER DEFAULT 0
        `).run();
} catch (e: any) {
    if (!e.message.includes ("duplicate column name")) {
        throw e;
    }
}

export default db;
