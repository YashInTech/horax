import express from 'express';
import * as productController from '../controllers/productController';
import { protect, authorizeRoles } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/', productController.getAllProducts); // Changed from getProducts to getAllProducts
router.get('/:id', productController.getProductById);
router.get('/featured/products', productController.getFeaturedProducts);
router.get('/bestseller/products', productController.getBestsellerProducts);

// Admin routes - secured with protect middleware and admin role
router.post(
  '/add',
  protect,
  authorizeRoles('admin'),
  upload.array('images', 5),
  productController.addProduct
);

router.put(
  '/:id',
  protect,
  authorizeRoles('admin'),
  upload.array('images', 5),
  productController.updateProduct
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'),
  productController.deleteProduct
);

export default router;
