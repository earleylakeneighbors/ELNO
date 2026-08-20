Add-Type -AssemblyName System.Drawing

$posterPath = "C:\Users\Oxford\.cursor\projects\c-Users-Oxford-Documents-Cursor-Projects-earleylakeneighborhood\assets\c__Users_Oxford_AppData_Roaming_Cursor_User_workspaceStorage_6db0077c17ce7d993fad8d5a8974c9be_images_Earley_Lake_poster_high_res-5f27cdc4-5694-4be5-a4b6-4163f22f1eb9.png"
$outDir = "C:\Users\Oxford\Documents\Cursor Projects\earleylakeneighborhood\public\images"

$img = [System.Drawing.Image]::FromFile($posterPath)
$w = $img.Width
$h = $img.Height

function Save-Crop {
  param([string]$Name, [double]$Xf, [double]$Yf, [double]$Wf, [double]$Hf)
  $X = [Math]::Max(0, [int]($w * $Xf))
  $Y = [Math]::Max(0, [int]($h * $Yf))
  $CropW = [Math]::Min([int]($w * $Wf), $w - $X)
  $CropH = [Math]::Min([int]($h * $Hf), $h - $Y)
  $rect = New-Object System.Drawing.Rectangle $X, $Y, $CropW, $CropH
  $bmp = New-Object System.Drawing.Bitmap $CropW, $CropH
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $CropW, $CropH), $rect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $jpgPath = Join-Path $outDir $Name
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
  $encoder = [System.Drawing.Imaging.Encoder]::Quality
  $params = New-Object System.Drawing.Imaging.EncoderParameters 1
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter $encoder, 92L
  $bmp.Save($jpgPath, $codec, $params)
  $bmp.Dispose()
  Write-Host "Saved $Name (${CropW}x${CropH})"
}

# Hero: lake ducks only
Save-Crop "poster-hero-ducks.jpg" 0.05 0.155 0.90 0.145

# Map body without green title bar
Save-Crop "neighborhood-map.jpg" 0.055 0.345 0.43 0.155

# Wildlife grid: row1 ~0.70-0.78, row2 ~0.78-0.86 (exclude caption band ~bottom 14%)
$names = @(
  "wildlife-wood-ducks.jpg",
  "wildlife-turtles-1.jpg",
  "wildlife-swans.jpg",
  "wildlife-trumpeter-swan.jpg",
  "wildlife-great-blue-heron.jpg",
  "wildlife-fall-colors.jpg",
  "wildlife-turtles-2.jpg",
  "wildlife-fall-reflections.jpg"
)

$left = 0.055
$cellW = 0.222
$gap = 0.005
$row1Y = 0.705
$row2Y = 0.790
$cellH = 0.072

for ($i = 0; $i -lt 8; $i++) {
  $col = $i % 4
  $row = [math]::Floor($i / 4)
  $x = $left + $col * ($cellW + $gap)
  $y = if ($row -eq 0) { $row1Y } else { $row2Y }
  Save-Crop $names[$i] $x $y $cellW $cellH
}

# Remove debug strips
Get-ChildItem $outDir -Filter "debug-y*.jpg" | Remove-Item -Force
Write-Host "Removed debug strips"

$img.Dispose()
Write-Host "Done."
