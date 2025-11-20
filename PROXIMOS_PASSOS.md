# ✅ Próximos Passos - Finalizar Configuração

## 🎯 O que você já fez:
- ✅ Railway (Backend) configurado e funcionando
- ✅ URL da API do Railway: `clinica-numero-3-production.up.railway.app`
- ✅ `config.js` atualizado com URL da API
- ✅ Vercel (Frontend) deployado

---

## 📝 O que fazer agora:

### 1️⃣ **Copiar URL do Vercel**

No Vercel, após o deploy:
- Você verá uma URL tipo: `https://clinica-numero-3-2s7f.vercel.app`
- **Copie essa URL completa** (com `https://`)

---

### 2️⃣ **Atualizar CORS no Railway**

1. **Acesse o Railway**
   - Vá para https://railway.app
   - Acesse seu projeto `-clínica-número-3`

2. **Vá em "Variables" (Variáveis)**
   - Clique na aba "Variables" ou "Configurações" → "Variables"

3. **Encontre `CORS_ORIGIN`**
   - Procure pela variável `CORS_ORIGIN`

4. **Atualizar o valor**
   - Substitua pelo valor: `https://SUA-URL-DO-VERCEL.vercel.app`
   - **Exemplo**: Se sua URL do Vercel for `https://clinica-numero-3-2s7f.vercel.app`
   - Então use: `https://clinica-numero-3-2s7f.vercel.app`
   - **IMPORTANTE**: 
     - ✅ Use `https://`
     - ✅ Sem barra no final
     - ✅ Sem `/dashboard` ou qualquer path

5. **Salvar**
   - Clique em "Save" ou "Salvar"
   - Railway fará redeploy automaticamente (aguarde alguns minutos)

---

### 3️⃣ **Testar Tudo**

#### ✅ Testar Backend (Railway)
- Acesse: `https://clinica-numero-3-production.up.railway.app/health`
- Deve retornar: `{"status":"ok","timestamp":"..."}`

#### ✅ Testar Frontend (Vercel)
- Acesse sua URL do Vercel (ex: `https://clinica-numero-3-2s7f.vercel.app`)
- O site deve carregar normalmente

#### ✅ Testar Formulário de Agendamento
- Preencha e envie o formulário
- Verifique se funciona (deve enviar para a API)

#### ✅ Testar Admin
- Acesse: `https://SUA-URL-DO-VERCEL.vercel.app/dashboard`
- Login:
  - Email: `admin@clinica.com`
  - Senha: `admin123`
- Verifique se carrega os dados

---

## 🐛 Troubleshooting

### Erro: "CORS policy" no navegador
- **Solução**: Verifique se `CORS_ORIGIN` no Railway está correto
- Formato correto: `https://seu-site.vercel.app` (sem barra final)
- Aguarde o redeploy do Railway (pode levar 2-3 minutos)

### Erro: "Failed to fetch" ou "Network Error"
- **Verifique**: A URL da API em `config.js` está correta?
- **Teste**: Acesse `https://clinica-numero-3-production.up.railway.app/health` no navegador
- **Deve retornar**: `{"status":"ok"}`

### Admin não carrega dados
- Abra o Console do navegador (F12 → Console)
- Verifique se há erros
- Verifique se a URL da API está correta

---

## 📋 Checklist Final

- [ ] Copiar URL do Vercel
- [ ] Atualizar `CORS_ORIGIN` no Railway com URL do Vercel
- [ ] Aguardar redeploy do Railway (2-3 minutos)
- [ ] Testar: Backend `/health` funciona
- [ ] Testar: Site carrega no Vercel
- [ ] Testar: Formulário de agendamento funciona
- [ ] Testar: Admin carrega dados

---

## 🎉 Pronto!

Depois de atualizar o CORS e testar, seu site estará 100% funcional!

**URLs Finais:**
- 🖥️ **Frontend**: `https://sua-url.vercel.app`
- 🔧 **Backend**: `https://clinica-numero-3-production.up.railway.app`
- 👨‍💼 **Admin**: `https://sua-url.vercel.app/dashboard`

