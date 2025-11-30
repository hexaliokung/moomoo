import db from "../config/database.js";

/**
 * Queue Model - Simple queue management for waiting customers
 */
class Queue {
  /**
   * Add customer to queue
   */
  static create(data) {
    const { customerName, customerPhone = "", partySize } = data;

    const result = db
      .prepare(
        `
      INSERT INTO queue (customerName, customerPhone, partySize, createdAt)
      VALUES (?, ?, ?, datetime('now'))
    `
      )
      .run(customerName, customerPhone, partySize);

    return this.findById(result.lastInsertRowid);
  }

  /**
   * Find queue entry by ID
   */
  static findById(id) {
    const queue = db.prepare("SELECT * FROM queue WHERE id = ?").get(id);
    return this.toObject(queue);
  }

  /**
   * Get all queue entries ordered by creation time (FIFO)
   */
  static findAll() {
    const queues = db
      .prepare("SELECT * FROM queue ORDER BY createdAt ASC")
      .all();
    return queues.map((q) => this.toObject(q));
  }

  /**
   * Get the first (oldest) entry in the queue
   */
  static getFirst() {
    const queue = db
      .prepare("SELECT * FROM queue ORDER BY createdAt ASC LIMIT 1")
      .get();
    return this.toObject(queue);
  }

  /**
   * Delete queue entry by ID (call next in queue)
   */
  static deleteById(id) {
    const queue = this.findById(id);
    if (!queue) return null;

    db.prepare("DELETE FROM queue WHERE id = ?").run(id);
    return queue;
  }

  /**
   * Delete the first entry (call next customer)
   */
  static deleteFirst() {
    const first = this.getFirst();
    if (!first) return null;

    db.prepare("DELETE FROM queue WHERE id = ?").run(first.id);
    return first;
  }

  /**
   * Delete all queue entries
   */
  static deleteAll() {
    const result = db.prepare("DELETE FROM queue").run();
    return result.changes;
  }

  /**
   * Get queue count
   */
  static count() {
    return db.prepare("SELECT COUNT(*) as count FROM queue").get().count;
  }

  /**
   * Convert to object format
   */
  static toObject(queue) {
    if (!queue) return null;
    return {
      _id: queue.id,
      id: queue.id,
      customerName: queue.customerName,
      customerPhone: queue.customerPhone,
      partySize: queue.partySize,
      // SQLite datetime('now') stores UTC, append 'Z' to indicate UTC timezone
      createdAt: queue.createdAt ? new Date(queue.createdAt + "Z") : null,
    };
  }
}

export default Queue;
