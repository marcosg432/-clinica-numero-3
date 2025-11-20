# Estágio 1: Build
FROM node:20-alpine AS builder

# Instalar OpenSSL e outras dependências necessárias
RUN apk add --no-cache openssl openssl-dev libc6-compat python3 make g++

# Variáveis de ambiente para reduzir uso de memória
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV npm_config_cache=/tmp/.npm

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências e limpar cache
RUN npm ci --no-audit --no-fund && \
    npm cache clean --force

# Copiar código fonte
COPY . .

# Executar prepare-railway antes de gerar Prisma
RUN npm run railway:prepare || true

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Estágio 2: Produção
FROM node:20-alpine

# Instalar OpenSSL no container de produção
RUN apk add --no-cache openssl openssl-dev libc6-compat

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar apenas dependências de produção e limpar cache
RUN npm ci --omit=dev --no-audit --no-fund && \
    npm cache clean --force

# Gerar Prisma Client no ambiente de produção
RUN npx prisma generate

# Copiar arquivos compilados do builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Criar diretório de uploads
RUN mkdir -p uploads

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production

# Comando para iniciar
CMD ["node", "dist/server.js"]









