param(
  [string]$Server = "2.24.209.48",
  [string]$User = "root",
  [string]$HostKey = "SHA256:0lsOy+yUjHRrIHvH4U868KgyKLJY5grXuPxTL+k0Sok",
  [string]$RemotePath = "/var/www/nieblasoundbranding"
)

$ErrorActionPreference = "Stop"
$plink = "C:\Program Files\PuTTY\plink.exe"
$pscp = "C:\Program Files\PuTTY\pscp.exe"
$repoRoot = Split-Path -Parent $PSScriptRoot

if (-not $env:NIEBLA_SSH_PASSWORD) {
  throw "Define la variable de entorno NIEBLA_SSH_PASSWORD antes de desplegar."
}

Write-Host "==> Build local..."
Push-Location $repoRoot
npm run build
Pop-Location

Write-Host "==> Subiendo dist/ al servidor..."
& $pscp -batch -r -hostkey $HostKey -pw $env:NIEBLA_SSH_PASSWORD `
  "$repoRoot\dist\*" "${User}@${Server}:${RemotePath}/"

Write-Host "==> Permisos y recarga nginx..."
$reloadCmd = @"
chown -R www-data:www-data ${RemotePath}
pid=`$(pgrep -x -P 1 nginx)
nginx -t || exit 1
echo `$pid > /run/nginx.pid
kill -HUP `$pid
"@
& $plink -batch -ssh "${User}@${Server}" -hostkey $HostKey -pw $env:NIEBLA_SSH_PASSWORD $reloadCmd

Write-Host "Deploy completado: http://${Server}/ (con Host: nieblasoundbranding.com)"
