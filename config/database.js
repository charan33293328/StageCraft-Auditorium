
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const databaseDirectory = path.join(__dirname, "../database");

// Ensure the database directory exists
fs.mkdirSync(databaseDirectory, { recursive: true });

const dbPath = path.join(databaseDirectory, "stagecraft.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to StageCraft SQLite database");
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS technicians (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL
        )
    `);
});

module.exports = db;
