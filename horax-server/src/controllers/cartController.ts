import { Request, Response } from 'express';
import User from '../models/User';
import { Product } from '../models/Product';

// Get Cart
export const getCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params; // Get userId from request
    const user = await User.findById(userId).populate('cart.productId'); // Populate product details

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user.cart);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Add Item to Cart
export const addToCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params; // Get userId from request
    const { productId, quantity } = req.body; // Get productId and quantity from request body

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the product already exists in the cart
    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity; // Update quantity if exists
    } else {
      user.cart.push({ productId, quantity }); // Add new item to cart
    }

    await user.save(); // Save updated cart to the database
    return res
      .status(200)
      .json({ message: 'Item added to cart', cart: user.cart });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Remove Item from Cart
export const removeFromCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params; // Get userId from request
    const { productId } = req.body; // Get productId from request body

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the item to remove it from the cart
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save(); // Save updated cart to the database
    return res
      .status(200)
      .json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Update Item Quantity
export const updateCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params; // Get userId from request
    const { productId, quantity } = req.body; // Get productId and new quantity from request body

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (cartItem) {
      cartItem.quantity = quantity; // Update the quantity
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await user.save(); // Save updated cart to the database
    return res
      .status(200)
      .json({ message: 'Cart updated successfully', cart: user.cart });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Merge Guest Cart with User Cart
export const mergeGuestCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params;
    const { items } = req.body; // Array of { productId, quantity }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid cart data provided' });
    }

    console.log(`Merging guest cart for user ${userId}:`, items);

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For each item in the guest cart
    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity) {
        console.warn('Skipping invalid cart item:', item);
        continue;
      }

      try {
        // Validate product
        const productExists = await Product.findById(productId);
        if (!productExists) {
          console.warn(`Product not found: ${productId}`);
          continue; // Skip invalid products
        }

        // Check if product already exists in user's cart
        const existingItemIndex = user.cart.findIndex(
          (cartItem) => cartItem.productId.toString() === productId
        );

        if (existingItemIndex !== -1) {
          // Update quantity if product already in cart
          user.cart[existingItemIndex].quantity += quantity;
        } else {
          // Add new item to cart
          user.cart.push({ productId, quantity });
        }
      } catch (error) {
        console.error(`Error processing cart item ${productId}:`, error);
      }
    }

    await user.save();
    console.log(
      `Successfully merged ${items.length} item(s) into user ${userId}'s cart`
    );

    return res.status(200).json({
      message: 'Guest cart merged successfully',
      cart: user.cart,
    });
  } catch (error) {
    console.error('Error merging guest cart:', error);
    return res.status(500).json({
      message: 'Server error when merging guest cart',
      error,
    });
  }
};

// Get Cart Count
export const getCartCount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Find user document in database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate total items in cart
    const count =
      user.cart && Array.isArray(user.cart)
        ? user.cart.reduce((total, item) => total + (item.quantity || 0), 0)
        : 0;

    return res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting cart count:', error);
    return res.status(500).json({
      message: 'Server error while getting cart count',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
