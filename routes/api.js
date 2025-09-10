const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const NewsController = require('../controllers/NewsController');
const ExamController = require('../controllers/ExamController');
const User = require('../models/User');

const authController = new AuthController();
const newsController = new NewsController();
const examController = new ExamController();
const userModel = new User();

// Multer setup for file uploads
// Use /tmp directory in production (Vercel) or uploads directory in development
const uploadsDir = process.env.NODE_ENV === 'production' 
    ? '/tmp/uploads' 
    : path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Auth routes
router.post('/signup', (req, res) => authController.signup(req, res));
router.post('/signin', (req, res) => authController.signin(req, res));

// Get current user profile
router.get('/profile', 
    (req, res, next) => authController.authenticate(req, res, next),
    (req, res) => {
        const user = userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }
        
        const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
        };
        
        res.json({ user: safeUser });
    }
);

// Upload avatar
router.post('/upload-avatar', 
    (req, res, next) => authController.authenticate(req, res, next),
    upload.single('avatar'), 
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'Không có file' });
        }
        
        const url = `/uploads/${req.file.filename}`;
        const user = userModel.findById(req.user.id);
        if (user) {
            userModel.update(req.user.id, { avatar: url });
        }
        res.json({ url });
    }
);

// News routes
router.get('/news', (req, res) => newsController.getAll(req, res));
router.get('/news/:id', (req, res) => newsController.getById(req, res));
router.post('/news', 
    (req, res, next) => authController.authenticate(req, res, next),
    (req, res) => newsController.create(req, res)
);
router.put('/news/:id', 
    (req, res, next) => authController.authenticate(req, res, next),
    (req, res) => newsController.update(req, res)
);
router.delete('/news/:id', 
    (req, res, next) => authController.authenticate(req, res, next),
    (req, res) => newsController.delete(req, res)
);

// Exam routes
router.get('/exams', (req, res) => examController.getAll(req, res));
router.get('/exams/:id', (req, res) => examController.getById(req, res));

module.exports = router;