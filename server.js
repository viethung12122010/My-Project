const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Storage for uploaded avatars (serve /uploads)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Simple JSON file storage
const DB_DIR = path.join(__dirname, 'db');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
const USERS_FILE = path.join(DB_DIR, 'users.json');
const EXAMS_FILE = path.join(DB_DIR, 'exams.json');

function readJSON(file, defaultValue) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return defaultValue; }
}
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8'); }

let users = readJSON(USERS_FILE, []);
let exams = readJSON(EXAMS_FILE, []);

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
function generateToken(user) { return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' }); }

// Signup
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email/password required' });
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'email exists' });
  const hashed = bcrypt.hashSync(password, 8);
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const user = { id, username: username || '', email, password: hashed, avatar: '' };
  users.push(user); writeJSON(USERS_FILE, users);
  const safe = { id: user.id, username: user.username, email: user.email, avatar: user.avatar };
  res.status(201).json({ user: safe, token: generateToken(safe) });
});

// Signin
app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'invalid' });
  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(400).json({ error: 'invalid' });
  const safe = { id: user.id, username: user.username, email: user.email, avatar: user.avatar };
  res.json({ user: safe, token: generateToken(safe) });
});

// Auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'no token' });
  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'bad token' });
  try { const payload = jwt.verify(parts[1], JWT_SECRET); req.user = payload; next(); } catch (e) { res.status(401).json({ error: 'invalid token' }); }
}

// Upload avatar
const storage = multer.diskStorage({ destination: uploadsDir, filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)) });
const upload = multer({ storage });

app.post('/api/upload-avatar', auth, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' });
  const url = `/backend/uploads/${req.file.filename}`;
  const user = users.find(u => u.id === req.user.id);
  if (user) { user.avatar = url; writeJSON(USERS_FILE, users); }
  res.json({ url });
});

// Exams endpoints (basic)
app.get('/api/exams', (req, res) => { res.json(exams.map(e => ({ id: e.id, title: e.title, summary: e.summary, image: e.image }))); });

app.get('/api/exams/:id', (req, res) => {
  const row = exams.find(e => String(e.id) === String(req.params.id));
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json(row);
});

// seed sample exams if empty
if (!exams.length) {
  exams.push({ id: 1, title: 'KHTN 2009 V1', summary: 'Sample summary', image: '/asset/image/Dethi/KHTN/KHTN_2009-2010_v1.jpg' });
  exams.push({ id: 2, title: 'KHTN 2009 V2', summary: 'Sample summary', image: '/asset/image/Dethi/KHTN/KHTN_2009-2010_v2.jpg' });
  writeJSON(EXAMS_FILE, exams);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend listening on', PORT));
