# 🚀 Guia Rápido de Deploy

## ⚡ Passos Rápidos

### 1️⃣ Railway (Backend)

1. **Criar projeto no Railway**
   - Acesse: https://railway.app
   - Login com GitHub
   - "New Project" → "Deploy from GitHub repo"
   - Conecte seu repositório

2. **Adicionar PostgreSQL**
   - No projeto: "+ New" → "Database" → "Add PostgreSQL"
   - Railway cria automaticamente `DATABASE_URL`

3. **Configurar Variáveis**
   - Settings → Variables → Adicione:
   ```
   NODE_ENV=production
   JWT_SECRET=<gere uma chave forte>
   CORS_ORIGIN=https://seu-site.vercel.app
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=seu-email@gmail.com
   EMAIL_PASS=sua-app-password-gmail
   EMAIL_FROM=Clínica Odonto Azul <noreply@odontoazul.com>
   ```

4. **Executar Migrações**
   - Deployments → "..." → "Open Shell"
   - Execute:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

5. **Copiar URL da API**
   - Settings → Networking → "Generate Domain"
   - Copie a URL (ex: `https://seu-projeto.up.railway.app`)

### 2️⃣ Vercel (Frontend)

1. **Criar projeto no Vercel**
   - Acesse: https://vercel.com
   - Login com GitHub
   - "Add New Project"
   - Conecte o mesmo repositório

2. **Atualizar config.js**
   - Antes do deploy, edite `public/config.js`:
   ```javascript
   window.API_BASE = 'https://seu-projeto.up.railway.app/api';
   ```

3. **Deploy Automático**
   - Vercel detecta `vercel.json` e faz deploy
   - Copie a URL do site (ex: `https://seu-projeto.vercel.app`)

4. **Atualizar CORS no Railway**
   - Volte no Railway → Variables
   - Atualize `CORS_ORIGIN` com a URL do Vercel

### 3️⃣ Verificar

- ✅ Backend: `https://seu-projeto.up.railway.app/health`
- ✅ Frontend: `https://seu-projeto.vercel.app`
- ✅ Admin: `https://seu-projeto.vercel.app/dashboard`

---

## 📝 Checklist Final

- [ ] Railway: Projeto criado
- [ ] Railway: PostgreSQL adicionado
- [ ] Railway: Variáveis configuradas
- [ ] Railway: Migrações executadas
- [ ] Railway: URL da API copiada
- [ ] Vercel: Projeto criado
- [ ] Vercel: `config.js` atualizado com URL da API
- [ ] Vercel: Deploy realizado
- [ ] Railway: CORS atualizado com URL do Vercel
- [ ] Testado: Site funcionando
- [ ] Testado: Formulários funcionando
- [ ] Testado: Admin funcionando

---

**Pronto! Seu site está no ar! 🎉**

