# PowerShell script to generate complete favicon sets from frontend/public/logo.png
Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$src = Join-Path $projectRoot "frontend\public\logo.png"

if (-not (Test-Path $src)) {
    Write-Error "Source image not found: $src"
    exit 1
}

$bmp = [System.Drawing.Bitmap]::FromFile($src)

function Resize-And-Save($sourceBmp, $width, $height, $destPath) {
    $destBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($sourceBmp, 0, 0, $width, $height)
    $g.Dispose()
    
    $destBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()
    Write-Host "Created: $destPath ($width x $height)"
}

function Save-Ico($sourceBmp, $destPath) {
    $thumb = New-Object System.Drawing.Bitmap(48, 48, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($thumb)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($sourceBmp, 0, 0, 48, 48)
    $g.Dispose()

    $hIcon = $thumb.GetHicon()
    $icon = [System.Drawing.Icon]::FromHandle($hIcon)
    $fs = New-Object System.IO.FileStream($destPath, [System.IO.FileMode]::Create)
    $icon.Save($fs)
    $fs.Close()
    $thumb.Dispose()
    Write-Host "Created ICO: $destPath"
}

$publicDir = Join-Path $projectRoot "frontend\public"
$appDir = Join-Path $projectRoot "frontend\src\app"

Resize-And-Save $bmp 16 16 (Join-Path $publicDir "favicon-16x16.png")
Resize-And-Save $bmp 32 32 (Join-Path $publicDir "favicon-32x32.png")
Resize-And-Save $bmp 96 96 (Join-Path $publicDir "favicon-96x96.png")
Resize-And-Save $bmp 180 180 (Join-Path $publicDir "apple-touch-icon.png")
Resize-And-Save $bmp 192 192 (Join-Path $publicDir "web-app-manifest-192x192.png")
Resize-And-Save $bmp 512 512 (Join-Path $publicDir "web-app-manifest-512x512.png")
Resize-And-Save $bmp 192 192 (Join-Path $publicDir "icon.png")

Resize-And-Save $bmp 192 192 (Join-Path $appDir "icon.png")
Resize-And-Save $bmp 180 180 (Join-Path $appDir "apple-icon.png")

Save-Ico $bmp (Join-Path $publicDir "favicon.ico")
Save-Ico $bmp (Join-Path $appDir "favicon.ico")

$bmp.Dispose()
Write-Host "Favicons generated successfully!"
