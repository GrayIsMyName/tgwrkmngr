import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';

let db: Database.Database | null = null;

export function initDatabase() {
  // Create data directory if it doesn't exist
  if (!existsSync('data')) {
    mkdirSync('data');
  }

  db = new Database('data/workmanager.db');
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  createTables();
  console.log('✅ Database initialized');
}

function createTables() {
  if (!db) throw new Error('Database not initialized');

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT,
      username TEXT,
      status TEXT NOT NULL DEFAULT 'no_access',
      requestedAt TEXT,
      requestReason TEXT
    )
  `);

  // Table data
  db.exec(`
    CREATE TABLE IF NOT EXISTS table_data (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      mlNumber TEXT NOT NULL,
      date TEXT NOT NULL,
      surname TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      createdBy INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // User roles (admin or user)
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_roles (
      userId INTEGER PRIMARY KEY,
      role TEXT NOT NULL DEFAULT 'user',
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Admin settings
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Initialize admin password if not exists
  const adminPassword = db.prepare('SELECT * FROM admin_settings WHERE key = ?').get('adminPassword');
  if (!adminPassword) {
    db.prepare('INSERT INTO admin_settings (key, value) VALUES (?, ?)').run('adminPassword', 'X9$kP2mQ@vL8nR4wT');
  }
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

