import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
} from '../controllers/profileController';
import { protect } from '../middleware/auth';
import { validateBase64Image } from '../middleware/validateImage';

const router = express.Router();

router.get('/', protect, getUserProfile);
router.put('/', protect, validateBase64Image, updateUserProfile);

export default router;
