<#
Genera iconos a partir de public/icon_web.png usando ImageMagick (magick).
Uso: Abrir PowerShell en la raíz del proyecto y ejecutar:
  powershell -ExecutionPolicy Bypass -File .\scripts\generate-icons.ps1
#>

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$public = Join-Path $projectRoot 'public'
$src = Join-Path $public 'icon_web.png'

if (!(Test-Path $src)) {
    Write-Error "No se encontró $src. Coloca el icono original en public/icon_web.png"
    exit 1
}

if (Get-Command magick -ErrorAction SilentlyContinue) {
    Write-Output "ImageMagick detectado: generando iconos..."
    & magick $src -resize 192x192^> "$public\icon-192.png"
    & magick $src -resize 512x512^> "$public\icon-512.png"
    & magick convert "$public\icon-192.png" "$public\icon-512.png" -colors 256 "$public\favicon.ico"
    Write-Output "Generado: icon-192.png, icon-512.png, favicon.ico en $public"
} else {
    Write-Warning "ImageMagick ('magick') no está disponible en PATH. Instala ImageMagick o usa una herramienta alternativa (p. ej. Node + sharp)."
    Write-Output "Comando sugerido con npm + sharp (ejecutar en la raíz del proyecto):"
    Write-Output "  npm install --save-dev sharp"
    Write-Output "  node scripts/generate-icons-with-sharp.js"
}
