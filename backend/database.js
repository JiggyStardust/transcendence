import Database from 'better-sqlite3'

// create or open db file
const db = new Database('transcendence.db');

// create a users table 
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`).run();

export default db;
