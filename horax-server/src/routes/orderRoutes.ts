import express from 'express';
import * as orderController from '../controllers/orderController';
import { protect, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// User routes
router.post('/', protect, orderController.createOrder);
router.get('/user/:userId', protect, orderController.getOrdersByUserId);
router.get('/details/:orderId', protect, orderController.getOrderById);

// Admin routes
router.get('/', protect, authorizeRoles('admin'), orderController.getAllOrders);

router.put(
  '/:orderId/status',
  protect,
  authorizeRoles('admin'),
  orderController.updateOrderStatus
);

export default router;
