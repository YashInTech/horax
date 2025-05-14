import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import { sendEmail, generateEmailTemplate } from '../utils/sendEmail'; // Import the template function

// Function to generate OTP
const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
};

// OTP Verification
export const verifyOTP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otpExpiry && user.otpExpiry <= new Date()) {
      return res
        .status(400)
        .json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.otp === otp) {
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      return res
        .status(200)
        .json({ message: 'User verified successfully. You can now log in.' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    const err = error as Error; // Explicitly cast error to Error
    console.error('Error verifying OTP:', err.message);
    return res
      .status(500)
      .json({ message: 'Server error', error: err.message });
  }
};

// Resend OTP
export const resendOTP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user || user.isVerified) {
      return res
        .status(400)
        .json({ message: 'Invalid request or user already verified' });
    }

    // Generate new OTP and set an expiry (10 minutes from now)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Generate the HTML content using the template function
    const htmlContent = generateEmailTemplate(otp);

    // Send OTP via email with Big Byte Health branding
    await sendEmail({
      from: `"Nidas Pure" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Resend OTP Verification',
      html: htmlContent, // Include the HTML content
    });

    return res
      .status(200)
      .json({ message: 'OTP resent successfully. Please check your email.' });
  } catch (error) {
    const err = error as Error; // Explicitly cast error to Error
    console.error('Error resending OTP:', err.message);
    return res
      .status(500)
      .json({ message: 'Server error', error: err.message });
  }
};
