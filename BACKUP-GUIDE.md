# 📦 Hướng Dẫn Sử Dụng Backup System

## 🎯 Tổng Quan

Hệ thống backup tự động giúp bảo vệ dữ liệu người dùng và avatar, tránh mất mát dữ liệu quan trọng.

### 📁 Các File Được Backup:
- **User Data**: `db/users.json`, `backend/db/users.json`
- **Avatars**: Tất cả ảnh trong thư mục `uploads/`, `backend/uploads/`, `/tmp/uploads/`

## 🚀 Cách Sử Dụng

### 1. Backup Thủ Công

```bash
# Tạo backup ngay lập tức
node backup-script.js
```

**Kết quả:**
- Tạo thư mục `backups/` chứa tất cả backup
- Backup user data vào `user-data-[timestamp]/`
- Backup avatars vào `avatars-[timestamp]/`
- Tạo file `manifest-[timestamp].json` để theo dõi

### 2. Khôi Phục Dữ Liệu

```bash
# Khôi phục từ backup mới nhất
node restore-backup.js

# Xem danh sách backup có sẵn
node restore-backup.js list

# Khôi phục từ backup cụ thể
node restore-backup.js 2024-01-15T10-30-00
```

### 3. Backup Tự Động

```bash
# Bật backup tự động
node auto-backup.js enable

# Cấu hình backup mỗi 12 giờ, giữ tối đa 5 backup
node auto-backup.js config 12 5

# Khởi động scheduler
node auto-backup.js start

# Kiểm tra trạng thái
node auto-backup.js status
```

## ⚙️ Cấu Hình Chi Tiết

### Backup Configuration

File `backup-config.json` sẽ được tạo tự động với cấu hình:

```json
{
  "enabled": true,
  "intervalHours": 24,
  "maxBackups": 7,
  "lastBackup": "2024-01-15T10:30:00.000Z",
  "autoStart": false
}
```

### Các Lệnh Quản Lý

| Lệnh | Mô Tả |
|------|-------|
| `node auto-backup.js start` | Khởi động scheduler |
| `node auto-backup.js run` | Chạy backup ngay |
| `node auto-backup.js status` | Xem trạng thái |
| `node auto-backup.js enable` | Bật backup tự động |
| `node auto-backup.js disable` | Tắt backup tự động |
| `node auto-backup.js config 6 10` | Backup mỗi 6h, giữ 10 backup |
| `node auto-backup.js auto-start true` | Tự động khởi động với server |

## 🔒 Bảo Mật & Xác Thực

### Checksum Verification
- Mỗi file backup có checksum MD5
- Tự động kiểm tra tính toàn vẹn khi restore
- File `.md5` chứa mã hash để xác thực

### Cấu Trúc Backup

```
backups/
├── user-data-2024-01-15T10-30-00/
│   ├── db_users.json
│   ├── db_users.json.md5
│   ├── backend_db_users.json
│   └── backend_db_users.json.md5
├── avatars-2024-01-15T10-30-00/
│   └── uploads/
│       ├── 1758418734405.jpg
│       └── 1758420234567.jpg
└── manifest-2024-01-15T10-30-00.json
```

## 🛠️ Tích Hợp Với Server

### Tự Động Backup Khi Khởi Động Server

Thêm vào `backend/server.js`:

```javascript
// Auto-start backup if configured
const autoBackup = require('../auto-backup.js');
```

### Backup Sau Khi Upload Avatar

Thêm vào endpoint upload avatar:

```javascript
app.post('/api/upload-avatar', auth, upload.single('avatar'), (req, res) => {
  // ... existing code ...
  
  // Optional: Trigger backup after avatar upload
  const { performScheduledBackup } = require('../auto-backup.js');
  performScheduledBackup();
});
```

## 📊 Monitoring & Logs

### Kiểm Tra Backup Log

```bash
# Xem log backup gần nhất
node auto-backup.js status

# Xem tất cả backup
node restore-backup.js list
```

### Cảnh Báo & Thông Báo

- ✅ Backup thành công: Hiển thị số file đã backup
- ❌ Backup thất bại: Hiển thị lỗi chi tiết
- ⚠️ Checksum không khớp: Cảnh báo file bị hỏng
- 🧹 Tự động xóa backup cũ: Giữ theo cấu hình `maxBackups`

## 🚨 Khắc Phục Sự Cố

### Lỗi Thường Gặp

1. **"Permission denied"**
   ```bash
   chmod +x backup-script.js
   chmod +x restore-backup.js
   chmod +x auto-backup.js
   ```

2. **"No backups found"**
   - Chạy `node backup-script.js` để tạo backup đầu tiên

3. **"Checksum mismatch"**
   - File backup bị hỏng, sử dụng backup khác
   - Chạy `node restore-backup.js list` để xem backup khả dụng

4. **"Upload directory not found"**
   - Tạo thư mục uploads: `mkdir -p backend/uploads`

### Recovery Mode

Nếu tất cả backup bị hỏng:

```bash
# Khôi phục từ git (nếu có commit backup)
git checkout HEAD~1 -- db/users.json

# Hoặc tạo lại user data từ đầu
# (Avatar sẽ mất, user cần upload lại)
```

## 📱 Sử Dụng Với PowerShell

Tôi cũng đã tạo script PowerShell để dễ sử dụng:

```powershell
# Backup ngay
.\backup-tools.ps1 -Action Backup

# Khôi phục
.\backup-tools.ps1 -Action Restore

# Cấu hình
.\backup-tools.ps1 -Action Config -Hours 6 -MaxBackups 10

# Kiểm tra trạng thái
.\backup-tools.ps1 -Action Status
```

## 🔄 Best Practices

1. **Backup thường xuyên**: Cấu hình backup mỗi 6-12 giờ
2. **Giữ nhiều backup**: Ít nhất 5-7 backup để có thể roll back
3. **Kiểm tra định kỳ**: Chạy `status` để đảm bảo backup hoạt động
4. **Test restore**: Thử restore trên môi trường test
5. **Monitor storage**: Theo dõi dung lượng thư mục `backups/`

## 🎉 Tự Động Hóa Hoàn Toàn

Để backup tự động chạy với server:

```javascript
// Thêm vào backend/server.js
const autoBackup = require('../auto-backup.js');

// Khởi động scheduler khi server start
if (process.env.NODE_ENV === 'production') {
    setTimeout(() => {
        autoBackup.startScheduler();
    }, 5000);
}
```

---

💡 **Lưu ý**: Backup system này sẽ giải quyết vấn đề avatar không đồng bộ giữa các thiết bị bằng cách đảm bảo dữ liệu luôn được sao lưu và có thể khôi phục nhanh chóng.