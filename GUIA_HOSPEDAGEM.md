# 🚀 Guia Completo de Hospedagem - Railway + Vercel

## 📋 Visão Geral

Este projeto será hospedado em:
- **Backend (API)**: Railway.app (Node.js + PostgreSQL)
- **Frontend (Site)**: Vercel (HTML/CSS/JS estático)

---

## 🔧 PARTE 1: Preparar o Backend na Railway

### Passo 1: Criar Conta e Projeto na Railway

1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Conecte seu repositório GitHub

### Passo 2: Adicionar Banco de Dados PostgreSQL

1. No projeto Railway, clique em **"+ New"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. Aguarde a criação do banco
4. Railway criará automaticamente a variável `DATABASE_URL`

### Passo 3: Configurar Variáveis de Ambiente

No projeto Railway, vá em **"Variables"** e adicione:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<automático - já criado pelo PostgreSQL>
JWT_SECRET=<gere uma chave secreta forte>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://seu-site.vercel.app,https://www.seu-site.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-app-gmail
EMAIL_FROM=Clínica Odonto Azul <noreply@odontoazul.com>
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANTE:**
- `JWT_SECRET`: Gere uma chave forte (ex: `openssl rand -base64 32`)
- `CORS_ORIGIN`: Substitua pela URL do seu site na Vercel
- `EMAIL_PASS`: Use uma "App Password" do Gmail (não a senha normal)

### Passo 4: Configurar Build e Deploy

1. Railway detectará automaticamente o `railway.json`
2. O build executará: `npm run build && npx prisma generate`
3. O deploy executará: `npm run start`

### Passo 5: Executar Migrações do Banco

1. No Railway, vá em **"Deployments"**
2. Clique nos **"..."** do último deploy
3. Selecione **"Open Shell"**
4. Execute:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### Passo 6: Obter URL da API

1. No Railway, vá em **"Settings"**
2. Em **"Networking"**, ative **"Generate Domain"**
3. Copie a URL (ex: `https://seu-projeto.up.railway.app`)
4. **Esta será sua URL da API!**

---

## 🌐 PARTE 2: Preparar o Frontend na Vercel

### Passo 1: Criar Conta e Projeto na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Conecte o mesmo repositório GitHub
5. Vercel detectará automaticamente o `vercel.json`

### Passo 2: Configurar Variáveis de Ambiente

Na Vercel, vá em **"Settings"** → **"Environment Variables"** e adicione:

```env
VITE_API_URL=https://seu-projeto.up.railway.app/api
```

### Passo 3: Atualizar URLs da API no Frontend

Antes de fazer deploy, você precisa atualizar as URLs da API nos arquivos HTML:

1. Substitua `http://localhost:3000/api` por `https://seu-projeto.up.railway.app/api`
2. Ou use variável de ambiente (ver seção abaixo)

### Passo 4: Deploy

1. Vercel fará deploy automaticamente
2. Após o deploy, copie a URL (ex: `https://seu-projeto.vercel.app`)

---

## 🔄 PARTE 3: Atualizar URLs da API

### Opção 1: Atualizar Manualmente (Recomendado para início)

Substitua em todos os arquivos HTML:
- `index.html`
- `sobre.html`
- `tratamentos.html`
- `agendamento.html`
- `public/admin.html`
- `public/admin-login.html`

Troque:
```javascript
const API_BASE = 'http://localhost:3000/api';
```

Por:
```javascript
const API_BASE = 'https://seu-projeto.up.railway.app/api';
```

### Opção 2: Usar Variável de Ambiente (Avançado)

Crie um arquivo `config.js` que será gerado no build.

---

## ✅ PARTE 4: Verificações Finais

### Backend (Railway)
- [ ] Banco PostgreSQL criado
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações executadas
- [ ] Seed executado
- [ ] URL da API funcionando (`/health` deve retornar `{"status":"ok"}`)

### Frontend (Vercel)
- [ ] URLs da API atualizadas
- [ ] Site acessível
- [ ] Formulários funcionando
- [ ] Admin panel acessível

---

## 🔐 PARTE 5: Segurança em Produção

### Railway
- ✅ CORS configurado para aceitar apenas seu domínio Vercel
- ✅ JWT_SECRET forte
- ✅ Helmet ativado
- ✅ Rate limiting ativo

### Vercel
- ✅ Headers de segurança configurados
- ✅ HTTPS automático
- ✅ CDN global

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se `DATABASE_URL` está correto no Railway
- Execute `npx prisma migrate deploy` no shell do Railway

### Erro: "CORS policy"
- Adicione a URL do Vercel em `CORS_ORIGIN` no Railway
- Formato: `https://seu-site.vercel.app,https://www.seu-dominio.com`

### Erro: "404 Not Found" nas rotas
- Verifique se o `vercel.json` está correto
- Verifique se os arquivos HTML estão na raiz do projeto

### Admin não carrega dados
- Verifique se a URL da API está correta
- Verifique se o backend está rodando (teste `/health`)

---

## 📞 Suporte

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Boa sorte com o deploy! 🚀**

