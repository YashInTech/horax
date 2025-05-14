import { Request, Response, NextFunction } from 'express';

// Middleware to validate Base64 image format
export const validateBase64Image = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { profileImgBase64 } = req.body;

  if (profileImgBase64) {
    // Regular expression to validate Base64 image format (e.g., data:image/png;base64,...)
    const base64Pattern = /^data:image\/([a-zA-Z]*);base64,([^\"]*)$/;
    const isBase64Valid = base64Pattern.test(profileImgBase64);

    if (!isBase64Valid) {
      return res.status(400).json({ message: 'Invalid Base64 image format' });
    }
  }

  next();
};
