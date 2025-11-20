# Script para fazer push no GitHub
# Execute este script no diretório do projeto

Write-Host "🚀 Fazendo push para o GitHub..." -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório correto
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Diretório Git não encontrado!" -ForegroundColor Red
    Write-Host "Execute este script no diretório do projeto." -ForegroundColor Yellow
    exit 1
}

# Verificar status
Write-Host "📊 Verificando status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "🔗 Verificando remote..." -ForegroundColor Yellow
git remote -v

Write-Host ""
Write-Host "📤 Fazendo push para GitHub..." -ForegroundColor Yellow
Write-Host "⚠️  Se pedir autenticação:" -ForegroundColor Yellow
Write-Host "   - Username: marcosg432" -ForegroundColor Cyan
Write-Host "   - Password: Use um Personal Access Token" -ForegroundColor Cyan
Write-Host ""

# Tentar fazer push
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Acesse: https://github.com/marcosg432/clinica-numero-3" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer push!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possíveis causas:" -ForegroundColor Yellow
    Write-Host "1. Repositório não existe no GitHub" -ForegroundColor White
    Write-Host "2. Precisa de autenticação (Personal Access Token)" -ForegroundColor White
    Write-Host "3. Nome do repositório está diferente" -ForegroundColor White
    Write-Host ""
    Write-Host "Solução:" -ForegroundColor Yellow
    Write-Host "1. Verifique se o repositório existe: https://github.com/marcosg432/clinica-numero-3" -ForegroundColor Cyan
    Write-Host "2. Crie um Personal Access Token: https://github.com/settings/tokens" -ForegroundColor Cyan
    Write-Host "3. Use o token como senha quando pedir autenticação" -ForegroundColor Cyan
}







