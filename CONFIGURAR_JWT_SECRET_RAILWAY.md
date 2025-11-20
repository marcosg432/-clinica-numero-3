# 🔐 Como Configurar JWT_SECRET no Railway

## ⚠️ Problema Atual

O erro **"JWT secret não configurado"** ocorre porque a variável de ambiente `JWT_SECRET` não está configurada no Railway.

---

## ✅ Solução: Configurar JWT_SECRET no Railway

### **Passo 1: Acessar o Railway**
1. Acesse: https://railway.app
2. Faça login na sua conta
3. Vá no projeto: **clinica-numero-3**

### **Passo 2: Adicionar Variável de Ambiente**
1. No projeto, clique no serviço **Backend** (ou o serviço que está rodando)
2. Clique na aba **"Variables"** (Variáveis)
3. Clique em **"+ New Variable"** (Nova Variável)
4. Configure:
   - **Nome (Key):** `JWT_SECRET`
   - **Valor (Value):** Gere uma string aleatória segura (veja abaixo)
5. Clique em **"Add"** (Adicionar)

### **Passo 3: Gerar uma String Segura para JWT_SECRET**

Você pode usar um dos métodos abaixo:

#### **Opção 1: Usar o Node.js (Terminal)**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### **Opção 2: Usar um Gerador Online**
- Acesse: https://generate-secret.vercel.app/64
- Copie a string gerada

#### **Opção 3: Usar este comando no PowerShell (Windows)**
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Exemplo de JWT_SECRET válido:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6
```

### **Passo 4: Redeploy Automático**
- O Railway detecta mudanças nas variáveis de ambiente
- Um novo deploy será iniciado automaticamente
- Aguarde 1-2 minutos para o deploy finalizar

---

## 🔍 Verificar se Funcionou

### **1. Verificar nos Logs do Railway**
1. No projeto Railway, clique em **"Deployments"** (Deployments)
2. Clique no último deploy
3. Clique em **"View Logs"** (Ver Logs)
4. Procure por:
   - ✅ `Servidor rodando na porta XXXX`
   - ✅ `Conexão com banco de dados estabelecida`
   - Sem erros de `JWT secret não configurado`

### **2. Testar o Login**
1. Acesse: `https://clinica-numero-3-sxvs-git-main-marcosg432s-projects.vercel.app/public/admin-login.html`
2. Email: `admin@clinica.com`
3. Senha: `admin123`
4. Clique em **"Entrar"**

Se ainda houver erro, verifique os logs do Railway para mais detalhes.

---

## 📝 Variáveis de Ambiente Importantes no Railway

Além do `JWT_SECRET`, certifique-se de que estas variáveis estão configuradas:

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `DATABASE_URL` | URL de conexão PostgreSQL | ✅ Sim (Railway geralmente configura automaticamente) |
| `JWT_SECRET` | Chave secreta para tokens JWT | ✅ Sim |
| `JWT_EXPIRES_IN` | Tempo de expiração do token (padrão: `7d`) | ❌ Opcional |
| `NODE_ENV` | Ambiente (padrão: `production`) | ❌ Opcional |
| `PORT` | Porta do servidor (Railway configura automaticamente) | ✅ Sim (Railway configura) |

---

## 🚨 Importante

- **Nunca compartilhe** o `JWT_SECRET` publicamente
- **Use valores diferentes** para desenvolvimento e produção
- **O JWT_SECRET** deve ter pelo menos 32 caracteres (recomendado: 64+ caracteres)
- **Após adicionar** a variável, o Railway faz deploy automaticamente

---

## ✅ Resumo Rápido

1. Railway → Projeto → Serviço → **"Variables"**
2. **"+ New Variable"** → Nome: `JWT_SECRET` → Valor: (string aleatória segura)
3. **Salvar** → Aguardar deploy (1-2 minutos)
4. **Testar login** novamente

---

**Pronto!** Após configurar o `JWT_SECRET`, o erro deve ser resolvido e você conseguirá fazer login.

