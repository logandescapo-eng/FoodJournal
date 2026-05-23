import { openDatabaseAsync } from "expo-sqlite";

let db = null;

const getDb = async () => {
  if (!db) {
    db = await openDatabaseAsync("foodjournal.db");
  }
  return db;
};

export const initDatabase = async () => {
  const database = await getDb();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      username  TEXT    NOT NULL UNIQUE,
      password  TEXT    NOT NULL,
      email     TEXT    NOT NULL UNIQUE,
      createdAt TEXT    DEFAULT (datetime('now'))
    );
  `);
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
  try {
    const database = await getDb();
    const result = await database.runAsync(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
      [username, password, email]
    );
    return { success: true, userId: result.lastInsertRowId };
  } catch (error) {
    const message = error.message || "Database error";
    if (message.includes("UNIQUE constraint failed: users.username")) {
      return { success: false, error: "Username already exists" };
    }
    if (message.includes("UNIQUE constraint failed: users.email")) {
      return { success: false, error: "Email already registered" };
    }
    return { success: false, error: message };
  }
};

export const loginUser = async (username, password) => {
  try {
    const database = await getDb();
    const user = await database.getFirstAsync(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    if (user) return { success: true, user };
    return { success: false, error: "Invalid username or password" };
  } catch (error) {
    return { success: false, error: error.message || "Database error" };
  }
};

// ─── Journal entry operations ─────────────────────────────────────────────────
export const addJournalEntry = async (userId, imageUri, description, category) => {
  try {
    const database = await getDb();
    const result = await database.runAsync(
      "INSERT INTO journal_entries (userId, imageUri, description, category) VALUES (?, ?, ?, ?)",
      [userId, imageUri, description, category]
    );
    return { success: true, entryId: result.lastInsertRowId };
  } catch (error) {
    return { success: false, error: error.message || "Database error" };
  }
};

export const getAllEntries = async (userId) => {
  const database = await getDb();
  return database.getAllAsync(
    "SELECT * FROM journal_entries WHERE userId = ? ORDER BY createdAt DESC",
    [userId]
  );
};

export const getEntriesByCategory = async (userId, category) => {
  const database = await getDb();
  return database.getAllAsync(
    "SELECT * FROM journal_entries WHERE userId = ? AND category = ? ORDER BY createdAt DESC",
    [userId, category]
  );
};

export const updateJournalEntry = async (id, description, category) => {
  try {
    const database = await getDb();
    await database.runAsync(
      "UPDATE journal_entries SET description = ?, category = ? WHERE id = ?",
      [description, category, id]
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Database error" };
  }
};

export const deleteJournalEntry = async (id) => {
  try {
    const database = await getDb();
    await database.runAsync("DELETE FROM journal_entries WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Database error" };
  }
};

export const getCategories = async (userId) => {
  const database = await getDb();
  return database.getAllAsync(
    "SELECT DISTINCT category FROM journal_entries WHERE userId = ? ORDER BY category ASC",
    [userId]
  );
};
