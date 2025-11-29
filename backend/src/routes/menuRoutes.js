import express from "express";
import {
  getAllMenuItems,
  getMenuByCategory,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  deleteMenuItem,
} from "../controllers/menuController.js";
// TODO: Re-enable auth when login system is ready
// import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllMenuItems); // Get all menu items (grouped by category)
router.get("/:category", getMenuByCategory); // Get items by category (Starter/Premium/Special)
router.get("/:category/:id", getMenuItemById); // Get specific menu item

// Admin routes (temporarily without auth for development)
router.post("/:category", createMenuItem); // Create menu item in category
router.put("/:category/:id", updateMenuItem); // Update menu item
router.patch("/:category/:id/availability", toggleAvailability); // Toggle availability
router.delete("/:category/:id", deleteMenuItem); // Delete menu item

export default router;
