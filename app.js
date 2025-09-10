const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, Images)
app.use('/css', express.static(path.join(__dirname, 'views/css')));
app.use('/asset', express.static(path.join(__dirname, 'views/asset')));
app.use('/js', express.static(path.join(__dirname, 'views/js')));

// Storage for uploaded avatars
// Use /tmp directory in production (Vercel) or uploads directory in development
const uploadsDir = process.env.NODE_ENV === 'production' 
    ? '/tmp/uploads' 
    : path.join(__dirname, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
    } catch (error) {
        console.warn('Could not create uploads directory:', error.message);
    }
}

app.use('/uploads', express.static(uploadsDir));

// Import routes
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');

// Use routes
app.use('/', webRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3001;

// For Vercel deployment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 MVC App running on http://localhost:${PORT}`);
        console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

// Export for Vercel
module.exports = app;