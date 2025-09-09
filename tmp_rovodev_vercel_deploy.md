# 🚀 DEPLOY LÊN VERCEL - HƯỚNG DẪN CHI TIẾT

## Bước 1: Chuẩn bị Git Repository

Kiểm tra git status và commit changes:

```bash
git add .
git commit -m "Production ready - optimized for deployment"
git push origin main
```

## Bước 2: Truy cập Vercel

1. Mở trình duyệt → https://vercel.com
2. Click "Sign Up" hoặc "Login"
3. Chọn "Continue with GitHub"
4. Authorize Vercel access to GitHub

## Bước 3: Import Project

1. Click "New Project" 
2. Import Git Repository
3. Tìm và chọn repository "Menu" (hoặc tên repo của bạn)
4. Click "Import"

## Bước 4: Configure Project

### Framework Preset: 
- Chọn "Other" (vì đây là Node.js app)

### Build Settings:
- Build Command: `npm install`
- Output Directory: `.` (để trống)
- Install Command: `npm install`

### Root Directory:
- Để mặc định (.)

## Bước 5: Environment Variables (QUAN TRỌNG!)

Click "Environment Variables" và thêm:

**Variable Name:** `JWT_SECRET`
**Value:** `MyProject2024_SuperSecretKey_ChangeMeInRealProduction_8f9a2b3c4d5e6f7g8h9i0j`

**Variable Name:** `NODE_ENV`  
**Value:** `production`

## Bước 6: Deploy!

1. Click "Deploy"
2. Chờ 2-3 phút để Vercel build
3. Nhận URL public (vd: your-project-abc123.vercel.app)

## Bước 7: Test Website

Kiểm tra các tính năng:
- ✅ Trang chủ load được
- ✅ Đăng ký/đăng nhập hoạt động  
- ✅ Upload avatar
- ✅ Xem đề thi, số học
- ✅ News/Log system

## 🎉 HOÀN THÀNH!

Website của bạn giờ đã LIVE và có thể chia sẻ với mọi người!