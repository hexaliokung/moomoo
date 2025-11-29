import db from "../config/database.js";

/**
 * Order Model - SQLite implementation
 */
class Order {
  /**
   * Create a new order
   */
  static create(data) {
    const {
      tableNumber,
      queueType,
      items,
      status = "Pending",
      notes = "",
    } = data;

    const result = db
      .prepare(
        `
      INSERT INTO orders (tableNumber, queueType, status, notes)
      VALUES (?, ?, ?, ?)
    `
      )
      .run(tableNumber, queueType, status, notes);

    const orderId = result.lastInsertRowid;

    // Insert order items
    const insertItem = db.prepare(`
      INSERT INTO order_items (orderId, menuItemId, nameThai, nameEnglish, price, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      insertItem.run(
        orderId,
        item.menuItem || item.menuItemId,
        item.nameThai,
        item.nameEnglish,
        item.price,
        item.quantity || 1
      );
    }

    return this.findById(orderId);
  }

  /**
   * Find order by ID
   */
  static findById(id) {
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
    if (!order) return null;

    const items = db
      .prepare("SELECT * FROM order_items WHERE orderId = ?")
      .all(id);
    return this.toObject(order, items);
  }

  /**
   * Find orders by queue type and status
   */
  static findByQueue(queueType, status = "Pending") {
    const orders = db
      .prepare(
        `
      SELECT * FROM orders 
      WHERE queueType = ? AND status = ?
      ORDER BY createdAt ASC
    `
      )
      .all(queueType, status);

    return orders.map((order) => {
      const items = db
        .prepare("SELECT * FROM order_items WHERE orderId = ?")
        .all(order.id);
      return this.toObject(order, items);
    });
  }

  /**
   * Find orders by table number
   */
  static findByTable(tableNumber) {
    const orders = db
      .prepare(
        `
      SELECT * FROM orders 
      WHERE tableNumber = ?
      ORDER BY createdAt DESC
    `
      )
      .all(tableNumber);

    return orders.map((order) => {
      const items = db
        .prepare("SELECT * FROM order_items WHERE orderId = ?")
        .all(order.id);
      return this.toObject(order, items);
    });
  }

  /**
   * Find completed orders for billing
   */
  static findCompletedForBilling(tableNumber) {
    const orders = db
      .prepare(
        `
      SELECT * FROM orders 
      WHERE tableNumber = ? AND status = 'Completed' AND queueType = 'Special'
      ORDER BY completedAt ASC
    `
      )
      .all(tableNumber);

    return orders.map((order) => {
      const items = db
        .prepare("SELECT * FROM order_items WHERE orderId = ?")
        .all(order.id);
      return this.toObject(order, items);
    });
  }

  /**
   * Mark order as completed
   */
  static complete(orderId) {
    db.prepare(
      `
      UPDATE orders SET status = 'Completed', completedAt = datetime('now')
      WHERE id = ?
    `
    ).run(orderId);

    return this.findById(orderId);
  }

  /**
   * Update order
   */
  static updateById(id, data) {
    const fields = [];
    const values = [];

    const allowedFields = ["status", "completedAt", "notes"];

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        if (value instanceof Date) {
          values.push(value.toISOString());
        } else {
          values.push(value);
        }
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    db.prepare(`UPDATE orders SET ${fields.join(", ")} WHERE id = ?`).run(
      ...values
    );

    return this.findById(id);
  }

  /**
   * Convert to object format (for compatibility)
   */
  static toObject(order, items = []) {
    if (!order) return null;
    return {
      _id: order.id,
      id: order.id,
      tableNumber: order.tableNumber,
      queueType: order.queueType,
      status: order.status,
      notes: order.notes,
      items: items.map((item) => ({
        _id: item.id,
        menuItem: item.menuItemId,
        nameThai: item.nameThai,
        nameEnglish: item.nameEnglish,
        price: item.price,
        quantity: item.quantity,
      })),
      createdAt: order.createdAt ? new Date(order.createdAt) : null,
      completedAt: order.completedAt ? new Date(order.completedAt) : null,
    };
  }
}

export default Order;
