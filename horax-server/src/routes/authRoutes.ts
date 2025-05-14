import express from 'express';
import {
  registerWithEmail,
  loginWithEmail,
  googleCallback,
} from '../controllers/authController';
import { verifyOTP, resendOTP } from '../controllers/otpController';
import { refreshToken } from '../controllers/refreshTokenController';
import {
  forgotPassword,
  resetPassword,
} from '../controllers/auth.passwordController';

const router = express.Router();

// Registration and Login
router.post('/register', registerWithEmail);
router.post('/login', loginWithEmail);

// OTP Verification Routes
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Refresh Token Route
router.post('/refresh-token', refreshToken);

// Google OAuth Callback
router.post('/google/callback', googleCallback);

// Endpoint to initiate password reset by sending an OTP email
router.post('/forgot-password', forgotPassword);

// Endpoint to reset the password using the OTP
router.post('/reset-password', resetPassword);

export default router;
