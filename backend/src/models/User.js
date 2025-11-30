import db from "../config/database.js";

/**
 * User Model - SQLite implementation
 */
class User {
  /**
   * Create a new user
   */
  static create(data) {
    const { name, email } = data;

    const result = db
      .prepare(
        `
      INSERT INTO users (name, email) VALUES (?, ?)
    `
      )
      .run(name, email);

    return this.findById(result.lastInsertRowid);
  }

  /**
   * Find user by ID
   */
  static findById(id) {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    return this.toObject(user);
  }

  /**
   * Find user by email
   */
  static findByEmail(email) {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    return this.toObject(user);
  }

  /**
   * Find all users
   */
  static findAll() {
    const users = db.prepare("SELECT * FROM users").all();
    return users.map((user) => this.toObject(user));
  }

  /**
   * Update user by ID
   */
  static updateById(id, data) {
    const fields = [];
    const values = [];

    const allowedFields = ["name", "email"];

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    db.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`).run(
      ...values
    );

    return this.findById(id);
  }

  /**
   * Delete user by ID
   */
  static deleteById(id) {
    const user = this.findById(id);
    if (!user) return null;

    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    return user;
  }

  /**
   * Convert to object format (for compatibility)
   */
  static toObject(user) {
    if (!user) return null;
    return {
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

export default User;
