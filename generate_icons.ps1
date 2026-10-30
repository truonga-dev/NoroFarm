Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "frontend/public/logo.png").Path
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

function Save-Ico($pngPath, $destPath) {
    $pngBytes = [System.IO.File]::ReadAllBytes($pngPath)
    $ms = New-Object System.IO.MemoryStream
    $bw = New-Object System.IO.BinaryWriter($ms)
    # ICONDIR: Reserved=0, Type=1 (ICO), Count=1
    $bw.Write([uint16]0)
    $bw.Write([uint16]1)
    $bw.Write([uint16]1)
    # ICONDIRENTRY: 32x32, 0 colors, 0 reserved, 1 plane, 32 bpp, size, offset 22
    $bw.Write([byte]32)
    $bw.Write([byte]32)
    $bw.Write([byte]0)
    $bw.Write([byte]0)
    $bw.Write([uint16]1)
    $bw.Write([uint16]32)
    $bw.Write([uint32]$pngBytes.Length)
    $bw.Write([uint32]22)
    $bw.Write($pngBytes)
    $bw.Flush()
    [System.IO.File]::WriteAllBytes($destPath, $ms.ToArray())
    $bw.Close()
    $ms.Close()
    Write-Host "Created valid ICO: $destPath"
}

# Target directories
$publicDir = (Resolve-Path "frontend/public").Path

Resize-And-Save $bmp 16 16 "$publicDir/favicon-16x16.png"
Resize-And-Save $bmp 32 32 "$publicDir/favicon-32x32.png"
Resize-And-Save $bmp 96 96 "$publicDir/favicon-96x96.png"
Resize-And-Save $bmp 180 180 "$publicDir/apple-touch-icon.png"
Resize-And-Save $bmp 192 192 "$publicDir/web-app-manifest-192x192.png"
Resize-And-Save $bmp 512 512 "$publicDir/web-app-manifest-512x512.png"
Resize-And-Save $bmp 192 192 "$publicDir/icon.png"

Save-Ico "$publicDir/favicon-32x32.png" "$publicDir/favicon.ico"

$bmp.Dispose()
Write-Host "Favicons generated successfully!"
