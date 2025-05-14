import { Request, Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import { sendOrderConfirmation, notifyAdmin } from './emailService';

// Define interfaces for better type safety
interface CartItem {
  productId: {
    _id: string;
    productName: string;
    price: number;
  };
  quantity: number;
}

interface Address {
  _id?: string;
  deliveryName: string;
  deliveryNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
}

interface UserWithCart extends Document {
  _id: string;
  email: string;
  cart: CartItem[];
  addresses: Address[];
  save(): Promise<UserWithCart>;
}

// Create Order and Send Email Notifications
export const createOrder = async (req: Request, res: Response) => {
  const userId = (req.user as any)?._id;
  const { addressId } = req.body;

  try {
    // Fetch user and populate cart
    const user = await User.findById(userId).populate(
      'cart.productId',
      'productName price'
    ) as UserWithCart | null;

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Find selected address
    const selectedAddress = user.addresses.find(
      (addr) => addr._id?.toString() === addressId
    );
    if (!selectedAddress)
      return res.status(400).json({ message: 'Invalid address ID' });

    // Create order items list
    const items = user.cart.map((item) => ({
      productId: item.productId._id,
      name: item.productId.productName,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create new order
    const newOrder = await Order.create({
      user: userId,
      items,
      totalAmount,
      address: {
        deliveryName: selectedAddress.deliveryName,
        deliveryNumber: selectedAddress.deliveryNumber,
        streetAddress: selectedAddress.streetAddress,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip: selectedAddress.zip,
      },
    });

    // Clear user's cart after order placement
    user.cart = [];
    await user.save();

    // 🔹 Send Emails (Directly Using newOrder)
    sendOrderConfirmation(user.email, newOrder).catch((error) => {
      console.error('❌ Error sending order confirmation email:', error);
    });

    notifyAdmin(newOrder).catch((error) => {
      console.error('❌ Error sending admin notification email:', error);
    });

    return res
      .status(201)
      .json({ message: 'Order created successfully', order: newOrder });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Error creating order:', error.message);
      return res
        .status(500)
        .json({ message: 'Server error', error: error.message });
    }
    console.error('❌ Unknown error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

// Fetch Orders Based on User ID (Updated)
export const getOrdersByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params; // Get the userId from request parameters

  try {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: 'No orders found for this user.' });
    }
    return res.status(200).json({ orders });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching orders:', error.message);
      return res
        .status(500)
        .json({ message: 'Server error', error: error.message });
    }
    console.error('Unknown error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

// Fetch Order Details by Order ID
export const getOrderById = async (req: Request, res: Response) => {
  const { orderId } = req.params; // Get the orderId from request parameters

  try {
    const order = await Order.findById(orderId).populate(
      'items.productId',
      'productName price image'
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json({ order });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching order:', error.message);
      return res
        .status(500)
        .json({ message: 'Server error', error: error.message });
    }
    console.error('Unknown error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};



// Fetch All Orders with Pagination
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    // Parse query parameters for pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Optional status filter
    const statusFilter = req.query.status ? { status: req.query.status } : {};

    // Find orders with pagination
    const orders = await Order.find(statusFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'email name'); // Optionally populate user details

    // Get total count for pagination info
    const totalOrders = await Order.countDocuments(statusFilter);

    return res.status(200).json({
      orders,
      pagination: {
        total: totalOrders,
        page,
        pages: Math.ceil(totalOrders / limit),
        limit
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Error fetching all orders:', error.message);
      return res
        .status(500)
        .json({ message: 'Server error', error: error.message });
    }
    console.error('❌ Unknown error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};



// Update Order Status
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Validate status input
  const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the order status
    order.status = status;
    await order.save();

    // Optional: Send email notification to customer about status update
    // if (status === 'shipped' || status === 'delivered') {
    //   const user = await User.findById(order.user);
    //   if (user && user.email) {
    //     sendOrderStatusUpdate(user.email, order, status).catch((error) => {
    //       console.error('Error sending status update email:', error);
    //     });
    //   }
    // }

    return res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating order status:', error.message);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
    console.error('Unknown error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};
