# 📝 Como Criar a Variável CORS_ORIGIN no Railway

## 🎯 Passo a Passo Detalhado

Você está na tela **"Variables"** do Railway. Veja as opções:

### Opção 1: Criar Nova Variável (+ New Variable)

1. **Clique no botão "+ New Variable"** (botão roxo/azul no topo direito)

2. **Preencha os campos:**
   - **Name (Nome)**: `CORS_ORIGIN`
   - **Value (Valor)**: `https://clinica-numero-3-sxvs.vercel.app`
   - **IMPORTANTE**: 
     - Use `https://` no início
     - Sem barra `/` no final
     - Sem espaços extras

3. **Clique em "Add" ou "Save"**

4. **Pronto!** Railway fará redeploy automaticamente

---

### Opção 2: Usar Raw Editor (Mais Rápido)

1. **Clique no botão "Raw Editor"** (botão com ícone `{}` no topo)

2. **Você verá algo assim:**
   ```
   PORT=3000
   DATABASE_URL=postgresql://...
   NODE_ENV=production
   ```

3. **Adicione a linha no final:**
   ```
   CORS_ORIGIN=https://clinica-numero-3-sxvs.vercel.app
   ```

4. **Clique em "Save"**

5. **Pronto!** Railway fará redeploy automaticamente

---

### Opção 3: Se a Variável Já Existe

Se você ver `CORS_ORIGIN` na lista (pode estar nas "8 variables added by Railway"):

1. **Clique na variável `CORS_ORIGIN`**

2. **Edite o valor:**
   - Substitua pelo: `https://clinica-numero-3-sxvs.vercel.app`

3. **Salve**

---

## 📋 Checklist

- [ ] Variável `CORS_ORIGIN` criada
- [ ] Valor: `https://clinica-numero-3-sxvs.vercel.app`
- [ ] Formato correto (https://, sem barra final)
- [ ] Variável salva
- [ ] Aguardar redeploy do Railway (2-3 minutos)

---

## ⚠️ Formato Correto

✅ **CORRETO:**
```
CORS_ORIGIN=https://clinica-numero-3-sxvs.vercel.app
```

❌ **ERRADO:**
```
CORS_ORIGIN=https://clinica-numero-3-sxvs.vercel.app/  (com barra no final)
CORS_ORIGIN=clinica-numero-3-sxvs.vercel.app  (sem https://)
CORS_ORIGIN=https://clinica-numero-3-sxvs.vercel.app/dashboard  (com path)
```

---

## 🎉 Depois de Criar

Após criar/atualizar a variável:

1. **Aguarde 2-3 minutos** para o Railway fazer redeploy
2. **Teste o site** no Vercel: `https://clinica-numero-3-sxvs.vercel.app`
3. **Teste o admin**: `https://clinica-numero-3-sxvs.vercel.app/dashboard`

