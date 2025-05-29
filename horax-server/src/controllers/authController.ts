import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { sendEmail, generateEmailTemplate } from '../utils/sendEmail';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '../utils/tokenUtils';

// Create Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Utility to generate OTP
const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// Utility to generate JWT tokens
const generateTokens = (user: IUser) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

// Register with Email
export const registerWithEmail = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP and expiry
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpiry,
    });

    await newUser.save();

    // Send OTP email
    const htmlContent = generateEmailTemplate(otp);
    await sendEmail({
      from: `"Horax Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email',
      html: htmlContent,
    });

    return res.status(201).json({
      success: true,
      message:
        'Registration successful! Please check your email for verification OTP.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Login with Email
export const loginWithEmail = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Email not verified',
        needsVerification: true,
        email,
      });
    }

    if (!user.password) {
      return res
        .status(400)
        .json({ message: 'Invalid login method. Try using Google login.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Send user data without sensitive info
    const userData = user.toObject();
    delete userData.password;
    delete userData.otp;
    delete userData.otpExpiry;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userData,
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Google OAuth Callback
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Debug logs
    console.log('Received Google token for verification');
    console.log(
      'Environment GOOGLE_CLIENT_ID:',
      process.env.GOOGLE_CLIENT_ID?.substring(0, 5) + '...'
    );

    try {
      // Verify the token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(400).json({ message: 'Invalid token payload' });
      }

      console.log('Google token verified, payload email:', payload.email);

      // Extract user information from token
      const { email, name, picture, sub } = payload;

      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        // Create new user with Google info
        user = new User({
          email,
          fullName: name,
          googleId: sub,
          isVerified: true,
          profileImg: picture || '',
          role: 'user', // Default role
        });

        await user.save();
        console.log('Created new user with Google auth');
      } else {
        // Update existing user with Google info if needed
        if (!user.googleId) {
          user.googleId = sub;
          user.isVerified = true;
          if (picture && !user.profileImg) {
            user.profileImg = picture;
          }
          await user.save();
          console.log('Updated existing user with Google info');
        }
      }

      // Generate JWT token
      const authToken = generateToken(user._id);

      // Remove sensitive info
      const userData = {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profileImg: user.profileImg,
        role: user.role,
        isVerified: user.isVerified,
      };

      return res.status(200).json({
        success: true,
        token: authToken,
        user: userData,
      });
    } catch (error) {
      console.error('Google token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token. Please try again.',
      });
    }
  } catch (error) {
    console.error('Server error during Google authentication:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
    });
  }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string
    ) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      token: accessToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
};
