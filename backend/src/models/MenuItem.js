import db from "../config/database.js";

/**
 * MenuItem Model - SQLite implementation with 3 separate tables
 * - starter_menu: ฟรี รวมในบุฟเฟ่ต์ทุกแบบ
 * - premium_menu: ฟรี รวมในบุฟเฟ่ต์ Premium เท่านั้น
 * - special_menu: สั่งเพิ่ม มีราคา
 */
class MenuItem {
  // Helper to get table name from category
  static getTableName(category) {
    const tables = {
      Starter: "starter_menu",
      Premium: "premium_menu",
      Special: "special_menu",
    };
    return tables[category] || null;
  }

  /**
   * Create a new menu item
   */
  static create(category, data) {
    const tableName = this.getTableName(category);
    if (!tableName) throw new Error(`Invalid category: ${category}`);

    const {
      name,
      description = "",
      imageUrl = "",
      foodType = "",
      price = 0,
      isAvailable = true,
    } = data;

    if (category === "Special") {
      const result = db
        .prepare(
          `INSERT INTO ${tableName} (name, description, imageUrl, foodType, price, isAvailable) VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(name, description, imageUrl, foodType, price, isAvailable ? 1 : 0);
      return this.findById(category, result.lastInsertRowid);
    } else {
      const result = db
        .prepare(
          `INSERT INTO ${tableName} (name, description, imageUrl, foodType, isAvailable) VALUES (?, ?, ?, ?, ?)`
        )
        .run(name, description, imageUrl, foodType, isAvailable ? 1 : 0);
      return this.findById(category, result.lastInsertRowid);
    }
  }

  /**
   * Find menu item by ID in specific category
   */
  static findById(category, id) {
    const tableName = this.getTableName(category);
    if (!tableName) return null;

    const item = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(id);
    return this.toObject(item, category);
  }

  /**
   * Find all items in a category
   */
  static findByCategory(category, availableOnly = false) {
    const tableName = this.getTableName(category);
    if (!tableName) return [];

    let query = `SELECT * FROM ${tableName}`;
    if (availableOnly) query += " WHERE isAvailable = 1";
    query += " ORDER BY name ASC";

    const items = db.prepare(query).all();
    return items.map((item) => this.toObject(item, category));
  }

  /**
   * Get all menu items from all categories
   */
  static findAll(availableOnly = false) {
    const result = {
      starter: this.findByCategory("Starter", availableOnly),
      premium: this.findByCategory("Premium", availableOnly),
      special: this.findByCategory("Special", availableOnly),
    };
    return result;
  }

  /**
   * Get all items as flat array
   */
  static findAllFlat(availableOnly = false) {
    const all = this.findAll(availableOnly);
    return [...all.starter, ...all.premium, ...all.special];
  }

  /**
   * Update menu item by ID
   */
  static updateById(category, id, data) {
    const tableName = this.getTableName(category);
    if (!tableName) throw new Error(`Invalid category: ${category}`);

    const fields = [];
    const values = [];

    const allowedFields = [
      "name",
      "description",
      "imageUrl",
      "foodType",
      "isAvailable",
    ];
    if (category === "Special") allowedFields.push("price");

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key)) {
        if (key === "isAvailable") {
          fields.push(`${key} = ?`);
          values.push(value ? 1 : 0);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
    }

    if (fields.length === 0) return this.findById(category, id);

    fields.push("updatedAt = datetime('now')");
    values.push(id);

    db.prepare(`UPDATE ${tableName} SET ${fields.join(", ")} WHERE id = ?`).run(
      ...values
    );

    return this.findById(category, id);
  }

  /**
   * Delete menu item by ID
   */
  static deleteById(category, id) {
    const tableName = this.getTableName(category);
    if (!tableName) throw new Error(`Invalid category: ${category}`);

    const item = this.findById(category, id);
    if (!item) return null;

    db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(id);
    return item;
  }

  /**
   * Toggle availability
   */
  static toggleAvailability(category, id, isAvailable) {
    return this.updateById(category, id, { isAvailable });
  }

  /**
   * Convert to object format
   */
  static toObject(item, category) {
    if (!item) return null;

    const base = {
      id: item.id,
      category,
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      foodType: item.foodType,
      isAvailable: item.isAvailable === 1,
      createdAt: item.createdAt ? new Date(item.createdAt) : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
    };

    // Add price only for Special menu
    if (category === "Special") {
      base.price = item.price || 0;
    }

    return base;
  }
}

export default MenuItem;
