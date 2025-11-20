# 🌐 Como Tornar o Site Público no Vercel (Sem Login)

## ❌ Problema

O Vercel está pedindo login para visualizar o site porque os **Preview Deployments** (deploys de preview) têm proteção automática ativada por padrão.

## ✅ Soluções

### **Solução 1: Desativar Proteção de Preview (Recomendado)**

1. **Acesse o Vercel Dashboard**
   - Vá para https://vercel.com
   - Faça login

2. **Selecione seu projeto**
   - Clique no projeto `clinica-numero-3` (ou o nome do seu projeto)

3. **Vá para "Settings" (Configurações)**
   - Clique na aba "Settings" no topo

4. **Encontre "Deployment Protection"**
   - Role até a seção "Deployment Protection"
   - Ou procure por "Preview Deployment Protection"

5. **Desative a proteção de preview**
   - Encontre a opção "Protect Preview Deployments" ou similar
   - Desative/Mude para "Off" ou "Disabled"
   - **Salve** as alterações

6. **Teste**
   - Acesse o site em outro dispositivo (sem estar logado)
   - Deve funcionar agora!

---

### **Solução 2: Usar o Domínio de Produção**

Se você configurou um domínio de produção no Vercel:

1. **Configure o domínio de produção**
   - Vercel → Projeto → "Settings" → "Domains"
   - Adicione seu domínio personalizado (ex: `www.odontoazul.com`)

2. **A URL de produção não pede login**
   - URLs de produção (`*.vercel.app` principal) são públicas por padrão
   - Apenas preview deployments pedem login

---

### **Solução 3: Fazer Deploy na Branch de Produção**

O Vercel identifica a branch `main` (ou `master`) como produção:

1. **Certifique-se de que está na branch `main`**
   ```bash
   git branch
   ```

2. **Faça push para `main`**
   ```bash
   git push origin main
   ```

3. **A URL principal de produção será pública**
   - `https://clinica-numero-3-sxvs.vercel.app` (sem o `-git-main-...`)

---

## 🔍 Como Identificar URLs

### **URL de Preview (pode pedir login):**
```
https://clinica-numero-3-sxvs-git-main-marcosg432s-projects.vercel.app
```
- Contém `-git-` na URL
- São criadas para cada branch/deploy
- Podem ter proteção

### **URL de Produção (pública):**
```
https://clinica-numero-3-sxvs.vercel.app
```
- URL mais curta
- Sem `-git-` no nome
- Sempre pública

---

## 📝 Passo a Passo Rápido (Solução 1)

1. ✅ Vercel.com → Login
2. ✅ Seu Projeto → "Settings"
3. ✅ "Deployment Protection" → Desativar "Preview Protection"
4. ✅ Salvar
5. ✅ Testar em outro dispositivo

---

## ⚠️ Importante

- **Preview Deployments** são úteis para testar antes de publicar
- Se desativar a proteção, qualquer pessoa com o link poderá ver os previews
- A **produção** sempre é pública (mesmo com proteção de preview ativa)

---

## ❓ Ainda não funcionou?

Se ainda estiver pedindo login após desativar:

1. **Verifique se salvou as configurações**
2. **Aguarde alguns minutos** (pode levar um tempo para aplicar)
3. **Limpe o cache do navegador** (Ctrl+Shift+R)
4. **Tente acessar em modo anônimo/privado**
5. **Verifique se está usando a URL de produção** (não a de preview)

