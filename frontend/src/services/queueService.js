import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class QueueService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `Making ${config.method?.toUpperCase()} request to ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("Response error:", error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get all queue entries (ordered by createdAt, oldest first)
   */
  async getAllQueue() {
    try {
      const response = await this.api.get("/queue");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch queue:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch queue");
    }
  }

  /**
   * Add a customer to the queue
   * @param {Object} data - { customerName, customerPhone?, partySize }
   */
  async addToQueue(data) {
    try {
      const response = await this.api.post("/queue", data);
      return response.data;
    } catch (error) {
      console.error("Failed to add to queue:", error);
      throw new Error(
        error.response?.data?.message || "Failed to add to queue"
      );
    }
  }

  /**
   * Call the next customer (removes first from queue)
   */
  async callNext() {
    try {
      const response = await this.api.post("/queue/call-next");
      return response.data;
    } catch (error) {
      console.error("Failed to call next:", error);
      throw new Error(
        error.response?.data?.message || "Failed to call next customer"
      );
    }
  }

  /**
   * Remove a specific customer from queue
   * @param {Number} id - Queue entry ID
   */
  async removeFromQueue(id) {
    try {
      const response = await this.api.delete(`/queue/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to remove from queue:", error);
      throw new Error(
        error.response?.data?.message || "Failed to remove from queue"
      );
    }
  }

  /**
   * Get queue count
   */
  async getQueueCount() {
    try {
      const response = await this.api.get("/queue/count");
      return response.data;
    } catch (error) {
      console.error("Failed to get queue count:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get queue count"
      );
    }
  }
}

const queueService = new QueueService();
export default queueService;
