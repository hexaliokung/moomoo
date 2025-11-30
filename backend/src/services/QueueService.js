import Queue from "../models/Queue.js";

/**
 * QueueService - Manage customer waiting queue
 */
class QueueService {
  /**
   * Add a customer to the queue
   * @param {Object} data - { customerName, customerPhone, partySize }
   * @returns {Object} Created queue entry
   */
  async addToQueue(data) {
    const { customerName, customerPhone, partySize } = data;

    if (!customerName || !partySize) {
      throw new Error("Customer name and party size are required");
    }

    if (partySize < 1 || partySize > 4) {
      throw new Error("Party size must be between 1 and 4");
    }

    return Queue.create({
      customerName,
      customerPhone: customerPhone || "",
      partySize,
    });
  }

  /**
   * Get all queue entries (ordered by createdAt, oldest first)
   * @returns {Array} Queue entries
   */
  async getAllQueue() {
    return Queue.findAll();
  }

  /**
   * Get the next customer in queue (first/oldest)
   * @returns {Object} Queue entry
   */
  async getNextInQueue() {
    return Queue.getFirst();
  }

  /**
   * Call the next customer (removes from queue)
   * @returns {Object} Removed queue entry
   */
  async callNext() {
    const next = Queue.getFirst();

    if (!next) {
      throw new Error("Queue is empty");
    }

    return Queue.deleteFirst();
  }

  /**
   * Remove a specific queue entry by ID
   * @param {Number} id - Queue entry ID
   * @returns {Object} Removed queue entry
   */
  async removeFromQueue(id) {
    const queue = Queue.findById(id);

    if (!queue) {
      throw new Error("Queue entry not found");
    }

    return Queue.deleteById(id);
  }

  /**
   * Get queue count
   * @returns {Number} Number of customers in queue
   */
  async getQueueCount() {
    return Queue.count();
  }

  /**
   * Clear all queue entries
   * @returns {Number} Number of entries cleared
   */
  async clearQueue() {
    return Queue.deleteAll();
  }
}

export default new QueueService();
