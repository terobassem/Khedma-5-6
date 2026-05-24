import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary, configureCloudinary } from '../config/cloudinary.js';

configureCloudinary();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'church_platform',
      resource_type: 'auto',
      allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'mp4', 'webm', 'mov'],
    },
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
}

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|mp4|webm|quicktime|mov/i;
  const ext = allowed.test(path.extname(file.originalname));
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('نوع الملف غير مدعوم'), false);
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

export const getFileUrl = (file, req) => {
  if (!file) return '';
  if (file.path && file.path.startsWith('http')) return file.path;
  return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
};
