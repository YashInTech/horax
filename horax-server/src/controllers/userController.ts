import { Request, Response } from 'express';
import User from '../models/User';

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email.' });
    }

    const user = new User({ fullName, email, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    const error = err as Error;
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching user by ID:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a user
export const deleteUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    // Allow self-deletion or admin-only deletion of other users
    if (currentUser.role !== 'admin' && currentUser._id.toString() !== id) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this user.' });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    const error = err as Error;
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
