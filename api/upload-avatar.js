// Vercel serverless function for avatar upload
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for Vercel
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  upload.single('avatar')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      // Create filename
      const timestamp = Date.now();
      const ext = path.extname(req.file.originalname);
      const filename = `${timestamp}${ext}`;
      
      // In serverless, we'll return base64 data URL instead of saving to filesystem
      const base64 = req.file.buffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64}`;
      
      res.status(200).json({ 
        url: dataUrl,
        filename: filename
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      res.status(500).json({ error: 'Failed to process upload' });
    }
  });
}