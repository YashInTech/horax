import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const protect = async (req: any, res: Response, next: NextFunction) => {
  console.log('Request Headers:', req.headers); // Debug headers

  const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
  if (!token) {
    console.error(
      'Authorization Header Missing:',
      req.headers.authorization || 'None'
    );
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };
    console.log('Decoded Token:', decoded);

    const user = await User.findById(decoded.userId).select('-password'); // Use `userId` from the token
    if (!user) {
      console.error('User not found for token:', decoded.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach user to request
    console.log('Authenticated User:', user);
    next();
  } catch (err) {
    console.error(
      'Token verification failed:',
      err instanceof Error ? err.message : err
    );
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.error(
        'User object missing in request. Did you forget to apply the protect middleware?'
      );
      return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    if (roles.includes(req.user.role)) {
      console.log(
        `Access granted to user: ${req.user._id} with role: ${req.user.role}`
      );
      return next();
    } else {
      console.error(
        `Access denied for user: ${req.user._id} with role: ${req.user.role}`
      );
      return res.status(403).json({
        message: `Access denied. Requires one of the following roles: ${roles.join(
          ', '
        )}`,
      });
    }
  };
};
