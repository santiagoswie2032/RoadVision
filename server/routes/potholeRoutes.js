import express from 'express';
import multer from 'multer';
import { reportPothole, getPotholes, updatePotholeStatus } from '../controllers/potholeController.js';
const router = express.Router();

// Configure Multer for in-memory file handling
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Update detect route to handle file uploads
router.post(
  '/detect',
  upload.single('file'),
  reportPothole
);

// Get all potholes
router.get('/', getPotholes);

// Update status (Open access since app is public)
router.patch(
  '/:id/status',
  updatePotholeStatus
);

export default router;
