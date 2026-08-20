Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\public\images\ELNO Logo.png" | Resolve-Path
$outIco = Join-Path $PSScriptRoot "..\src\app\favicon.ico" | Resolve-Path -ErrorAction SilentlyContinue
if (-not $outIco) {
  $outIco = Join-Path (Split-Path $PSScriptRoot -Parent) "src\app\favicon.ico"
}

$img = [System.Drawing.Image]::FromFile($srcPath)
$sizes = @(16, 32, 48)
$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter $ms

$bw.Write([UInt16]0)
$bw.Write([UInt16]1)
$bw.Write([UInt16]$sizes.Count)

$imageData = New-Object System.Collections.Generic.List[byte[]]
$offset = 6 + (16 * $sizes.Count)

foreach ($s in $sizes) {
  $bmp = New-Object System.Drawing.Bitmap $s, $s
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.DrawImage($img, 0, 0, $s, $s)
  $g.Dispose()

  $pngStream = New-Object System.IO.MemoryStream
  $bmp.Save($pngStream, [System.Drawing.Imaging.ImageFormat]::Png)
  $bytes = $pngStream.ToArray()
  $pngStream.Dispose()
  $bmp.Dispose()
  $imageData.Add($bytes)

  $sizeByte = [Byte]0
  if ($s -lt 256) { $sizeByte = [Byte]$s }
  $bw.Write($sizeByte)
  $bw.Write($sizeByte)
  $bw.Write([Byte]0)
  $bw.Write([Byte]0)
  $bw.Write([UInt16]1)
  $bw.Write([UInt16]32)
  $bw.Write([UInt32]$bytes.Length)
  $bw.Write([UInt32]$offset)
  $offset += $bytes.Length
}

foreach ($bytes in $imageData) {
  $bw.Write($bytes)
}
$bw.Flush()
[System.IO.File]::WriteAllBytes($outIco, $ms.ToArray())
$bw.Dispose()
$ms.Dispose()
$img.Dispose()
Write-Host "Wrote favicon.ico ($((Get-Item $outIco).Length) bytes)"
