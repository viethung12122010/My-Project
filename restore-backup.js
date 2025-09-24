#!/usr/bin/env node

/**
 * Restore Script for Avatar and User Data
 * Khôi phục avatar và dữ liệu người dùng từ backup
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const BACKUP_DIR = path.join(__dirname, 'backups');

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
        const dir = path.dirname(dest);
        ensureDir(dir);
        fs.copyFileSync(src, dest);
        return true;
    } catch (error) {
        console.error(`❌ Error copying ${src} to ${dest}:`, error.message);
        return false;
    }
}

function verifyChecksum(filePath) {
    const checksumPath = `${filePath}.md5`;
    if (!fs.existsSync(checksumPath)) {
        console.log(`⚠️  No checksum file found for: ${path.basename(filePath)}`);
        return true; // Skip verification if no checksum
    }
    
    try {
        const expectedHash = fs.readFileSync(checksumPath, 'utf8').trim();
        const actualData = fs.readFileSync(filePath, 'utf8');
        const actualHash = createHash(actualData);
        
        if (expectedHash === actualHash) {
            console.log(`✅ Checksum verified: ${path.basename(filePath)}`);
            return true;
        } else {
            console.error(`❌ Checksum mismatch: ${path.basename(filePath)}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error verifying checksum: ${error.message}`);
        return false;
    }
}

function listAvailableBackups() {
    if (!fs.existsSync(BACKUP_DIR)) {
        console.log('❌ No backup directory found!');
        return [];
    }
    
    const manifests = fs.readdirSync(BACKUP_DIR)
        .filter(file => file.startsWith('manifest-') && file.endsWith('.json'))
        .sort()
        .reverse();
    
    const backups = manifests.map(manifest => {
        try {
            const manifestPath = path.join(BACKUP_DIR, manifest);
            const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            return {
                manifest: manifest,
                timestamp: data.timestamp,
                created: data.created,
                userFiles: data.userDataBackup.filesCount,
                avatarFiles: data.avatarBackup.filesCount,
                data: data
            };
        } catch (error) {
            console.error(`❌ Error reading manifest ${manifest}:`, error.message);
            return null;
        }
    }).filter(Boolean);
    
    return backups;
}

function restoreUserData(manifest) {
    console.log('\n📊 Restoring user data...');
    
    const userBackupDir = path.join(BACKUP_DIR, manifest.userDataBackup.directory);
    
    if (!fs.existsSync(userBackupDir)) {
        console.error(`❌ User data backup directory not found: ${userBackupDir}`);
        return false;
    }
    
    const files = fs.readdirSync(userBackupDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    let restoredCount = 0;
    
    jsonFiles.forEach(file => {
        const backupPath = path.join(userBackupDir, file);
        
        // Verify checksum first
        if (!verifyChecksum(backupPath)) {
            console.error(`❌ Skipping corrupted file: ${file}`);
            return;
        }
        
        // Determine restore path
        let restorePath;
        if (file.startsWith('db_')) {
            restorePath = path.join(__dirname, 'db', file.replace('db_', ''));
        } else if (file.startsWith('backend_db_')) {
            restorePath = path.join(__dirname, 'backend', 'db', file.replace('backend_db_', ''));
        } else {
            console.log(`⚠️  Unknown file pattern: ${file}`);
            return;
        }
        
        if (copyFile(backupPath, restorePath)) {
            console.log(`✅ Restored: ${file} → ${restorePath}`);
            restoredCount++;
        }
    });
    
    return restoredCount > 0;
}

function restoreAvatars(manifest) {
    console.log('\n🖼️  Restoring avatars...');
    
    const avatarBackupDir = path.join(BACKUP_DIR, manifest.avatarBackup.directory);
    
    if (!fs.existsSync(avatarBackupDir)) {
        console.error(`❌ Avatar backup directory not found: ${avatarBackupDir}`);
        return false;
    }
    
    const subdirs = fs.readdirSync(avatarBackupDir);
    let totalRestored = 0;
    
    subdirs.forEach(subdir => {
        const sourcePath = path.join(avatarBackupDir, subdir);
        
        if (!fs.statSync(sourcePath).isDirectory()) {
            return;
        }
        
        // Determine restore path
        let restoreBasePath;
        if (subdir === 'uploads') {
            restoreBasePath = path.join(__dirname, 'backend', 'uploads');
        } else {
            restoreBasePath = path.join(__dirname, subdir);
        }
        
        ensureDir(restoreBasePath);
        
        const files = fs.readdirSync(sourcePath);
        const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );
        
        imageFiles.forEach(file => {
            const srcPath = path.join(sourcePath, file);
            const destPath = path.join(restoreBasePath, file);
            
            if (copyFile(srcPath, destPath)) {
                totalRestored++;
            }
        });
        
        if (imageFiles.length > 0) {
            console.log(`✅ Restored ${imageFiles.length} avatars to: ${restoreBasePath}`);
        }
    });
    
    return totalRestored > 0;
}

function interactiveRestore() {
    console.log('🔍 Searching for available backups...\n');
    
    const backups = listAvailableBackups();
    
    if (backups.length === 0) {
        console.log('❌ No backups found!');
        console.log('💡 Run backup-script.js first to create a backup.');
        return;
    }
    
    console.log('📋 Available backups:\n');
    backups.forEach((backup, index) => {
        console.log(`${index + 1}. ${backup.timestamp}`);
        console.log(`   Created: ${new Date(backup.created).toLocaleString()}`);
        console.log(`   User files: ${backup.userFiles}, Avatar files: ${backup.avatarFiles}`);
        console.log('');
    });
    
    // For automation, use the latest backup
    const selectedBackup = backups[0];
    console.log(`🚀 Restoring from latest backup: ${selectedBackup.timestamp}\n`);
    
    const userDataSuccess = restoreUserData(selectedBackup.data);
    const avatarsSuccess = restoreAvatars(selectedBackup.data);
    
    console.log('\n=====================================');
    if (userDataSuccess || avatarsSuccess) {
        console.log('✅ Restore completed successfully!');
        console.log(`📊 User data: ${userDataSuccess ? 'Restored' : 'Skipped/Failed'}`);
        console.log(`🖼️  Avatars: ${avatarsSuccess ? 'Restored' : 'Skipped/Failed'}`);
    } else {
        console.log('❌ Restore failed!');
    }
    console.log('=====================================');
    
    return {
        success: userDataSuccess || avatarsSuccess,
        timestamp: selectedBackup.timestamp,
        userDataRestored: userDataSuccess,
        avatarsRestored: avatarsSuccess
    };
}

function specificRestore(timestamp) {
    console.log(`🔍 Looking for backup with timestamp: ${timestamp}\n`);
    
    const backups = listAvailableBackups();
    const selectedBackup = backups.find(b => b.timestamp === timestamp);
    
    if (!selectedBackup) {
        console.log(`❌ Backup not found: ${timestamp}`);
        console.log('\n📋 Available backups:');
        backups.forEach(backup => {
            console.log(`   - ${backup.timestamp} (${new Date(backup.created).toLocaleString()})`);
        });
        return;
    }
    
    console.log(`🚀 Restoring backup: ${selectedBackup.timestamp}\n`);
    
    const userDataSuccess = restoreUserData(selectedBackup.data);
    const avatarsSuccess = restoreAvatars(selectedBackup.data);
    
    console.log('\n=====================================');
    if (userDataSuccess || avatarsSuccess) {
        console.log('✅ Restore completed successfully!');
        console.log(`📊 User data: ${userDataSuccess ? 'Restored' : 'Skipped/Failed'}`);
        console.log(`🖼️  Avatars: ${avatarsSuccess ? 'Restored' : 'Skipped/Failed'}`);
    } else {
        console.log('❌ Restore failed!');
    }
    console.log('=====================================');
    
    return {
        success: userDataSuccess || avatarsSuccess,
        timestamp: selectedBackup.timestamp,
        userDataRestored: userDataSuccess,
        avatarsRestored: avatarsSuccess
    };
}

function main() {
    console.log('🔄 User Data & Avatar Restore Tool');
    console.log('=====================================');
    
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // Interactive mode - restore latest backup
        return interactiveRestore();
    } else if (args[0] === 'list') {
        // List available backups
        const backups = listAvailableBackups();
        if (backups.length === 0) {
            console.log('❌ No backups found!');
        } else {
            console.log('📋 Available backups:\n');
            backups.forEach(backup => {
                console.log(`${backup.timestamp} - ${new Date(backup.created).toLocaleString()}`);
                console.log(`  User files: ${backup.userFiles}, Avatar files: ${backup.avatarFiles}\n`);
            });
        }
        return;
    } else {
        // Restore specific backup
        return specificRestore(args[0]);
    }
}

// Auto-run if called directly
if (require.main === module) {
    try {
        main();
    } catch (error) {
        console.error('❌ Restore failed:', error.message);
        process.exit(1);
    }
}

module.exports = { main, listAvailableBackups, specificRestore };