# Estágio 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Estágio 2: Produção
FROM node:20-alpine

WORKDIR /app

# Instalar apenas dependências de produção
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

# Copiar arquivos compilados
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









