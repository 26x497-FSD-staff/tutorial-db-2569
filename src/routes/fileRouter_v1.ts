import express, { Router, type Request, type Response, type NextFunction } from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure the upload directory exists locally
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 1. Configure Multer Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique timestamped file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 2. Filter files to allow only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

// 3. Serve the "uploads" folder statically so users can view images
// GET /file/view
router.use('/view', express.static(uploadDir));

// 4. API Endpoint to handle image upload
// POST /file/upload
router.post('/upload', upload.single('image'), (req: Request, res: Response): any => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please select an image file to upload.' });
  }

  // Construct a public view URL for the client
  const imageUrl = `${req.protocol}://${req.get('host')}/file/view/${req.file.filename}`;

  res.status(201).json({
    message: 'Image uploaded successfully!',
    filename: req.file.filename,
    size: req.file.size,
    url: imageUrl
  });
});

// Global Error Handler for handling Multer/Upload issues
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ error: err.message });
});

export default router;