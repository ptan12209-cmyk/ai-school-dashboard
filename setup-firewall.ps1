# Setup Windows Firewall for AI School Dashboard
# ===============================================
# Run this script with Administrator privileges
# Right-click PowerShell → Run as Administrator

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   AI School Dashboard - Firewall Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host "✅ Running with Administrator privileges" -ForegroundColor Green
Write-Host ""

# Function to add firewall rule
function Add-FirewallRule {
    param (
        [string]$Name,
        [int]$Port,
        [string]$Protocol = "TCP"
    )

    Write-Host "Adding firewall rule for $Name (Port $Port)..." -ForegroundColor Yellow

    # Remove existing rule if exists
    $existingRule = Get-NetFirewallRule -DisplayName $Name -ErrorAction SilentlyContinue
    if ($existingRule) {
        Write-Host "  → Removing existing rule..." -ForegroundColor Gray
        Remove-NetFirewallRule -DisplayName $Name
    }

    # Add new rule
    New-NetFirewallRule -DisplayName $Name `
        -Direction Inbound `
        -Action Allow `
        -Protocol $Protocol `
        -LocalPort $Port `
        -Profile Any `
        -Enabled True | Out-Null

    Write-Host "  ✅ Firewall rule added: $Name" -ForegroundColor Green
}

# Add firewall rules
Write-Host "Setting up firewall rules..." -ForegroundColor Cyan
Write-Host ""

Add-FirewallRule -Name "AI School Dashboard - Backend API" -Port 5000
Add-FirewallRule -Name "AI School Dashboard - Frontend" -Port 3000
Add-FirewallRule -Name "AI School Dashboard - PostgreSQL" -Port 5432

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Firewall Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Display network information
Write-Host "📡 Your Network Information:" -ForegroundColor Cyan
Write-Host ""

$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Ethernet*" -and $_.IPAddress -notlike "169.*"}).IPAddress

if ($ipAddress) {
    Write-Host "   Local IP Address: $ipAddress" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Other devices can access at:" -ForegroundColor White
    Write-Host "   → Frontend: http://$ipAddress:3000" -ForegroundColor Green
    Write-Host "   → Backend:  http://$ipAddress:5000" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Could not detect IP address" -ForegroundColor Yellow
    Write-Host "   Run 'ipconfig' to find your IP address manually" -ForegroundColor Gray
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your backend server (npm start)" -ForegroundColor White
Write-Host "2. Access from other devices using the IP address above" -ForegroundColor White
Write-Host "3. Make sure all devices are on the same WiFi network" -ForegroundColor White
Write-Host ""
Write-Host "📖 For more details, see NETWORK_ACCESS_GUIDE.md" -ForegroundColor Gray
Write-Host ""

pause
