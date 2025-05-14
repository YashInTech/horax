import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string);
    const user = await User.findById((decoded as any)._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '6h' }
    );
    return res.json({ token: newAccessToken });
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Invalid or expired refresh token' });
  }
};
