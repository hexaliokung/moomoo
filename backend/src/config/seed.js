import db from "./database.js";

/**
 * Database Seed Script
 * Purpose: Initialize 10 tables and sample menu items (3 categories)
 * Usage: node backend/src/config/seed.js
 * Requirements: FR-014 (10 tables), FR-018 (sample menu with 3 categories)
 */

const seedTables = () => {
  console.log("🌱 Seeding tables...");

  // Clear tables
  db.prepare("DELETE FROM tables").run();

  // Create 10 tables with default Available status
  const insertTable = db.prepare(`
    INSERT INTO tables (tableNumber, status, customerCount, buffetTier, buffetPrice, diningTimeRemaining, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  for (let i = 1; i <= 10; i++) {
    insertTable.run(i, "Available", 0, "None", 0, 5400000, now);
  }

  console.log(`✅ Created 10 tables`);
};

const seedMenuItems = () => {
  console.log("🌱 Seeding menu items...");

  // Starter Menu - ไม่มีราคา (รวมในบุฟเฟ่ต์)
  const starterItems = [
    {
      name: "เนื้อหมูสไลด์",
      description: "เนื้อหมูคุณภาพดีหั่นบางพร้อมทาน",
      imageUrl: "/images/menu/pork-sliced.jpg",
      foodType: "pork",
      isAvailable: 1,
    },
    {
      name: "เนื้อไก่สไลด์",
      description: "เนื้อไก่สดหั่นบางพร้อมทาน",
      imageUrl: "/images/menu/chicken-sliced.jpg",
      foodType: "chicken",
      isAvailable: 1,
    },
    {
      name: "ผักรวม",
      description: "ผักสดหลากหลายชนิด",
      imageUrl: "/images/menu/vegetables.jpg",
      foodType: "vegetable",
      isAvailable: 1,
    },
    {
      name: "เห็ดรวม",
      description: "เห็ดสดหลากหลายชนิด",
      imageUrl: "/images/menu/mushrooms.jpg",
      foodType: "vegetable",
      isAvailable: 1,
    },
    {
      name: "ลูกชิ้นปลา",
      description: "ลูกชิ้นปลาทำสด",
      imageUrl: "/images/menu/fish-balls.jpg",
      foodType: "seafood",
      isAvailable: 1,
    },
  ];

  // Premium Menu - ไม่มีราคา (รวมในบุฟเฟ่ต์ Premium)
  const premiumItems = [
    {
      name: "เนื้อวากิว",
      description: "เนื้อวากิวเกรด A5 หั่นบาง",
      imageUrl: "/images/menu/wagyu.jpg",
      foodType: "beef",
      isAvailable: 1,
    },
    {
      name: "กุ้งแม่น้ำ",
      description: "กุ้งแม่น้ำสดขนาดใหญ่",
      imageUrl: "/images/menu/prawns.jpg",
      foodType: "seafood",
      isAvailable: 1,
    },
    {
      name: "หอยนางรม",
      description: "หอยนางรมสดจากทะเล",
      imageUrl: "/images/menu/oysters.jpg",
      foodType: "seafood",
      isAvailable: 1,
    },
    {
      name: "ปลาแซลมอนสด",
      description: "ปลาแซลมอนสดนำเข้า",
      imageUrl: "/images/menu/salmon.jpg",
      foodType: "seafood",
      isAvailable: 1,
    },
    {
      name: "เนื้อหมูคูโรบูตะ",
      description: "เนื้อหมูคูโรบูตะพรีเมี่ยม",
      imageUrl: "/images/menu/kurobuta.jpg",
      foodType: "pork",
      isAvailable: 1,
    },
  ];

  // Special Menu - อาหารพิเศษ สั่งเพิ่ม (มีราคา)
  const specialItems = [
    {
      name: "ซูชิแซลมอน",
      description: "ซูชิแซลมอนสด 8 ชิ้น",
      imageUrl: "/images/menu/salmon-sushi.jpg",
      foodType: "japanese",
      isAvailable: 1,
      price: 180,
    },
    {
      name: "ซาชิมิรวม",
      description: "ซาชิมิปลาสดรวม 12 ชิ้น",
      imageUrl: "/images/menu/sashimi.jpg",
      foodType: "japanese",
      isAvailable: 1,
      price: 250,
    },
    {
      name: "สเต็กเนื้อวากิว",
      description: "สเต็กเนื้อวากิว 200 กรัม",
      imageUrl: "/images/menu/wagyu-steak.jpg",
      foodType: "beef",
      isAvailable: 1,
      price: 450,
    },
    {
      name: "ข้าวผัดกุ้ง",
      description: "ข้าวผัดกุ้งสด",
      imageUrl: "/images/menu/prawn-rice.jpg",
      foodType: "rice",
      isAvailable: 1,
      price: 120,
    },
    {
      name: "น้ำอัดลม",
      description: "น้ำอัดลมเย็น",
      imageUrl: "/images/menu/soft-drink.jpg",
      foodType: "drink",
      isAvailable: 1,
      price: 20,
    },
    {
      name: "ชาไทย",
      description: "ชาไทยเย็นแท้",
      imageUrl: "/images/menu/thai-tea.jpg",
      foodType: "drink",
      isAvailable: 1,
      price: 30,
    },
  ];

  // Clear existing menu tables
  db.prepare("DELETE FROM starter_menu").run();
  db.prepare("DELETE FROM premium_menu").run();
  db.prepare("DELETE FROM special_menu").run();

  // Insert starter items (no price)
  const insertStarter = db.prepare(`
    INSERT INTO starter_menu (name, description, imageUrl, foodType, isAvailable)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const item of starterItems) {
    insertStarter.run(
      item.name,
      item.description,
      item.imageUrl,
      item.foodType,
      item.isAvailable
    );
  }

  // Insert premium items (no price)
  const insertPremium = db.prepare(`
    INSERT INTO premium_menu (name, description, imageUrl, foodType, isAvailable)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const item of premiumItems) {
    insertPremium.run(
      item.name,
      item.description,
      item.imageUrl,
      item.foodType,
      item.isAvailable
    );
  }

  // Insert special items (with price)
  const insertSpecial = db.prepare(`
    INSERT INTO special_menu (name, description, imageUrl, foodType, price, isAvailable)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const item of specialItems) {
    insertSpecial.run(
      item.name,
      item.description,
      item.imageUrl,
      item.foodType,
      item.price,
      item.isAvailable
    );
  }

  console.log(`✅ Created menu items:`);
  console.log(`   - Starter Menu: ${starterItems.length} items`);
  console.log(`   - Premium Menu: ${premiumItems.length} items`);
  console.log(`   - Special Menu: ${specialItems.length} items`);
};

const seed = () => {
  try {
    console.log("📦 Using SQLite database");

    // Run seed operations
    seedTables();
    seedMenuItems();

    console.log("\n✨ Seeding complete!");
    console.log("📊 Summary:");
    console.log("   - 10 tables initialized (Available status)");
    console.log("   - 16 menu items created (5 Starter, 5 Premium, 6 Special)");
    console.log("   - Menu stored in 3 separate tables");
    console.log("\n🚀 Ready to start restaurant operations!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

// Run seed
seed();

export { seedTables, seedMenuItems, seed };
