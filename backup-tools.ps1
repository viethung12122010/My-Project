# PowerShell Backup Management Tool
# Công cụ quản lý backup cho Windows

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("Backup", "Restore", "Config", "Status", "Enable", "Disable", "Start", "List")]
    [string]$Action,
    
    [int]$Hours,
    [int]$MaxBackups,
    [string]$Timestamp,
    [switch]$AutoStart,
    [switch]$Help
)

# Colors for output
function Write-Success { param($Message) Write-Host $Message -ForegroundColor Green }
function Write-Error { param($Message) Write-Host $Message -ForegroundColor Red }
function Write-Warning { param($Message) Write-Host $Message -ForegroundColor Yellow }
function Write-Info { param($Message) Write-Host $Message -ForegroundColor Cyan }

function Show-Help {
    Write-Host "🔄 Backup Management Tool for Windows" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor White
    Write-Host "  .\backup-tools.ps1 -Action <action> [options]" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Actions:" -ForegroundColor White
    Write-Host "  Backup              - Tạo backup ngay lập tức" -ForegroundColor Gray
    Write-Host "  Restore             - Khôi phục từ backup mới nhất" -ForegroundColor Gray
    Write-Host "  Config              - Cấu hình backup (-Hours <h> -MaxBackups <n>)" -ForegroundColor Gray
    Write-Host "  Status              - Kiểm tra trạng thái backup" -ForegroundColor Gray
    Write-Host "  Enable              - Bật backup tự động" -ForegroundColor Gray
    Write-Host "  Disable             - Tắt backup tự động" -ForegroundColor Gray
    Write-Host "  Start               - Khởi động backup scheduler" -ForegroundColor Gray
    Write-Host "  List                - Xem danh sách backup có sẵn" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\backup-tools.ps1 -Action Backup" -ForegroundColor Yellow
    Write-Host "  .\backup-tools.ps1 -Action Config -Hours 6 -MaxBackups 10" -ForegroundColor Yellow
    Write-Host "  .\backup-tools.ps1 -Action Restore -Timestamp '2024-01-15T10-30-00'" -ForegroundColor Yellow
    Write-Host "  .\backup-tools.ps1 -Action Status" -ForegroundColor Yellow
    Write-Host ""
}

function Test-NodeJs {
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Info "✅ Node.js version: $nodeVersion"
            return $true
        }
    } catch {
        Write-Error "❌ Node.js không được tìm thấy!"
        Write-Warning "💡 Vui lòng cài đặt Node.js từ https://nodejs.org/"
        return $false
    }
    return $false
}

function Test-BackupScripts {
    $scripts = @("backup-script.js", "restore-backup.js", "auto-backup.js")
    $missing = @()
    
    foreach ($script in $scripts) {
        if (!(Test-Path $script)) {
            $missing += $script
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Error "❌ Thiếu script backup:"
        $missing | ForEach-Object { Write-Error "   - $_" }
        return $false
    }
    
    Write-Info "✅ Tất cả script backup đã sẵn sàng"
    return $true
}

function Invoke-BackupCommand {
    param([string]$Command, [string]$Description)
    
    Write-Info "🚀 $Description..."
    Write-Host ""
    
    try {
        $result = Invoke-Expression $Command
        if ($LASTEXITCODE -eq 0) {
            Write-Success "✅ Hoàn thành: $Description"
        } else {
            Write-Error "❌ Lỗi khi thực hiện: $Description"
        }
        return $result
    } catch {
        Write-Error "❌ Lỗi: $($_.Exception.Message)"
        return $null
    }
}

function Main {
    if ($Help -or $Action -eq "Help") {
        Show-Help
        return
    }
    
    Write-Host "🔄 Backup Management Tool" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check prerequisites
    if (!(Test-NodeJs)) { return }
    if (!(Test-BackupScripts)) { return }
    
    # Execute action
    switch ($Action) {
        "Backup" {
            Invoke-BackupCommand "node backup-script.js" "Tạo backup"
        }
        
        "Restore" {
            if ($Timestamp) {
                Invoke-BackupCommand "node restore-backup.js $Timestamp" "Khôi phục backup $Timestamp"
            } else {
                Invoke-BackupCommand "node restore-backup.js" "Khôi phục backup mới nhất"
            }
        }
        
        "Config" {
            if ($Hours -and $MaxBackups) {
                Invoke-BackupCommand "node auto-backup.js config $Hours $MaxBackups" "Cấu hình backup: $Hours giờ, giữ $MaxBackups backup"
            } elseif ($Hours) {
                Invoke-BackupCommand "node auto-backup.js config $Hours" "Cấu hình interval: $Hours giờ"
            } else {
                Write-Warning "⚠️  Vui lòng cung cấp -Hours và/hoặc -MaxBackups"
                Write-Info "Ví dụ: -Hours 6 -MaxBackups 10"
            }
        }
        
        "Status" {
            Invoke-BackupCommand "node auto-backup.js status" "Kiểm tra trạng thái backup"
        }
        
        "Enable" {
            Invoke-BackupCommand "node auto-backup.js enable" "Bật backup tự động"
        }
        
        "Disable" {
            Invoke-BackupCommand "node auto-backup.js disable" "Tắt backup tự động"
        }
        
        "Start" {
            Write-Info "🚀 Khởi động backup scheduler..."
            Write-Warning "⚠️  Scheduler sẽ chạy trong background. Nhấn Ctrl+C để dừng."
            Write-Host ""
            node auto-backup.js start
        }
        
        "List" {
            Invoke-BackupCommand "node restore-backup.js list" "Danh sách backup có sẵn"
        }
        
        default {
            Write-Error "❌ Action không hợp lệ: $Action"
            Show-Help
        }
    }
}

# Quick status check function
function Show-QuickStatus {
    Write-Host ""
    Write-Info "📊 Trạng thái nhanh:"
    
    # Check if backup directory exists
    if (Test-Path "backups") {
        $backupCount = (Get-ChildItem "backups" -Directory | Where-Object { $_.Name -like "*-*-*T*" }).Count
        Write-Success "   Backup directory: Có ($backupCount backup)"
    } else {
        Write-Warning "   Backup directory: Chưa có"
    }
    
    # Check config file
    if (Test-Path "backup-config.json") {
        try {
            $config = Get-Content "backup-config.json" | ConvertFrom-Json
            $status = if ($config.enabled) { "Bật" } else { "Tắt" }
            Write-Info "   Auto backup: $status (mỗi $($config.intervalHours) giờ)"
        } catch {
            Write-Warning "   Config file: Lỗi đọc file"
        }
    } else {
        Write-Warning "   Config file: Chưa có"
    }
    
    # Check database files
    $dbFiles = @("db/users.json", "backend/db/users.json")
    foreach ($file in $dbFiles) {
        if (Test-Path $file) {
            Write-Success "   $file`: Có"
        } else {
            Write-Warning "   $file`: Không có"
        }
    }
    
    Write-Host ""
}

# Add quick actions
function Show-QuickActions {
    Write-Host "🎯 Hành động nhanh:" -ForegroundColor Yellow
    Write-Host "  B - Backup ngay" -ForegroundColor Gray
    Write-Host "  R - Restore mới nhất" -ForegroundColor Gray
    Write-Host "  S - Xem status" -ForegroundColor Gray
    Write-Host "  L - List backups" -ForegroundColor Gray
    Write-Host "  Q - Thoát" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Chọn hành động (B/R/S/L/Q)"
    
    switch ($choice.ToUpper()) {
        "B" { $Action = "Backup"; Main }
        "R" { $Action = "Restore"; Main }
        "S" { $Action = "Status"; Main }
        "L" { $Action = "List"; Main }
        "Q" { Write-Info "👋 Tạm biệt!"; return }
        default { Write-Warning "⚠️  Lựa chọn không hợp lệ"; Show-QuickActions }
    }
}

# Run main function
if ($Action) {
    Main
    Show-QuickStatus
} else {
    Show-Help
    Show-QuickStatus
    Show-QuickActions
}