import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

// Upload a single image to Cloudinary
export const uploadImages = async (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    // Add a timeout to prevent hanging requests
    const uploadTimeout = setTimeout(() => {
      reject(new Error('Upload timeout'));
    }, 30000); // 30 seconds timeout

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'horax/products' },
      (error, result) => {
        clearTimeout(uploadTimeout);
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Create a stream from buffer and pipe to cloudinary
    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

// Delete an image from Cloudinary
export const deleteImage = async (publicId: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

// Upload a base64 image (for profile pictures)
export const uploadBase64Image = async (
  base64String: string,
  folder: string = 'horax/profiles'
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(base64String, { folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
