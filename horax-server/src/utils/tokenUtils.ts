import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateToken = (userId: Types.ObjectId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '7d', // Token expires in 7 days
    }
  );
};

export const generateRefreshToken = (userId: Types.ObjectId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET as string),
    {
      expiresIn: '30d', // Refresh token expires in 30 days
    }
  );
};

export const generateTokens = (user: any) => {
  return {
    accessToken: generateToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  };
};
