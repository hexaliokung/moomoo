import MenuItem from "../models/MenuItem.js";

/**
 * MenuService - Business logic for menu item management
 * Handles 3 separate menu categories: Starter, Premium, Special
 */
class MenuService {
  /**
   * Get all menu items grouped by category
   * @param {Boolean} availableOnly - Only return available items
   * @returns {Object} { starter: [], premium: [], special: [] }
   */
  async getAllMenuItems() {
    // คืนข้อมูลเมนูทั้งหมด ไม่ใช้ filter
    const menuItems = await MenuItem.find({}).sort({
      category: 1,
      nameEnglish: 1,
    });
    return menuItems;
  }

  /**
   * Get a specific menu item by category and ID
   * @param {String} category - Category name
   * @param {Number} id - Menu item ID
   * @returns {Object} Menu item
   */
  async getMenuItemById(category, id) {
    const menuItem = MenuItem.findById(category, id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    return menuItem;
  }

  /**
   * Create a new menu item
   * @param {String} category - Category name
   * @param {Object} data - Menu item data
   * @returns {Object} Created menu item
   */
  async createMenuItem(category, data) {
    const { name, description, imageUrl, foodType, price, isAvailable } = data;

    // Validate required fields
    if (!name) {
      throw new Error("Name is required");
    }

    // Validate category
    const validCategories = ["Starter", "Premium", "Special"];
    if (!validCategories.includes(category)) {
      throw new Error(
        `Invalid category. Must be one of: ${validCategories.join(", ")}`
      );
    }

    // Validate price for Special menu
    if (category === "Special" && (price === undefined || price < 0)) {
      throw new Error("Price is required for Special menu and must be >= 0");
    }

    return MenuItem.create(category, {
      name,
      description: description || "",
      imageUrl: imageUrl || "",
      foodType: foodType || "",
      price: category === "Special" ? price : 0,
      isAvailable: isAvailable !== false,
    });
  }

  /**
   * Update an existing menu item
   * @param {String} category - Category name
   * @param {Number} id - Menu item ID
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated menu item
   */
  async updateMenuItem(category, id, updates) {
    const menuItem = MenuItem.findById(category, id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    // Validate price for Special menu
    if (
      category === "Special" &&
      updates.price !== undefined &&
      updates.price < 0
    ) {
      throw new Error("Price must be >= 0");
    }

    return MenuItem.updateById(category, id, updates);
  }

  /**
   * Toggle menu item availability
   * @param {String} category - Category name
   * @param {Number} id - Menu item ID
   * @param {Boolean} isAvailable - New availability status
   * @returns {Object} Updated menu item
   */
  async toggleAvailability(category, id, isAvailable) {
    const menuItem = MenuItem.findById(category, id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    return MenuItem.toggleAvailability(category, id, isAvailable);
  }

  /**
   * Delete a menu item
   * @param {String} category - Category name
   * @param {Number} id - Menu item ID
   * @returns {Object} Deleted menu item
   */
  async deleteMenuItem(category, id) {
    const menuItem = MenuItem.findById(category, id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    return MenuItem.deleteById(category, id);
  }

  /**
   * Get all items as flat array (for compatibility)
   * @param {Boolean} availableOnly - Only return available items
   * @returns {Array} All menu items
   */
  async getAllItemsFlat(availableOnly = false) {
    return MenuItem.findAllFlat(availableOnly);
  }
}

export default new MenuService();
