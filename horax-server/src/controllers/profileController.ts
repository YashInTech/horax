import { Request, Response } from 'express';
import User from '../models/User';

// Get User Profile
export const getUserProfile = async (req: any, res: Response) => {
  try {
    const user = req.user; // User is attached by middleware
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Ensure we're sending the complete user object
    const userData = user.toObject();
    console.log('Sending user profile:', {
      id: userData._id,
      hasProfileImg: !!userData.profileImg,
    });

    res.status(200).json({ user: userData });
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update User Profile
export const updateUserProfile = async (req: any, res: Response) => {
  try {
    const user = req.user;
    const { fullName, phone, addresses, profileImgBase64 } = req.body;

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Image size validation (5MB limit)
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    if (profileImgBase64) {
      console.log('Received profile image update');
      const imageSize = Buffer.byteLength(
        profileImgBase64.split(',')[1],
        'base64'
      ); // Get actual size from Base64
      if (imageSize > MAX_IMAGE_SIZE) {
        return res.status(400).json({ message: 'Image size exceeds 5MB.' });
      }

      // Image format validation (JPEG, PNG, GIF)
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const base64Header = profileImgBase64.split(',')[0]; // Extract the Base64 header
      const mimeType = base64Header.split(';')[0].split(':')[1]; // Get the mime type from the header

      if (!validImageTypes.includes(mimeType)) {
        return res.status(400).json({
          message: 'Invalid image format. Only JPEG, PNG, or GIF are allowed.',
        });
      }

      // Store the complete base64 string including the data URI prefix
      user.profileImg = profileImgBase64;
      console.log('Updated profile image in user object');
    }

    // Update other fields
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;

    if (addresses) {
      if (addresses.length > 4) {
        return res
          .status(400)
          .json({ message: 'You can only add up to 4 addresses.' });
      }
      user.addresses = addresses;
    }

    const updatedUser = await user.save();
    console.log('Saved updated user profile:', {
      id: updatedUser._id,
      hasProfileImg: !!updatedUser.profileImg,
    });

    // Send the complete updated user object
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser.toObject(),
    });
  } catch (err) {
    const error = err as Error;
    console.error('Error updating user profile:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
