
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const defaultDatabaseDirectory = path.join(__dirname, "../database");

const dbPath =
    process.env.DATABASE_PATH ||
    path.join(defaultDatabaseDirectory, "stagecraft.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to StageCraft SQLite database");
        console.log("Database location:", dbPath);
    }
});

db.serialize(() => {
    // Enable foreign key constraints
    db.run("PRAGMA foreign_keys = ON");

    // Technicians table
    db.run(`
        CREATE TABLE IF NOT EXISTS technicians (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL
        )
    `);

    // Speakers table
    db.run(`
        CREATE TABLE IF NOT EXISTS speakers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL
        )
    `);

    // Bookings table
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            technician_id INTEGER NOT NULL,
            speaker_id INTEGER NOT NULL,
            booking_date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'done')),
            FOREIGN KEY (technician_id) REFERENCES technicians(id),
            FOREIGN KEY (speaker_id) REFERENCES speakers(id)
        )
    `);
});

module.exports = db;
