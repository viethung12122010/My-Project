// Vercel entry point - delegates to backend/server.js
const path = require('path');

// Set environment variable to indicate we're running on Vercel
process.env.VERCEL = 'true';

// Load and export the Express app
const app = require('./backend/server.js');

module.exports = app;