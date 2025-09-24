#!/usr/bin/env node

/**
 * Automatic Backup Scheduler
 * Tự động backup định kỳ cho avatar và dữ liệu user
 */

const fs = require('fs');
const path = require('path');
const { main: runBackup } = require('./backup-script.js');

// Configuration
const CONFIG_FILE = path.join(__dirname, 'backup-config.json');
const DEFAULT_CONFIG = {
    enabled: true,
    intervalHours: 24, // Backup mỗi 24 giờ
    maxBackups: 7,     // Giữ tối đa 7 backup
    lastBackup: null,
    autoStart: false   // Tự động chạy khi khởi động server
};

function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            return { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) };
        }
    } catch (error) {
        console.error('❌ Error loading config:', error.message);
    }
    return DEFAULT_CONFIG;
}

function saveConfig(config) {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('❌ Error saving config:', error.message);
        return false;
    }
}

function shouldRunBackup(config) {
    if (!config.enabled) {
        return false;
    }
    
    if (!config.lastBackup) {
        return true; // First backup
    }
    
    const lastBackupTime = new Date(config.lastBackup);
    const now = new Date();
    const hoursSinceLastBackup = (now - lastBackupTime) / (1000 * 60 * 60);
    
    return hoursSinceLastBackup >= config.intervalHours;
}

function performScheduledBackup() {
    const config = loadConfig();
    
    if (!shouldRunBackup(config)) {
        const lastBackup = config.lastBackup ? new Date(config.lastBackup).toLocaleString() : 'Never';
        console.log(`⏰ Backup not needed. Last backup: ${lastBackup}`);
        return false;
    }
    
    console.log('🔄 Starting scheduled backup...');
    
    try {
        const result = runBackup();
        
        if (result.success) {
            // Update config with last backup time
            config.lastBackup = new Date().toISOString();
            saveConfig(config);
            
            console.log('✅ Scheduled backup completed successfully!');
            console.log(`📊 Files backed up: ${result.userFiles} user files, ${result.avatarFiles} avatars`);
            
            return true;
        } else {
            console.error('❌ Scheduled backup failed!');
            return false;
        }
    } catch (error) {
        console.error('❌ Backup error:', error.message);
        return false;
    }
}

function startScheduler() {
    const config = loadConfig();
    
    console.log('🚀 Starting automatic backup scheduler...');
    console.log(`⚙️  Interval: ${config.intervalHours} hours`);
    console.log(`📁 Max backups: ${config.maxBackups}`);
    console.log(`✅ Status: ${config.enabled ? 'Enabled' : 'Disabled'}`);
    
    // Run initial backup check
    performScheduledBackup();
    
    // Set up recurring backup
    const intervalMs = config.intervalHours * 60 * 60 * 1000;
    setInterval(() => {
        const currentConfig = loadConfig(); // Reload config in case it changed
        if (currentConfig.enabled) {
            performScheduledBackup();
        }
    }, intervalMs);
    
    console.log('🔄 Backup scheduler is running...');
}

function configureBackup(options = {}) {
    const config = loadConfig();
    
    if (options.enable !== undefined) {
        config.enabled = options.enable;
    }
    
    if (options.interval !== undefined) {
        config.intervalHours = Math.max(1, parseInt(options.interval));
    }
    
    if (options.maxBackups !== undefined) {
        config.maxBackups = Math.max(1, parseInt(options.maxBackups));
    }
    
    if (options.autoStart !== undefined) {
        config.autoStart = options.autoStart;
    }
    
    if (saveConfig(config)) {
        console.log('✅ Backup configuration updated:');
        console.log(`   Enabled: ${config.enabled}`);
        console.log(`   Interval: ${config.intervalHours} hours`);
        console.log(`   Max backups: ${config.maxBackups}`);
        console.log(`   Auto start: ${config.autoStart}`);
        return true;
    }
    
    return false;
}

function getStatus() {
    const config = loadConfig();
    const lastBackup = config.lastBackup ? new Date(config.lastBackup) : null;
    const nextBackup = lastBackup ? new Date(lastBackup.getTime() + (config.intervalHours * 60 * 60 * 1000)) : new Date();
    
    console.log('📊 Backup Status:');
    console.log('================');
    console.log(`Status: ${config.enabled ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`Interval: ${config.intervalHours} hours`);
    console.log(`Max backups: ${config.maxBackups}`);
    console.log(`Last backup: ${lastBackup ? lastBackup.toLocaleString() : 'Never'}`);
    console.log(`Next backup: ${config.enabled ? nextBackup.toLocaleString() : 'Disabled'}`);
    console.log(`Auto start: ${config.autoStart ? 'Yes' : 'No'}`);
    
    return {
        enabled: config.enabled,
        intervalHours: config.intervalHours,
        maxBackups: config.maxBackups,
        lastBackup: config.lastBackup,
        nextBackup: config.enabled ? nextBackup.toISOString() : null,
        autoStart: config.autoStart
    };
}

function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'start':
            startScheduler();
            break;
            
        case 'run':
            performScheduledBackup();
            break;
            
        case 'status':
            getStatus();
            break;
            
        case 'enable':
            configureBackup({ enable: true });
            break;
            
        case 'disable':
            configureBackup({ enable: false });
            break;
            
        case 'config':
            const interval = args[1];
            const maxBackups = args[2];
            const options = {};
            
            if (interval) options.interval = interval;
            if (maxBackups) options.maxBackups = maxBackups;
            
            configureBackup(options);
            break;
            
        case 'auto-start':
            const enable = args[1] !== 'false';
            configureBackup({ autoStart: enable });
            break;
            
        default:
            console.log('🔄 Automatic Backup Tool');
            console.log('========================');
            console.log('');
            console.log('Commands:');
            console.log('  start              - Start backup scheduler');
            console.log('  run                - Run backup now');
            console.log('  status             - Show backup status');
            console.log('  enable             - Enable automatic backup');
            console.log('  disable            - Disable automatic backup');
            console.log('  config [hours] [max] - Configure interval and max backups');
            console.log('  auto-start [true/false] - Enable/disable auto-start with server');
            console.log('');
            console.log('Examples:');
            console.log('  node auto-backup.js run');
            console.log('  node auto-backup.js config 12 5  # Backup every 12 hours, keep 5 backups');
            console.log('  node auto-backup.js start');
            break;
    }
}

// Auto-start with server if configured
if (require.main !== module) {
    const config = loadConfig();
    if (config.autoStart) {
        console.log('🚀 Auto-starting backup scheduler...');
        setTimeout(startScheduler, 5000); // Delay to let server start first
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    startScheduler,
    performScheduledBackup,
    configureBackup,
    getStatus,
    loadConfig,
    saveConfig
};