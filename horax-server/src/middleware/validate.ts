import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateProduct = [
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').isIn(['Tops', 'Bottoms', 'Accessories', 'Equipment'])
    .withMessage('Invalid product type'),
  // Add more validations as needed
  
  // Check for validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];