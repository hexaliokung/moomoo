/**
 * OrderQueue - FIFO Queue implementation for orders
 * This is a simple in-memory queue that supplements the database queue
 */
class OrderQueue {
  constructor() {
    this.normalQueue = [];
    this.specialQueue = [];
  }

  /**
   * Add order to appropriate queue
   * @param {Object} order - Order object
   */
  enqueue(order) {
    if (order.queueType === "Special") {
      this.specialQueue.push(order);
    } else {
      this.normalQueue.push(order);
    }
  }

  /**
   * Remove and return first order from queue
   * @param {String} queueType - 'Normal' or 'Special'
   * @returns {Object|null} First order or null if empty
   */
  dequeue(queueType) {
    if (queueType === "Special") {
      return this.specialQueue.shift() || null;
    }
    return this.normalQueue.shift() || null;
  }

  /**
   * View first order without removing
   * @param {String} queueType - 'Normal' or 'Special'
   * @returns {Object|null} First order or null if empty
   */
  peek(queueType) {
    if (queueType === "Special") {
      return this.specialQueue[0] || null;
    }
    return this.normalQueue[0] || null;
  }

  /**
   * Get queue size
   * @param {String} queueType - 'Normal' or 'Special'
   * @returns {Number} Queue size
   */
  size(queueType) {
    if (queueType === "Special") {
      return this.specialQueue.length;
    }
    return this.normalQueue.length;
  }

  /**
   * Check if queue is empty
   * @param {String} queueType - 'Normal' or 'Special'
   * @returns {Boolean} True if empty
   */
  isEmpty(queueType) {
    return this.size(queueType) === 0;
  }

  /**
   * Clear a queue
   * @param {String} queueType - 'Normal' or 'Special'
   */
  clear(queueType) {
    if (queueType === "Special") {
      this.specialQueue = [];
    } else {
      this.normalQueue = [];
    }
  }

  /**
   * Get all orders in a queue
   * @param {String} queueType - 'Normal' or 'Special'
   * @returns {Array} All orders in queue
   */
  getAll(queueType) {
    if (queueType === "Special") {
      return [...this.specialQueue];
    }
    return [...this.normalQueue];
  }
}

export default new OrderQueue();
