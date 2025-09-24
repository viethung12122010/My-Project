#!/usr/bin/env node

/**
 * Backup Script for Avatar and User Data
 * Tạo backup cho avatar và dữ liệu người dùng
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const BACKUP_DIR = path.join(__dirname, 'backups');
const USER_DATA_FILES = [
    'db/users.json',
    'backend/db/users.json'
];
const UPLOAD_DIRS = [
    'backend/uploads',
    path.join(__dirname, 'uploads'),
    '/tmp/uploads' // For production
];

// Utility functions
function createTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function createHash(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created directory: ${dirPath}`);
    }
}

function copyFile(src, dest) {
    try {
        if (fs.existsSync(src)) {
            const dir = path.dirname(dest);
            ensureDir(dir);
            fs.copyFileSync(src, dest);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`❌ Error copying ${src} to ${dest}:`, error.message);
        return false;
    }
}

function backupUserData(timestamp) {
    console.log('\n📊 Backing up user data...');
    
    const userBackupDir = path.join(BACKUP_DIR, `user-data-${timestamp}`);
    ensureDir(userBackupDir);
    
    let backupCount = 0;
    
    USER_DATA_FILES.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            const fileName = path.basename(filePath);
            const sourceName = path.dirname(filePath).replace(/[\/\\]/g, '_');
            const backupFileName = `${sourceName}_${fileName}`;
            const backupPath = path.join(userBackupDir, backupFileName);
            
            if (copyFile(filePath, backupPath)) {
                console.log(`✅ Backed up: ${filePath} → ${backupFileName}`);
                backupCount++;
                
                // Create checksum
                const data = fs.readFileSync(filePath, 'utf8');
                const hash = createHash(data);
                fs.writeFileSync(`${backupPath}.md5`, hash);
            }
        } else {
            console.log(`⚠️  File not found: ${filePath}`);
        }
    });
    
    return { dir: userBackupDir, count: backupCount };
}

function backupAvatars(timestamp) {
    console.log('\n🖼️  Backing up avatars...');
    
    const avatarBackupDir = path.join(BACKUP_DIR, `avatars-${timestamp}`);
    ensureDir(avatarBackupDir);
    
    let totalFiles = 0;
    
    UPLOAD_DIRS.forEach(uploadDir => {
        if (fs.existsSync(uploadDir)) {
            const files = fs.readdirSync(uploadDir);
            const imageFiles = files.filter(file => 
                /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
            );
            
            if (imageFiles.length > 0) {
                const sourceName = path.basename(uploadDir);
                const sourceBackupDir = path.join(avatarBackupDir, sourceName);
                ensureDir(sourceBackupDir);
                
                imageFiles.forEach(file => {
                    const srcPath = path.join(uploadDir, file);
                    const destPath = path.join(sourceBackupDir, file);
                    
                    if (copyFile(srcPath, destPath)) {
                        totalFiles++;
                    }
                });
                
                console.log(`✅ Backed up ${imageFiles.length} files from: ${uploadDir}`);
            }
        } else {
            console.log(`⚠️  Upload directory not found: ${uploadDir}`);
        }
    });
    
    return { dir: avatarBackupDir, count: totalFiles };
}

function createManifest(timestamp, userBackup, avatarBackup) {
    const manifest = {
        timestamp: timestamp,
        created: new Date().toISOString(),
        userDataBackup: {
            directory: path.basename(userBackup.dir),
            filesCount: userBackup.count,
            files: USER_DATA_FILES.filter(f => fs.existsSync(f))
        },
        avatarBackup: {
            directory: path.basename(avatarBackup.dir),
            filesCount: avatarBackup.count,
            sources: UPLOAD_DIRS.filter(d => fs.existsSync(d))
        },
        instructions: {
            restore: "Use restore-backup.js script to restore from this backup",
            verify: "Check .md5 files to verify data integrity"
        }
    };
    
    const manifestPath = path.join(BACKUP_DIR, `manifest-${timestamp}.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    return manifestPath;
}

function cleanOldBackups(keepCount = 5) {
    console.log('\n🧹 Cleaning old backups...');
    
    try {
        const items = fs.readdirSync(BACKUP_DIR);
        const backupDirs = items.filter(item => {
            const fullPath = path.join(BACKUP_DIR, item);
            return fs.statSync(fullPath).isDirectory() && 
                   (item.startsWith('user-data-') || item.startsWith('avatars-'));
        });
        
        // Group by type and sort by timestamp
        const userDataBackups = backupDirs
            .filter(dir => dir.startsWith('user-data-'))
            .sort()
            .reverse();
        
        const avatarBackups = backupDirs
            .filter(dir => dir.startsWith('avatars-'))
            .sort()
            .reverse();
        
        // Remove old backups
        const removeOldBackups = (backups, type) => {
            if (backups.length > keepCount) {
                const toRemove = backups.slice(keepCount);
                toRemove.forEach(backup => {
                    const backupPath = path.join(BACKUP_DIR, backup);
                    fs.rmSync(backupPath, { recursive: true, force: true });
                    console.log(`🗑️  Removed old ${type} backup: ${backup}`);
                });
            }
        };
        
        removeOldBackups(userDataBackups, 'user-data');
        removeOldBackups(avatarBackups, 'avatar');
        
        // Clean old manifests
        const manifests = items.filter(item => item.startsWith('manifest-') && item.endsWith('.json'));
        if (manifests.length > keepCount) {
            const oldManifests = manifests.sort().reverse().slice(keepCount);
            oldManifests.forEach(manifest => {
                fs.unlinkSync(path.join(BACKUP_DIR, manifest));
                console.log(`🗑️  Removed old manifest: ${manifest}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error cleaning old backups:', error.message);
    }
}

function main() {
    console.log('🚀 Starting backup process...');
    console.log('=====================================');
    
    const timestamp = createTimestamp();
    
    // Ensure backup directory exists
    ensureDir(BACKUP_DIR);
    
    // Perform backups
    const userBackup = backupUserData(timestamp);
    const avatarBackup = backupAvatars(timestamp);
    
    // Create manifest
    const manifestPath = createManifest(timestamp, userBackup, avatarBackup);
    console.log(`\n📋 Created manifest: ${path.basename(manifestPath)}`);
    
    // Clean old backups
    cleanOldBackups(5);
    
    // Summary
    console.log('\n=====================================');
    console.log('✅ Backup completed successfully!');
    console.log(`📁 Backup location: ${BACKUP_DIR}`);
    console.log(`📊 User data files: ${userBackup.count}`);
    console.log(`🖼️  Avatar files: ${avatarBackup.count}`);
    console.log(`⏰ Timestamp: ${timestamp}`);
    console.log('=====================================');
    
    return {
        success: true,
        timestamp,
        userFiles: userBackup.count,
        avatarFiles: avatarBackup.count,
        manifestPath
    };
}

// Auto-run if called directly
if (require.main === module) {
    try {
        main();
    } catch (error) {
        console.error('❌ Backup failed:', error.message);
        process.exit(1);
    }
}

module.exports = { main };