# Script para iniciar o servidor
$ErrorActionPreference = "Stop"

Write-Host "=== INICIANDO SERVIDOR ===" -ForegroundColor Cyan

# Navegar para o diretório do projeto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Diretório: $(Get-Location)" -ForegroundColor Yellow

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Verificar se Prisma Client está gerado
if (-not (Test-Path "node_modules/.prisma")) {
    Write-Host "Gerando Prisma Client..." -ForegroundColor Yellow
    npx prisma generate
}

# Iniciar servidor
Write-Host "`nIniciando servidor na porta 3000..." -ForegroundColor Green
Write-Host "Aguarde alguns segundos...`n" -ForegroundColor Yellow

npm run dev


