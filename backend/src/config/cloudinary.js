import { v2 as cloudinary } from 'cloudinary';
import { config } from './index.js';

const { cloudName, apiKey, apiSecret } = config.cloudinary;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export const isCloudinaryConfigured = () =>
  Boolean(cloudName && apiKey && apiSecret);

export default cloudinary;
