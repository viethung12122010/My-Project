# My Project Menu

Full-stack application với React frontend và Node.js backend.

## Cấu trúc dự án

```
├── backend/          # Node.js Express server
├── front-end/        # React application với Vite
├── package.json      # Root package.json để quản lý toàn bộ dự án
└── README.md
```

## Cài đặt và chạy

### Cách 1: Chạy từ thư mục gốc (Khuyến nghị)

```bash
# Cài đặt tất cả dependencies
npm run install:all

# Chạy cả backend và frontend cùng lúc
npm run dev

# Hoặc chạy riêng lẻ
npm run dev:backend    # Backend trên port 4000
npm run dev:frontend   # Frontend trên port 5173
```

### Cách 2: Chạy từng phần riêng biệt

```bash
# Backend
cd backend
npm install
npm start              # Production
npm run dev           # Development với nodemon

# Frontend
cd front-end
npm install
npm run dev           # Development
npm run build         # Build production
npm run preview       # Preview build
```

## Ports

- **Backend**: http://localhost:4000
- **Frontend**: http://localhost:5173

## Sửa lỗi bảo mật

```bash
npm run audit:fix
```

## Tính năng

- 🔐 Authentication (Sign up/Sign in)
- 👤 User profiles với avatar upload
- 📰 News/Log system
- 📚 Exam management
- 📱 Responsive design