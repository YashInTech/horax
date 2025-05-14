import { Request, Response } from "express";
import User from "../models/User"; // Adjust the path as needed
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS2,
  },
});

/**
 * Controller to handle forgot password request.
 */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log("Forgot Password Request Received for Email:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("User not found with email:", email);
      return res.status(200).json({ message: "If that email exists, an OTP has been sent." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpiry = otpExpiry;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. This OTP is valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({ message: "Error sending OTP email" });
      } else {
        console.log("OTP email sent successfully:", info.response);
        return res.status(200).json({ message: "OTP has been sent to your email." });
      }
    });
  } catch (error) {
    console.error("Error in forgotPassword controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Controller to handle password reset.
 */
export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  console.log("Reset Password Request Received:", req.body);

  if (!email || !otp || !newPassword) {
    console.error("Missing fields:", { email, otp, newPassword });
    return res.status(400).json({ message: "Email, OTP, and new password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("User not found:", email);
      return res.status(400).json({ message: "Invalid email or OTP." });
    }

    console.log("User found:", user.email);

    if (user.resetOtp !== otp || !user.resetOtpExpiry || user.resetOtpExpiry < new Date()) {
      console.error("OTP mismatch or expired", {
        receivedOtp: otp,
        storedOtp: user.resetOtp,
        otpExpiry: user.resetOtpExpiry,
      });
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    console.log("Password updated successfully for:", user.email);
    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error in resetPassword controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
