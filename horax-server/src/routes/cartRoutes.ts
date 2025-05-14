import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
  mergeGuestCart,
  getCartCount,
} from '../controllers/cartController';

const router = express.Router();

// Get Cart
router.get('/:userId', getCart);

// Get Cart Count
router.get('/:userId/count', getCartCount);

// Add Item to Cart
router.post('/:userId/add', addToCart);

// Remove Item from Cart
router.delete('/:userId', removeFromCart);

// Update Item Quantity in Cart
router.put('/:userId/update', updateCart);

// Merge guest cart with user cart
router.post('/:userId/merge', mergeGuestCart);

export default router;
