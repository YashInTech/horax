import express from 'express';
import {
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses,
} from '../controllers/addressController';

const router = express.Router();

// Routes for Address Management
router.get('/:userId', getAddresses);
router.post('/:userId', addAddress);
router.put('/:userId/:addressId', updateAddress);
router.delete('/:userId/:addressId', deleteAddress);

export default router;
