// Menu Service - Handles all menu-related API calls
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class MenuService {
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
      (response) => {
        return response;
      },
      (error) => {
        console.error("Response error:", error);
        if (
          error.code === "ERR_NETWORK" ||
          error.code === "ERR_CONNECTION_REFUSED"
        ) {
          console.warn("Backend server not available");
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get all menu items grouped by category
   * @returns {Object} { starter: [], premium: [], special: [] }
   */
  async getAllMenuItems() {
    try {
      const response = await this.api.get("/menu");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch all menu items:", error);
      throw error;
    }
  }

  /**
   * Get menu items by category
   * @param {String} category - 'Starter', 'Premium', or 'Special'
   * @returns {Array} Menu items in the category
   */
  async getMenuByCategory(category) {
    try {
      const response = await this.api.get(`/menu/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch ${category} menu:`, error);
      throw error;
    }
  }

  /**
   * Get a specific menu item by category and ID
   * @param {String} category - 'Starter', 'Premium', or 'Special'
   * @param {Number} id - Menu item ID
   * @returns {Object} Menu item
   */
  async getMenuItemById(category, id) {
    try {
      const response = await this.api.get(`/menu/${category}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch menu item:", error);
      throw error;
    }
  }

  /**
   * Create a new menu item
   * @param {String} category - 'Starter', 'Premium', or 'Special'
   * @param {Object} data - { name, description, foodType, imageUrl, price (Special only), isAvailable }
   * @returns {Object} Created menu item
   */
  async createMenuItem(category, data) {
    try {
      const response = await this.api.post(`/menu/${category}`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to create menu item:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create menu item."
      );
    }
  }

  /**
   * Update a menu item
   * @param {String} category - 'Starter', 'Premium', or 'Special'
   * @param {Number} id - Menu item ID
   * @param {Object} data - Fields to update
   * @returns {Object} Updated menu item
   */
  async updateMenuItem(category, id, data) {
    try {
      const response = await this.api.put(`/menu/${category}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to update menu item:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update menu item."
      );
    }
  }

  /**
   * Toggle menu item availability
   * @param {String} category - 'Starter', 'Premium', or 'Special'
   * @param {Number} id - Menu item ID
   * @param {Boolean} isAvailable - New availability status
   * @returns {Object} Updated menu item
   */
  async toggleAvailability(category, id, isAvailable) {
    try {
      const response = await this.api.patch(
        `/menu/${category}/${id}/availability`,
        { isAvailable }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to toggle availability:", error);
      throw new Error("Failed to update availability.");
    }
  }

  /**
   * Delete a menu item
   * @param {String} category - 'Starter', 'Premium', or 'Special'
   * @param {Number} id - Menu item ID
   * @returns {Object} Deleted menu item
   */
  async deleteMenuItem(category, id) {
    try {
      const response = await this.api.delete(`/menu/${category}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete menu item:", error);
      throw new Error("Failed to delete menu item.");
    }
  }

  // Helper: Calculate total price for items with quantities
  calculateTotal(items, quantities) {
    return items.reduce((total, item) => {
      const quantity = quantities[item.id] || 0;
      return total + (item.price || 0) * quantity;
    }, 0);
  }

  // Helper: Search menu items
  searchItems(items, query) {
    if (!query) return items;

    const searchTerm = query.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm)) ||
        (item.foodType && item.foodType.toLowerCase().includes(searchTerm))
    );
  }
}

// Create singleton instance
const menuService = new MenuService();

export default menuService;
