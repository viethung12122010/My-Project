#!/usr/bin/env node

/**
 * Quick Setup for Backup System
 * Cài đặt nhanh hệ thống backup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Cài Đặt Hệ Thống Backup');
console.log('==========================\n');

// Step 1: Check required files
function checkRequiredFiles() {
    console.log('1️⃣ Kiểm tra file cần thiết...');
    
    const requiredFiles = [
        'backup-script.js',
        'restore-backup.js',
        'auto-backup.js',
        'BACKUP-GUIDE.md'
    ];
    
    const missing = requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missing.length > 0) {
        console.log('❌ Thiếu file:');
        missing.forEach(file => console.log(`   - ${file}`));
        return false;
    }
    
    console.log('✅ Tất cả file đã sẵn sàng\n');
    return true;
}

// Step 2: Create initial directories
function createDirectories() {
    console.log('2️⃣ Tạo thư mục backup...');
    
    const dirs = [
        'backups',
        'backend/uploads'
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Tạo thư mục: ${dir}`);
        } else {
            console.log(`ℹ️  Thư mục đã có: ${dir}`);
        }
    });
    
    console.log('');
}

// Step 3: Configure backup settings
function configureBackup() {
    console.log('3️⃣ Cấu hình backup...');
    
    const defaultConfig = {
        enabled: true,
        intervalHours: 24,
        maxBackups: 7,
        lastBackup: null,
        autoStart: false
    };
    
    const configFile = 'backup-config.json';
    
    if (!fs.existsSync(configFile)) {
        fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
        console.log('✅ Tạo file cấu hình: backup-config.json');
    } else {
        console.log('ℹ️  File cấu hình đã có');
    }
    
    console.log(`   - Backup tự động: ${defaultConfig.enabled ? 'Bật' : 'Tắt'}`);
    console.log(`   - Tần suất: Mỗi ${defaultConfig.intervalHours} giờ`);
    console.log(`   - Số backup giữ lại: ${defaultConfig.maxBackups}`);
    console.log('');
}

// Step 4: Run initial backup
function runInitialBackup() {
    console.log('4️⃣ Tạo backup đầu tiên...');
    
    try {
        execSync('node backup-script.js', { stdio: 'inherit' });
        console.log('✅ Backup đầu tiên hoàn thành\n');
        return true;
    } catch (error) {
        console.log('❌ Lỗi khi tạo backup đầu tiên');
        console.log('💡 Bạn có thể chạy thủ công: npm run backup\n');
        return false;
    }
}

// Step 5: Show usage instructions
function showInstructions() {
    console.log('📋 HƯỚNG DẪN SỬ DỤNG');
    console.log('===================\n');
    
    console.log('🔧 Các lệnh npm scripts có sẵn:');
    console.log('   npm run backup          - Tạo backup ngay');
    console.log('   npm run backup:run      - Chạy backup theo lịch');
    console.log('   npm run backup:status   - Xem trạng thái');
    console.log('   npm run backup:enable   - Bật backup tự động');
    console.log('   npm run backup:disable  - Tắt backup tự động');
    console.log('   npm run restore         - Khôi phục dữ liệu');
    console.log('   npm run restore:list    - Xem danh sách backup\n');
    
    console.log('🎯 PowerShell (Windows):');
    console.log('   .\\backup-tools.ps1 -Action Backup');
    console.log('   .\\backup-tools.ps1 -Action Status');
    console.log('   .\\backup-tools.ps1 -Action Config -Hours 12 -MaxBackups 5\n');
    
    console.log('📚 Đọc thêm: BACKUP-GUIDE.md\n');
}

// Step 6: Test backup system
function testBackupSystem() {
    console.log('5️⃣ Kiểm tra hệ thống...');
    
    try {
        // Test status command
        execSync('node auto-backup.js status', { stdio: 'pipe' });
        console.log('✅ Auto-backup script hoạt động');
        
        // Check if backup directory has content
        const backupDir = 'backups';
        if (fs.existsSync(backupDir)) {
            const items = fs.readdirSync(backupDir);
            if (items.length > 0) {
                console.log(`✅ Backup directory có ${items.length} file/thư mục`);
            }
        }
        
        console.log('✅ Hệ thống backup sẵn sàng\n');
        return true;
    } catch (error) {
        console.log('⚠️  Có một số lỗi nhỏ, nhưng hệ thống vẫn có thể hoạt động\n');
        return false;
    }
}

// Main setup function
function main() {
    console.log('Bắt đầu cài đặt hệ thống backup cho avatar và user data...\n');
    
    let success = true;
    
    // Run setup steps
    success &= checkRequiredFiles();
    createDirectories();
    configureBackup();
    
    const backupSuccess = runInitialBackup();
    testBackupSystem();
    
    showInstructions();
    
    // Final summary
    console.log('🎉 HOÀN THÀNH CÀI ĐẶT');
    console.log('=====================\n');
    
    if (success && backupSuccess) {
        console.log('✅ Hệ thống backup đã được cài đặt thành công!');
        console.log('🔒 Dữ liệu user và avatar của bạn giờ đã được bảo vệ.');
        console.log('⚡ Chạy `npm run backup:status` để xem trạng thái hiện tại.');
    } else {
        console.log('⚠️  Cài đặt hoàn thành với một số cảnh báo.');
        console.log('📖 Xem BACKUP-GUIDE.md để biết thêm chi tiết.');
    }
    
    console.log('\n💡 Gợi ý: Bật backup tự động bằng `npm run backup:enable`');
    console.log('🔄 Để chạy backup ngay: `npm run backup`\n');
}

// Run setup
if (require.main === module) {
    main();
}

module.exports = { main };