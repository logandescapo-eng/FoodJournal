import * as SQLite from "expo-sqlite";

let db;

// ─── Open / initialise ────────────────────────────────────────────────────────
export const openDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("foodjournal.db");
  }
  return db;
};

export const initDatabase = async () => {
  const database = await openDatabase();

  // Users table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      username  TEXT    NOT NULL UNIQUE,
      password  TEXT    NOT NULL,
      email     TEXT    NOT NULL UNIQUE,
      createdAt TEXT    DEFAULT (datetime('now'))
    );
  `);

  // Journal entries table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      userId      INTEGER NOT NULL,
      imageUri    TEXT    NOT NULL,
      description TEXT    NOT NULL,
      category    TEXT    NOT NULL DEFAULT 'Uncategorised',
      createdAt   TEXT    DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log("Database initialised successfully");
};

// ─── User operations ──────────────────────────────────────────────────────────
export const registerUser = async (username, password, email) => {
  const database = await openDatabase();
  try {
    const result = await database.runAsync(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
      [username, password, email]
    );
    return { success: true, userId: result.lastInsertRowId };
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed: users.username")) {
      return { success: false, error: "Username already exists" };
    }
    if (error.message.includes("UNIQUE constraint failed: users.email")) {
      return { success: false, error: "Email already registered" };
    }
    return { success: false, error: error.message };
  }
};

export const loginUser = async (username, password) => {
  const database = await openDatabase();
  const user = await database.getFirstAsync(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password]
  );
  if (user) return { success: true, user };
  return { success: false, error: "Invalid username or password" };
};

// ─── Journal entry operations ─────────────────────────────────────────────────
export const addJournalEntry = async (userId, imageUri, description, category) => {
  const database = await openDatabase();
  try {
    const result = await database.runAsync(
      "INSERT INTO journal_entries (userId, imageUri, description, category) VALUES (?, ?, ?, ?)",
      [userId, imageUri, description, category]
    );
    return { success: true, entryId: result.lastInsertRowId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllEntries = async (userId) => {
  const database = await openDatabase();
  return await database.getAllAsync(
    "SELECT * FROM journal_entries WHERE userId = ? ORDER BY createdAt DESC",
    [userId]
  );
};

export const getEntriesByCategory = async (userId, category) => {
  const database = await openDatabase();
  return await database.getAllAsync(
    "SELECT * FROM journal_entries WHERE userId = ? AND category = ? ORDER BY createdAt DESC",
    [userId, category]
  );
};

export const updateJournalEntry = async (id, description, category) => {
  const database = await openDatabase();
  try {
    await database.runAsync(
      "UPDATE journal_entries SET description = ?, category = ? WHERE id = ?",
      [description, category, id]
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteJournalEntry = async (id) => {
  const database = await openDatabase();
  try {
    await database.runAsync("DELETE FROM journal_entries WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCategories = async (userId) => {
  const database = await openDatabase();
  return await database.getAllAsync(
    "SELECT DISTINCT category FROM journal_entries WHERE userId = ? ORDER BY category ASC",
    [userId]
  );
};