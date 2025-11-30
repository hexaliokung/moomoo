import express from "express";
import {
  getAllQueue,
  getNextInQueue,
  addToQueue,
  callNextInQueue,
  removeFromQueue,
  getQueueCount,
} from "../controllers/queueController.js";

const router = express.Router();

// Public routes
router.get("/", getAllQueue); // Get all queue entries
router.get("/next", getNextInQueue); // Peek at next customer
router.get("/count", getQueueCount); // Get queue count

// Admin routes (temporarily without auth for development)
router.post("/", addToQueue); // Add customer to queue
router.post("/call-next", callNextInQueue); // Call next customer (removes from queue)
router.delete("/:id", removeFromQueue); // Remove specific customer from queue

export default router;
