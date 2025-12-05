# Package Chrome Extension for Distribution
# Usage: ./package.ps1

$extensionName = "ai-reading-assistant"
$version = "1.0.0"
$outputFile = "$extensionName-v$version.zip"

Write-Host "📦 Packaging AI Reading Assistant..." -ForegroundColor Cyan

# Files and folders to include
$filesToInclude = @(
    "manifest.json",
    "background.js",
    "content.js",
    "popup.html",
    "popup.css",
    "popup.js",
    "options.html",
    "options.js",
    "saved.html",
    "saved.js",
    "api.js",
    "summarizer.js",
    "test-api.js",
    "icons",
    "libs",
    "LICENSE",
    "README.md",
    "PRIVACY.md"
)

# Remove old package if exists
if (Test-Path $outputFile) {
    Remove-Item $outputFile
    Write-Host "🗑️  Removed old package" -ForegroundColor Yellow
}

# Create ZIP
Write-Host "📁 Creating package..." -ForegroundColor Green
Compress-Archive -Path $filesToInclude -DestinationPath $outputFile

if (Test-Path $outputFile) {
    $fileSize = (Get-Item $outputFile).Length / 1KB
    Write-Host "✅ Package created successfully!" -ForegroundColor Green
    Write-Host "📦 File: $outputFile" -ForegroundColor Cyan
    Write-Host "📏 Size: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚀 Ready to upload to Chrome Web Store!" -ForegroundColor Magenta
} else {
    Write-Host "❌ Failed to create package" -ForegroundColor Red
}
