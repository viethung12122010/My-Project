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
const NEWS_FILE = path.join(DB_DIR, 'news.json');

function readJSON(file, defaultValue) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return defaultValue; }
}
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8'); }

let users = readJSON(USERS_FILE, []);
let exams = readJSON(EXAMS_FILE, []);
let news = readJSON(NEWS_FILE, []);

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

// News endpoints
app.get('/api/news', (req, res) => {
  const { page = 1, limit = 10, category } = req.query;
  let filteredNews = [...news];
  
  // Filter by category if provided
  if (category) {
    filteredNews = filteredNews.filter(n => n.category === category);
  }
  
  // Sort by creation date (newest first)
  filteredNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedNews = filteredNews.slice(startIndex, endIndex);
  
  res.json({
    news: paginatedNews.map(n => ({
      id: n.id,
      title: n.title,
      summary: n.summary,
      content: n.content,
      image: n.image,
      category: n.category,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
      author: n.author,
      authorId: n.authorId,
      authorAvatar: n.authorAvatar
    })),
    total: filteredNews.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredNews.length / limit)
  });
});

app.get('/api/news/:id', (req, res) => {
  const article = news.find(n => String(n.id) === String(req.params.id));
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

app.post('/api/news', auth, (req, res) => {
  const { title, summary, content, image, category } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const id = news.length ? Math.max(...news.map(n => n.id)) + 1 : 1;
  
  // Xác định xem user có phải admin không
  const isAdmin = user.email === 'lviethung6a5@gmail.com' || user.id === 1;
  const authorName = isAdmin ? 'Admin' : (user.username || user.email);
  
  const article = {
    id,
    title: title || 'Log Post',
    summary: summary || content.substring(0, 150) + (content.length > 150 ? '...' : ''),
    content,
    image: image || '',
    category: category || 'Log',
    author: authorName,
    authorId: user.id,
    authorAvatar: user.avatar || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  news.push(article);
  writeJSON(NEWS_FILE, news);
  res.status(201).json(article);
});

app.put('/api/news/:id', auth, (req, res) => {
  const { title, summary, content, image, category } = req.body;
  const articleIndex = news.findIndex(n => String(n.id) === String(req.params.id));
  
  if (articleIndex === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  const article = news[articleIndex];
  
  // Check if user is the author
  if (article.authorId !== req.user.id) {
    return res.status(403).json({ error: 'You can only edit your own articles' });
  }
  
  // Update fields
  if (title) article.title = title;
  if (summary) article.summary = summary;
  if (content) article.content = content;
  if (image !== undefined) article.image = image;
  if (category) article.category = category;
  article.updatedAt = new Date().toISOString();
  
  news[articleIndex] = article;
  writeJSON(NEWS_FILE, news);
  res.json(article);
});

app.delete('/api/news/:id', auth, (req, res) => {
  const articleIndex = news.findIndex(n => String(n.id) === String(req.params.id));
  
  if (articleIndex === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  const article = news[articleIndex];
  const user = users.find(u => u.id === req.user.id);
  const isAdmin = user && (user.email === 'lviethung6a5@gmail.com' || user.id === 1);
  
  // Check if user is the author or admin
  if (article.authorId !== req.user.id && !isAdmin) {
    return res.status(403).json({ error: 'You can only delete your own articles' });
  }
  
  news.splice(articleIndex, 1);
  writeJSON(NEWS_FILE, news);
  res.json({ message: 'Article deleted successfully' });
});

// seed sample exams if empty
if (!exams.length) {
  exams.push({ id: 1, title: 'KHTN 2009 V1', summary: 'Sample summary', image: '/asset/image/Dethi/KHTN/KHTN_2009-2010_v1.jpg' });
  exams.push({ id: 2, title: 'KHTN 2009 V2', summary: 'Sample summary', image: '/asset/image/Dethi/KHTN/KHTN_2009-2010_v2.jpg' });
  writeJSON(EXAMS_FILE, exams);
}

// seed sample log posts if empty
if (!news.length) {
  news.push({
    id: 1,
    title: 'Log Post',
    summary: 'Chào mừng đến với My Project Log! Đây là nơi mình sẽ chia sẻ những cập nhật, suy nghĩ và thông báo về dự án.',
    content: `Chào mừng đến với My Project Log! 🎉

Đây là nơi mình sẽ chia sẻ những cập nhật, suy nghĩ và thông báo về dự án. Các bạn có thể theo dõi để biết:

• Tính năng mới được thêm vào
• Cập nhật và sửa lỗi
• Chia sẻ về quá trình phát triển
• Thông báo quan trọng

Cảm ơn các bạn đã quan tâm và ủng hộ My Project! 💪`,
    image: '',
    category: 'Log',
    author: 'Admin',
    authorId: 1,
    authorAvatar: '/asset/image/Material/bg_pc.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  news.push({
    id: 2,
    title: 'Log Post',
    summary: 'Vừa hoàn thành hệ thống Log mới! Giờ đây mình có thể chia sẻ cập nhật trực tiếp với mọi người.',
    content: `Vừa hoàn thành hệ thống Log mới! 🚀

Giờ đây mình có thể chia sẻ cập nhật trực tiếp với mọi người thay vì chỉ gửi email thông báo.

Tính năng mới:
✅ Giao diện giống Facebook
✅ Chỉ admin mới đăng được
✅ Mọi người có thể xem và tương tác
✅ Responsive trên mobile

Hy vọng các bạn sẽ thích! 😊`,
    image: '',
    category: 'Log',
    author: 'Admin',
    authorId: 1,
    authorAvatar: '/asset/image/Material/bg_pc.jpg',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  });
  
  writeJSON(NEWS_FILE, news);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend listening on', PORT));
