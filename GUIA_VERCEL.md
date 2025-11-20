# 🚀 Guia Completo - Deploy no Vercel (Frontend)

## 📋 Pré-requisitos

✅ **Railway (Backend) já configurado e funcionando**
- Backend rodando no Railway
- URL da API disponível (ex: `https://seu-projeto.up.railway.app`)

---

## 🎯 Passo a Passo - Vercel

### PARTE 1: Obter URL da API do Railway

1. **Acesse o Railway**
   - Vá para https://railway.app
   - Acesse seu projeto `-clínica-número-3`

2. **Obter URL da API**
   - Vá em **"Settings"** → **"Networking"**
   - Clique em **"Generate Domain"** (se ainda não tiver gerado)
   - Copie a URL completa (ex: `https://seu-projeto.up.railway.app`)
   - **Esta é sua URL da API!** Guarde ela.

3. **Testar API**
   - Acesse: `https://seu-projeto.up.railway.app/health`
   - Deve retornar: `{"status":"ok","timestamp":"..."}`
   - Se funcionar, está pronto! ✅

---

### PARTE 2: Atualizar config.js com URL da API

1. **Editar `public/config.js`**
   - Abra o arquivo `public/config.js`
   - Substitua pelo código abaixo (use a URL real do Railway):

```javascript
// Configuração da API - Produção
window.API_BASE = 'https://SUA-URL-DO-RAILWAY.up.railway.app/api';
```

**Exemplo:**
```javascript
// Se sua URL do Railway for: https://clinica-numero-3-production.up.railway.app
// Então use:
window.API_BASE = 'https://clinica-numero-3-production.up.railway.app/api';
```

2. **Fazer commit e push**
   ```bash
   git add public/config.js
   git commit -m "Atualizar URL da API para produção"
   git push origin main
   ```

---

### PARTE 3: Criar Projeto no Vercel

1. **Acesse o Vercel**
   - Vá para https://vercel.com
   - Faça login com sua conta GitHub

2. **Adicionar Novo Projeto**
   - Clique em **"Add New..."** ou **"Add Project"**
   - Selecione **"Import Git Repository"**
   - Escolha seu repositório `-clinica-numero-3` (ou o nome do seu repo)

3. **Configurar Projeto**
   - **Project Name**: escolha um nome (ex: `clinica-odonto-azul`)
   - **Framework Preset**: Deixe como **"Other"** ou **"Other Static"**
   - **Root Directory**: deixe como `./` (raiz)
   - **Build Command**: `npm run build:vercel` ou deixe vazio
   - **Output Directory**: deixe vazio ou `.` (raiz)

4. **Configurar Variáveis de Ambiente (opcional)**
   - Geralmente não precisa para frontend estático
   - Mas se necessário, pode adicionar depois

5. **Deploy**
   - Clique em **"Deploy"**
   - Aguarde o deploy terminar (1-2 minutos)
   - Copie a URL do site (ex: `https://seu-projeto.vercel.app`)

---

### PARTE 4: Atualizar CORS no Railway

Depois que o Vercel fizer o deploy, você precisa atualizar o CORS no Railway:

1. **Volte ao Railway**
   - Acesse seu projeto no Railway
   - Vá em **"Variables"** (Variáveis)

2. **Atualizar CORS_ORIGIN**
   - Encontre a variável `CORS_ORIGIN`
   - Atualize com a URL do Vercel:
   ```
   CORS_ORIGIN=https://seu-projeto.vercel.app
   ```
   - **IMPORTANTE**: Use a URL completa sem barra no final

3. **Salvar**
   - Railway fará redeploy automaticamente após salvar
   - Aguarde alguns minutos

---

### PARTE 5: Testar Tudo

#### ✅ Testar Backend (Railway)
- Acesse: `https://seu-projeto.up.railway.app/health`
- Deve retornar: `{"status":"ok"}`

#### ✅ Testar Frontend (Vercel)
- Acesse: `https://seu-projeto.vercel.app`
- O site deve carregar normalmente

#### ✅ Testar Formulários
- Preencha o formulário de agendamento
- Envie e verifique se funciona

#### ✅ Testar Admin
- Acesse: `https://seu-projeto.vercel.app/dashboard`
- Faça login com:
  - Email: `admin@clinica.com`
  - Senha: `admin123`
- Verifique se carrega os dados

---

## 🔧 Troubleshooting

### Erro: "CORS policy"
- Verifique se `CORS_ORIGIN` no Railway está correto
- Formato: `https://seu-site.vercel.app` (sem barra final)
- Aguarde o redeploy do Railway após atualizar

### Erro: "Failed to fetch" ou "Network Error"
- Verifique se a URL da API em `config.js` está correta
- Teste acessar a URL da API diretamente no navegador
- Verifique os logs do Railway para ver se há erros

### Admin não carrega dados
- Abra o console do navegador (F12)
- Verifique se há erros no console
- Verifique se a URL da API está correta
- Verifique se o backend está rodando (teste `/health`)

### Site não atualiza
- Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)
- Verifique se o deploy do Vercel foi concluído
- Aguarde alguns minutos para o cache do CDN atualizar

---

## 📝 Checklist Final

- [ ] Railway: Backend funcionando (teste `/health`)
- [ ] Railway: URL da API copiada
- [ ] Frontend: `public/config.js` atualizado com URL da API
- [ ] Frontend: Commit e push realizados
- [ ] Vercel: Projeto criado
- [ ] Vercel: Deploy realizado
- [ ] Vercel: URL do site copiada
- [ ] Railway: `CORS_ORIGIN` atualizado com URL do Vercel
- [ ] Testado: Site carrega
- [ ] Testado: Formulários funcionam
- [ ] Testado: Admin funciona

---

## 🎉 Pronto!

Seu site está no ar!

**URLs:**
- 🖥️ **Frontend**: `https://seu-projeto.vercel.app`
- 🔧 **Backend**: `https://seu-projeto.up.railway.app`
- 👨‍💼 **Admin**: `https://seu-projeto.vercel.app/dashboard`

---

## 📚 Referências

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app


