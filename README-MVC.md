# My Project - MVC Application

## 🎉 Ứng dụng đã được gộp thành công theo mô hình MVC!

### Cấu trúc MVC:

```
├── app.js                 # Main application file
├── package.json          # Dependencies
├── models/               # Data models
│   ├── User.js          # User model
│   ├── News.js          # News model
│   └── Exam.js          # Exam model
├── controllers/          # Business logic
│   ├── AuthController.js    # Authentication
│   ├── NewsController.js    # News management
│   ├── ExamController.js    # Exam management
│   └── WebController.js     # Web pages
├── routes/              # URL routing
│   ├── web.js          # Web routes
│   └── api.js          # API routes
├── views/               # Frontend files (không thay đổi giao diện)
│   ├── *.html          # Tất cả trang HTML
│   ├── css/            # CSS files
│   ├── js/             # JavaScript files
│   └── asset/          # Images, videos
├── db/                  # JSON database
└── uploads/             # User uploads
```

### Chạy ứng dụng:

```bash
# Cài đặt dependencies
npm install

# Chạy production
npm start

# Chạy development (với nodemon)
npm run dev
```

### Truy cập:

- **Ứng dụng**: http://localhost:3000
- **API**: http://localhost:3000/api/*

### Các trang web:

- `/` hoặc `/home` - Trang chủ
- `/signin` - Đăng nhập  
- `/signup` - Đăng ký
- `/profile` - Hồ sơ cá nhân
- `/log` - Trang tin tức/log
- `/sohoc` - Số học
- `/pt` - Phương trình
- `/dethi` - Đề thi

### API Endpoints:

**Authentication:**
- `POST /api/signup` - Đăng ký
- `POST /api/signin` - Đăng nhập
- `POST /api/upload-avatar` - Upload avatar

**News:**
- `GET /api/news` - Lấy danh sách tin tức
- `GET /api/news/:id` - Lấy tin tức theo ID
- `POST /api/news` - Tạo tin tức mới (cần auth)
- `PUT /api/news/:id` - Cập nhật tin tức (cần auth)
- `DELETE /api/news/:id` - Xóa tin tức (cần auth)

**Exams:**
- `GET /api/exams` - Lấy danh sách đề thi
- `GET /api/exams/:id` - Lấy đề thi theo ID

### Tính năng:

✅ **Gộp thành công backend + frontend**
✅ **Mô hình MVC chuẩn**
✅ **Không thay đổi giao diện**
✅ **Tất cả chức năng hoạt động**
✅ **API RESTful**
✅ **Authentication với JWT**
✅ **File upload**
✅ **JSON database**

### So sánh với cấu trúc cũ:

**Trước (2 ứng dụng riêng biệt):**
- Backend: port 4000
- Frontend: port 5173
- Cần chạy 2 servers

**Sau (1 ứng dụng MVC):**
- Tất cả trong 1 app: port 3000
- Chỉ cần chạy 1 server
- Cấu trúc MVC rõ ràng