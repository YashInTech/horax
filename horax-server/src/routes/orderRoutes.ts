import express from "express";
import {
	createOrder,
	getOrdersByUserId,
	getOrderById,
	getAllOrders,
	updateOrderStatus,
} from "../controllers/orderController";
import { protect } from "../middleware/auth";
import {
	createCashfreeOrder,
	verifyCashfreeOrder,
} from "../controllers/cashfreeController";

const router = express.Router();

// Create a new order (protected route)
router.post("/", protect, createOrder);

// Get all orders (admin only - should come BEFORE the /:userId route)
router.get("/all", protect, getAllOrders);

// Get order details by order ID (protected route)
router.get("/details/:orderId", protect, getOrderById);

// Update order status (admin only)
router.put("/:orderId/status", protect, updateOrderStatus);

// Get orders for a specific user by user ID (protected route)
router.get("/:userId", protect, getOrdersByUserId);

// Create a Cashfree order (protected route)
router.post("/checkout", protect, createCashfreeOrder);

// Verify payment and update order status
router.get("/status/:orderId", verifyCashfreeOrder);

export default router;
