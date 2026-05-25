import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { ROLES } from '../constants/index.js';
import { uploadSingle, uploadMultiple, handleMulterError } from '../middleware/upload.js';
import { uploadImage, uploadImages } from '../services/cloudinary.service.js';

const router = Router();

router.use(protect, authorize(ROLES.ADMIN, ROLES.VENDOR));

router.post(
  '/image',
  uploadSingle,
  handleMulterError,
  asyncHandler(async (req, res) => {
    const folder = req.body.folder || 'general';
    const result = await uploadImage(req.file, folder);
    sendSuccess(res, { message: 'Image uploaded', data: result });
  })
);

router.post(
  '/images',
  uploadMultiple,
  handleMulterError,
  asyncHandler(async (req, res) => {
    const folder = req.body.folder || 'products';
    const results = await uploadImages(req.files, folder);
    sendSuccess(res, { message: 'Images uploaded', data: results });
  })
);

export default router;
