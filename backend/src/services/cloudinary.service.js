import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { AppError } from '../utils/AppError.js';

const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `ecom/${folder}`, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });

export const uploadImage = async (file, folder = 'general') => {
  if (!isCloudinaryConfigured()) {
    throw new AppError('Cloudinary is not configured.', 503);
  }
  if (!file?.buffer) {
    throw new AppError('No file provided.', 400);
  }
  const result = await uploadBuffer(file.buffer, folder);
  return { url: result.secure_url, publicId: result.public_id };
};

export const uploadImages = async (files, folder = 'products') => {
  if (!files?.length) return [];
  return Promise.all(files.map((file) => uploadImage(file, folder)));
};

export const deleteImage = async (publicId) => {
  if (!isCloudinaryConfigured() || !publicId) return;
  await cloudinary.uploader.destroy(publicId);
};
