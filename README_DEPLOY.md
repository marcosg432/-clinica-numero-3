# 🚀 Guia Completo de Deploy - Railway + Vercel

## 📦 O que foi preparado

✅ Arquivos de configuração criados:
- `railway.json` - Configuração do Railway
- `vercel.json` - Configuração do Vercel
- `nixpacks.toml` - Build do Railway
- `.gitignore` - Arquivos ignorados
- `public/config.js` - Configuração da API (atualizar antes do deploy)

✅ Código ajustado:
- CORS configurado para produção
- Helmet ativado em produção
- URLs da API usando `config.js`
- Scripts de build atualizados

---

## 🎯 PASSO A PASSO COMPLETO

### PARTE 1: Railway (Backend)

#### 1. Criar Conta e Projeto
1. Acesse https://railway.app
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Escolha seu repositório
6. Railway começará a fazer deploy automaticamente

#### 2. Adicionar Banco de Dados
1. No projeto Railway, clique em **"+ New"**
2. Selecione **"Database"**
3. Escolha **"Add PostgreSQL"**
4. Aguarde a criação (Railway cria automaticamente a variável `DATABASE_URL`)

#### 3. Configurar Variáveis de Ambiente
1. No projeto Railway, vá em **"Variables"**
2. Adicione as seguintes variáveis:

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
- **JWT_SECRET**: Gere uma chave forte. No terminal: `openssl rand -base64 32`
- **CORS_ORIGIN**: Você atualizará isso depois com a URL do Vercel
- **EMAIL_PASS**: Use uma "App Password" do Gmail (não a senha normal)
  - Como criar: Google Account → Segurança → Verificação em 2 etapas → Senhas de app

#### 4. Atualizar Schema do Prisma para PostgreSQL
1. No Railway, vá em **"Deployments"**
2. Clique nos **"..."** do último deploy
3. Selecione **"Open Shell"**
4. Execute:
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

#### 5. Obter URL da API
1. No Railway, vá em **"Settings"**
2. Em **"Networking"**, ative **"Generate Domain"**
3. Copie a URL (ex: `https://seu-projeto.up.railway.app`)
4. **Esta é sua URL da API!** Anote ela.

---

### PARTE 2: Vercel (Frontend)

#### 1. Criar Conta e Projeto
1. Acesse https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Conecte o mesmo repositório GitHub
5. Vercel detectará automaticamente o `vercel.json`

#### 2. Atualizar config.js com URL da API
**ANTES de fazer deploy**, você precisa atualizar o arquivo `public/config.js`:

1. Abra o arquivo `public/config.js`
2. Substitua por:
```javascript
// Configuração da API - Produção
window.API_BASE = 'https://seu-projeto.up.railway.app/api';
```
(Substitua `seu-projeto.up.railway.app` pela URL real do Railway)

3. Faça commit e push:
```bash
git add public/config.js
git commit -m "Atualizar URL da API para produção"
git push
```

#### 3. Deploy no Vercel
1. Vercel fará deploy automaticamente após o push
2. Aguarde o deploy terminar
3. Copie a URL do site (ex: `https://seu-projeto.vercel.app`)

#### 4. Atualizar CORS no Railway
1. Volte no Railway → **"Variables"**
2. Atualize `CORS_ORIGIN` com a URL do Vercel:
```
CORS_ORIGIN=https://seu-projeto.vercel.app
```
3. Railway fará redeploy automaticamente

---

### PARTE 3: Verificações Finais

#### Testar Backend
- ✅ Acesse: `https://seu-projeto.up.railway.app/health`
- Deve retornar: `{"status":"ok","timestamp":"..."}`

#### Testar Frontend
- ✅ Acesse: `https://seu-projeto.vercel.app`
- ✅ Teste o formulário de agendamento
- ✅ Teste o admin: `https://seu-projeto.vercel.app/dashboard`

#### Testar Admin
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

### Erro: "404 Not Found" nas rotas
- Verifique se o `vercel.json` está correto
- Verifique se os arquivos HTML estão na raiz

### Admin não carrega dados
- Verifique se `config.js` tem a URL correta da API
- Verifique se o backend está rodando (teste `/health`)
- Abra o console do navegador (F12) e veja os erros

### Imagens não carregam
- As imagens devem estar na pasta `images/` na raiz
- Verifique os caminhos nos arquivos HTML

---

## 📝 Checklist Final

- [ ] Railway: Projeto criado
- [ ] Railway: PostgreSQL adicionado
- [ ] Railway: Variáveis configuradas
- [ ] Railway: Schema atualizado para PostgreSQL
- [ ] Railway: Migrações executadas
- [ ] Railway: Seed executado
- [ ] Railway: URL da API copiada
- [ ] Vercel: Projeto criado
- [ ] Vercel: `config.js` atualizado com URL da API
- [ ] Vercel: Deploy realizado
- [ ] Railway: CORS atualizado com URL do Vercel
- [ ] Testado: `/health` retorna OK
- [ ] Testado: Site carrega
- [ ] Testado: Formulários funcionam
- [ ] Testado: Admin funciona

---

## 🎉 Pronto!

Seu site está no ar! 

**URLs:**
- Frontend: `https://seu-projeto.vercel.app`
- Backend: `https://seu-projeto.up.railway.app`
- Admin: `https://seu-projeto.vercel.app/dashboard`

---

**Dúvidas?** Consulte:
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs

