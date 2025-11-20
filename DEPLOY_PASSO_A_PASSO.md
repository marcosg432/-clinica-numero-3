# 🚀 Deploy Passo a Passo - Railway + Vercel

## 📋 PARTE 1: Railway (Backend/API)

### Passo 1: Criar Projeto no Railway

1. **Acesse**: https://railway.app
2. **Faça login** com GitHub
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Escolha o repositório: **`-clinica-numero-3`**
6. Railway começará a fazer deploy automaticamente

### Passo 2: Adicionar Banco PostgreSQL

1. No projeto Railway, clique em **"+ New"**
2. Selecione **"Database"**
3. Escolha **"Add PostgreSQL"**
4. Aguarde a criação (Railway cria automaticamente a variável `DATABASE_URL`)

### Passo 3: Configurar Variáveis de Ambiente

No projeto Railway, vá em **"Variables"** e adicione:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<GERE_UMA_CHAVE_FORTE>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://seu-projeto.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-app-password-gmail
EMAIL_FROM=Clínica Odonto Azul <noreply@odontoazul.com>
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANTE:**
- **JWT_SECRET**: Gere uma chave forte (ex: `openssl rand -base64 32`)
- **CORS_ORIGIN**: Você atualizará depois com a URL do Vercel
- **EMAIL_PASS**: Use uma "App Password" do Gmail

### Passo 4: Atualizar Schema para PostgreSQL

1. No Railway, vá em **"Deployments"**
2. Clique nos **"..."** do último deploy
3. Selecione **"Open Shell"**
4. Execute estes comandos:

```bash
# Atualizar schema para PostgreSQL
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
sed -i 's/String   @default("\[\]")/String[]  @default([])/' prisma/schema.prisma
sed -i 's/String  @default("\[\]")/String[] @default([])/' prisma/schema.prisma
sed -i 's/@db.Text//' prisma/schema.prisma

# Gerar Prisma Client
npx prisma generate

# Executar migrações
npx prisma migrate deploy

# Popular banco
npx prisma db seed
```

### Passo 5: Obter URL da API

1. No Railway, vá em **"Settings"**
2. Em **"Networking"**, ative **"Generate Domain"**
3. Copie a URL (ex: `https://seu-projeto.up.railway.app`)
4. **Esta é sua URL da API!** Anote ela.

---

## 🌐 PARTE 2: Vercel (Frontend)

### Passo 1: Criar Projeto no Vercel

1. **Acesse**: https://vercel.com
2. **Faça login** com GitHub
3. Clique em **"Add New Project"**
4. Conecte o repositório: **`-clinica-numero-3`**
5. Vercel detectará automaticamente o `vercel.json`

### Passo 2: Atualizar config.js com URL da API

**ANTES de fazer deploy**, você precisa atualizar o arquivo `public/config.js`:

1. No GitHub, edite o arquivo `public/config.js`
2. Substitua por:
```javascript
// Configuração da API - Produção
window.API_BASE = 'https://seu-projeto.up.railway.app/api';
```
(Substitua `seu-projeto.up.railway.app` pela URL real do Railway)

3. Faça commit:
   - Clique em "Commit changes"
   - Mensagem: "Atualizar URL da API para produção"

### Passo 3: Deploy no Vercel

1. Vercel fará deploy automaticamente após o commit
2. Aguarde o deploy terminar
3. Copie a URL do site (ex: `https://seu-projeto.vercel.app`)

### Passo 4: Atualizar CORS no Railway

1. Volte no Railway → **"Variables"**
2. Atualize `CORS_ORIGIN` com a URL do Vercel:
```
CORS_ORIGIN=https://seu-projeto.vercel.app
```
3. Railway fará redeploy automaticamente

---

## ✅ PARTE 3: Verificações Finais

### Testar Backend
- ✅ Acesse: `https://seu-projeto.up.railway.app/health`
- Deve retornar: `{"status":"ok","timestamp":"..."}`

### Testar Frontend
- ✅ Acesse: `https://seu-projeto.vercel.app`
- ✅ Teste o formulário de agendamento
- ✅ Teste o admin: `https://seu-projeto.vercel.app/dashboard`

### Testar Admin
- ✅ Login: `admin@clinica.com` / `admin123`
- ✅ Verificar se carrega tratamentos, agendamentos e avaliações

---

## 🔧 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se `DATABASE_URL` está correto no Railway
- Execute `npx prisma migrate deploy` no shell do Railway

### Erro: "CORS policy"
- Adicione a URL do Vercel em `CORS_ORIGIN` no Railway
- Formato: `https://seu-site.vercel.app`

### Admin não carrega dados
- Verifique se `config.js` tem a URL correta da API
- Verifique se o backend está rodando (teste `/health`)
- Abra o console do navegador (F12) e veja os erros

---

**Pronto! Seu site está no ar! 🎉**


