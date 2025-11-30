import asyncHandler from "express-async-handler";
import QueueService from "../services/QueueService.js";

/**
 * @route   GET /api/queue
 * @desc    Get all queue entries (ordered by createdAt)
 * @access  Public
 */
export const getAllQueue = asyncHandler(async (req, res) => {
  const queue = await QueueService.getAllQueue();

  res.status(200).json({
    success: true,
    count: queue.length,
    data: queue,
  });
});

/**
 * @route   GET /api/queue/next
 * @desc    Get the next customer in queue (peek, doesn't remove)
 * @access  Public
 */
export const getNextInQueue = asyncHandler(async (req, res) => {
  const next = await QueueService.getNextInQueue();

  res.status(200).json({
    success: true,
    data: next,
  });
});

/**
 * @route   POST /api/queue
 * @desc    Add a customer to the queue
 * @access  Public
 * @body    { customerName, customerPhone?, partySize }
 */
export const addToQueue = asyncHandler(async (req, res) => {
  const { customerName, customerPhone, partySize } = req.body;

  const queue = await QueueService.addToQueue({
    customerName,
    customerPhone,
    partySize,
  });

  res.status(201).json({
    success: true,
    message: "Added to queue successfully",
    data: queue,
  });
});

/**
 * @route   POST /api/queue/call-next
 * @desc    Call the next customer (removes first from queue)
 * @access  Private (admin only)
 */
export const callNextInQueue = asyncHandler(async (req, res) => {
  const called = await QueueService.callNext();

  res.status(200).json({
    success: true,
    message: "Called next customer",
    data: called,
  });
});

/**
 * @route   DELETE /api/queue/:id
 * @desc    Remove a specific customer from queue
 * @access  Private (admin only)
 */
export const removeFromQueue = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const removed = await QueueService.removeFromQueue(parseInt(id));

  res.status(200).json({
    success: true,
    message: "Removed from queue",
    data: removed,
  });
});

/**
 * @route   GET /api/queue/count
 * @desc    Get the number of customers in queue
 * @access  Public
 */
export const getQueueCount = asyncHandler(async (req, res) => {
  const count = await QueueService.getQueueCount();

  res.status(200).json({
    success: true,
    data: { count },
  });
});
