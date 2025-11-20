#!/bin/bash

# Script de setup inicial para Railway
# Execute este script no shell do Railway após o primeiro deploy

echo "🚀 Iniciando setup do Railway..."

# 1. Preparar schema para PostgreSQL
echo "📝 Preparando schema para PostgreSQL..."
node scripts/prepare-railway.js

# 2. Gerar Prisma Client
echo "⚙️  Gerando Prisma Client..."
npx prisma generate

# 3. Executar migrações
echo "🗄️  Executando migrações..."
npx prisma migrate deploy

# 4. Popular banco com dados iniciais
echo "🌱 Populando banco de dados..."
npx prisma db seed

echo "✅ Setup concluído!"
echo "📊 Verifique os logs acima para confirmar que tudo foi configurado corretamente."

