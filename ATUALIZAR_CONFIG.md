# ⚙️ Como Atualizar config.js com URL da API

## 📝 Passo a Passo

### 1. Obter URL da API do Railway

Após fazer deploy no Railway:
1. Vá em **Settings** → **Networking**
2. Ative **"Generate Domain"**
3. Copie a URL (ex: `https://seu-projeto.up.railway.app`)

### 2. Atualizar config.js no GitHub

1. Acesse: https://github.com/marcosg432/-clinica-numero-3
2. Navegue até: `public/config.js`
3. Clique no ícone de **lápis** (editar)
4. Substitua o conteúdo por:

```javascript
// Configuração da API - Produção
window.API_BASE = 'https://SEU-PROJETO.up.railway.app/api';
```

**Substitua `SEU-PROJETO.up.railway.app` pela URL real do Railway!**

5. Role até o final da página
6. Em **"Commit changes"**, escreva: `Atualizar URL da API para produção`
7. Clique em **"Commit changes"**

### 3. Vercel fará deploy automático

Após o commit, o Vercel detectará a mudança e fará um novo deploy automaticamente!

---

## ✅ Verificar se Funcionou

1. Acesse seu site na Vercel
2. Abra o console do navegador (F12)
3. Digite: `window.API_BASE`
4. Deve mostrar a URL da API do Railway

---

**Pronto! 🚀**



