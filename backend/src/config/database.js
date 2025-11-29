import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, "..", "..", "moomoo.db");

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize tables
const initializeDatabase = () => {
  // Tables table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tableNumber INTEGER UNIQUE NOT NULL CHECK(tableNumber >= 1 AND tableNumber <= 10),
      status TEXT DEFAULT 'Available' CHECK(status IN ('Available', 'Open', 'Closed')),
      customerCount INTEGER DEFAULT 0 CHECK(customerCount >= 0 AND customerCount <= 4),
      buffetTier TEXT DEFAULT 'None' CHECK(buffetTier IN ('None', 'Starter', 'Premium')),
      buffetPrice REAL DEFAULT 0,
      openedAt TEXT,
      closedAt TEXT,
      diningTimeRemaining INTEGER DEFAULT 5400000,
      currentBillId INTEGER,
      pin TEXT,
      encryptedId TEXT,
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (currentBillId) REFERENCES bills(id)
    )
  `);

  // Bills table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tableNumber INTEGER NOT NULL CHECK(tableNumber >= 1 AND tableNumber <= 10),
      customerCount INTEGER NOT NULL CHECK(customerCount >= 1 AND customerCount <= 4),
      buffetTier TEXT NOT NULL CHECK(buffetTier IN ('Starter', 'Premium')),
      buffetPricePerPerson REAL NOT NULL,
      buffetCharges REAL NOT NULL,
      specialItemsTotal REAL DEFAULT 0,
      total REAL NOT NULL,
      preVatSubtotal REAL NOT NULL,
      vatAmount REAL NOT NULL,
      status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Archived')),
      createdAt TEXT DEFAULT (datetime('now')),
      archivedAt TEXT
    )
  `);

  // Bill special items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bill_special_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      billId INTEGER NOT NULL,
      menuItemId INTEGER,
      nameThai TEXT NOT NULL,
      nameEnglish TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL CHECK(quantity >= 1),
      subtotal REAL NOT NULL,
      FOREIGN KEY (billId) REFERENCES bills(id) ON DELETE CASCADE
    )
  `);

  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tableNumber INTEGER NOT NULL CHECK(tableNumber >= 1 AND tableNumber <= 10),
      queueType TEXT NOT NULL CHECK(queueType IN ('Normal', 'Special')),
      status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Completed')),
      notes TEXT DEFAULT '',
      createdAt TEXT DEFAULT (datetime('now')),
      completedAt TEXT
    )
  `);

  // Order items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER NOT NULL,
      menuItemId INTEGER,
      nameThai TEXT NOT NULL,
      nameEnglish TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity >= 1),
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  // Menu categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT UNIQUE NOT NULL CHECK(category IN ('Starter', 'Premium', 'Special'))
    )
  `);

  // Starter Menu table (ฟรี - รวมในบุฟเฟ่ต์)
  db.exec(`
    CREATE TABLE IF NOT EXISTS starter_menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      imageUrl TEXT DEFAULT '',
      foodType TEXT DEFAULT '',
      isAvailable INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Premium Menu table (ฟรี - รวมในบุฟเฟ่ต์ Premium เท่านั้น)
  db.exec(`
    CREATE TABLE IF NOT EXISTS premium_menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      imageUrl TEXT DEFAULT '',
      foodType TEXT DEFAULT '',
      isAvailable INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Special Menu table (สั่งเพิ่ม - มีราคา)
  db.exec(`
    CREATE TABLE IF NOT EXISTS special_menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      imageUrl TEXT DEFAULT '',
      foodType TEXT DEFAULT '',
      price REAL NOT NULL DEFAULT 0,
      isAvailable INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `);

  // Queue table (simple waiting list)
  db.exec(`
    CREATE TABLE IF NOT EXISTS queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      customerPhone TEXT DEFAULT '',
      partySize INTEGER NOT NULL CHECK(partySize >= 1 AND partySize <= 4),
      createdAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_tables_status ON tables(status);
    CREATE INDEX IF NOT EXISTS idx_bills_table_status ON bills(tableNumber, status);
    CREATE INDEX IF NOT EXISTS idx_bills_status_archived ON bills(status, archivedAt);
    CREATE INDEX IF NOT EXISTS idx_orders_queue ON orders(queueType, status, createdAt);
    CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(tableNumber, status);
  `);

  // Initialize 10 tables if not exist
  const tableCount = db.prepare("SELECT COUNT(*) as count FROM tables").get();
  if (tableCount.count === 0) {
    const insertTable = db.prepare(`
      INSERT INTO tables (tableNumber, status, customerCount, buffetTier, buffetPrice, diningTimeRemaining)
      VALUES (?, 'Available', 0, 'None', 0, 5400000)
    `);

    for (let i = 1; i <= 10; i++) {
      insertTable.run(i);
    }
    console.log("✅ Initialized 10 tables");
  }

  // Initialize menu categories if not exist
  const categoryCount = db
    .prepare("SELECT COUNT(*) as count FROM menu_categories")
    .get();
  if (categoryCount.count === 0) {
    const insertCategory = db.prepare(
      "INSERT INTO menu_categories (category) VALUES (?)"
    );
    insertCategory.run("Starter");
    insertCategory.run("Premium");
    insertCategory.run("Special");
    console.log("✅ Initialized menu categories");
  }

  console.log("✅ SQLite database initialized");
};

// Run initialization
initializeDatabase();

export default db;
