# Reduce las fotos para la web.
#
#   npm run optimizar            (usa restaurantes/*.mjs -> carpeta "imagenes")
#   npm run optimizar -- Imagenes 900 82
#
# Lee cada imagen de la carpeta y escribe una version liviana en
# <carpeta>/web/<misma ruta>. Los originales no se tocan: el generador
# publica la version de "web" cuando existe.
param(
  [string]$Carpeta = "Imagenes",
  [int]$AnchoMax = 900,
  [int]$Calidad = 82
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$raiz = Split-Path -Parent $PSScriptRoot
$origen = Join-Path $raiz $Carpeta
if (-not (Test-Path $origen)) { Write-Host "  No existe la carpeta $Carpeta"; exit 1 }
$destinoRaiz = Join-Path $origen "web"

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]$Calidad)

# ¿La imagen usa transparencia de verdad? Entonces se conserva como PNG.
function Test-Alpha([System.Drawing.Bitmap]$bmp) {
  if (-not [System.Drawing.Image]::IsAlphaPixelFormat($bmp.PixelFormat)) { return $false }
  $paso = [Math]::Max(1, [int]($bmp.Width / 120))
  for ($y = 0; $y -lt $bmp.Height; $y += $paso) {
    for ($x = 0; $x -lt $bmp.Width; $x += $paso) {
      if ($bmp.GetPixel($x, $y).A -lt 250) { return $true }
    }
  }
  return $false
}

$archivos = Get-ChildItem -Path $origen -Recurse -File -Include *.jpg, *.jpeg, *.png |
  Where-Object { $_.FullName -notlike "$destinoRaiz*" }

$hechas = 0; $saltadas = 0; $antes = 0; $despues = 0

foreach ($f in $archivos) {
  $rel = $f.FullName.Substring($origen.Length + 1)
  $sinExt = [IO.Path]::ChangeExtension($rel, $null).TrimEnd('.')
  $img = $null; $bmp = $null
  try {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $bmp = New-Object System.Drawing.Bitmap $img
    $conAlpha = Test-Alpha $bmp
    $ext = if ($conAlpha) { ".png" } else { ".jpg" }
    $destino = Join-Path $destinoRaiz ($sinExt + $ext)

    if ((Test-Path $destino) -and ((Get-Item $destino).LastWriteTime -ge $f.LastWriteTime)) {
      $saltadas++; continue
    }
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destino) | Out-Null

    $w = $bmp.Width; $h = $bmp.Height
    if ($w -gt $AnchoMax) { $h = [int][Math]::Round($h * $AnchoMax / $w); $w = $AnchoMax }

    $out = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($out)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    if (-not $conAlpha) { $g.Clear([System.Drawing.Color]::Black) }
    $g.DrawImage($bmp, 0, 0, $w, $h)
    $g.Dispose()

    if ($conAlpha) { $out.Save($destino, [System.Drawing.Imaging.ImageFormat]::Png) }
    else { $out.Save($destino, $jpegCodec, $params) }
    $out.Dispose()

    # Si la "optimizada" pesa mas que el original, no sirve: se descarta
    # y el generador publica el original.
    $nuevo = (Get-Item $destino).Length
    if ($nuevo -ge $f.Length) {
      Remove-Item $destino -Force
      "{0,-42} ya era liviana, se deja el original" -f $rel
      $saltadas++; continue
    }
    $antes += $f.Length; $despues += $nuevo; $hechas++
    "{0,-42} {1,7:N0} KB -> {2,6:N0} KB" -f $rel, ($f.Length / 1KB), ($nuevo / 1KB)
  }
  catch { Write-Host ("  no se pudo procesar {0}: {1}" -f $rel, $_.Exception.Message) }
  finally { if ($bmp) { $bmp.Dispose() }; if ($img) { $img.Dispose() } }
}

Write-Host ""
if ($hechas -gt 0) {
  Write-Host ("  {0} imagenes optimizadas: {1:N1} MB -> {2:N1} MB" -f $hechas, ($antes / 1MB), ($despues / 1MB))
}
if ($saltadas -gt 0) { Write-Host ("  {0} ya estaban al dia" -f $saltadas) }
Write-Host "  Ahora genera el sitio:  npm run build <restaurante>"
Write-Host ""
