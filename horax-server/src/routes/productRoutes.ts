import express from 'express';
import multer from 'multer';
import {
  addProduct,
  getProductFields,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getBestsellerProducts,
} from '../controllers/productController';
import { protect, authorizeRoles } from '../middleware/auth';
import { validateProduct } from '../middleware/validate';

const router = express.Router();

// Multer configuration with improved security
const storage = multer.memoryStorage();
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept only specified image types
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only JPEG, PNG, and WEBP formats allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

// Public routes
router.get('/fields', getProductFields);
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestsellerProducts);
router.get('/:id', getProductById);

// Admin-only routes with validation
router.post(
  '/add',
  protect,
  authorizeRoles('admin'),
  upload.array('images', 5),
  validateProduct,
  addProduct
);

router.put(
  '/:id',
  protect,
  authorizeRoles('admin'),
  upload.array('images', 5),
  validateProduct,
  updateProduct
);

router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

export default router;
