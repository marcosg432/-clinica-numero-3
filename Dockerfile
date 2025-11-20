# Estágio 1: Build
FROM node:20-alpine AS builder

# Instalar OpenSSL e outras dependências necessárias
RUN apk add --no-cache openssl openssl-dev libc6-compat

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

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

# Instalar apenas dependências de produção
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

# Gerar Prisma Client novamente no ambiente de produção
RUN npx prisma generate

# Copiar arquivos compilados
COPY --from=builder /app/dist ./dist
# Prisma Client já foi gerado no estágio de produção, não precisa copiar

# Criar diretório de uploads
RUN mkdir -p uploads

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production

# Comando para iniciar
CMD ["node", "dist/server.js"]









