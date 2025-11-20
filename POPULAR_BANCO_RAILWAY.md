# 🌱 Como Popular o Banco de Dados no Railway

## 🎯 Problema

Os tratamentos não aparecem porque o banco de dados está vazio. É necessário executar o seed para popular os dados.

---

## ✅ Solução Rápida

### **Opção 1: Via Shell do Railway (Recomendado)**

1. **Acesse o Railway Dashboard**
   - Vá para https://railway.app
   - Clique no seu projeto

2. **Abra o Shell**
   - Vá para "Deployments" (Implantações)
   - Clique no último deploy (qualquer um)
   - Clique nos **três pontos (...)** ao lado do deploy
   - Clique em **"Open Shell"** ou **"Shell"**

3. **Execute o comando:**
   ```bash
   npx prisma db seed
   ```

   Ou execute o setup completo:
   ```bash
   npm run railway:setup
   ```

4. **Aguarde a conclusão**
   - Você verá mensagens como:
     - `✅ Usuário admin criado`
     - `✅ 4 tratamentos criados`
     - `✅ 5 avaliações criadas`

---

### **Opção 2: Via Terminal Local (Mais Difícil)**

Se você tiver o `railway` CLI instalado:

```bash
railway shell
npx prisma db seed
```

---

## 🔍 Verificar se Funcionou

1. **No Railway**, verifique os logs do último deploy
   - Deve aparecer logs do seed executado

2. **No seu site**, recarregue a página
   - Os tratamentos devem aparecer agora

3. **Teste a API diretamente:**
   - Acesse: `https://clinica-numero-3-production.up.railway.app/api/treatments?active=true`
   - Deve retornar uma lista de tratamentos

---

## 📝 O que o Seed Cria

O seed cria:

- **2 usuários admin:**
  - `admin@clinica.com` / senha: `admin123`
  - `admin@odontoazul.com` / senha: `admin123`

- **4 tratamentos:**
  - Ortodontia Digital
  - Estética Avançada
  - Implantodontia Guiada
  - Odontopediatria

- **5 avaliações:**
  - 3 aprovadas (aparecem no site)
  - 2 pendentes (aparecem no admin)

- **Informações da clínica:**
  - Endereço, telefone, email, etc.

---

## ❌ Se Der Erro

Se der erro ao executar o seed:

1. **Verifique se o banco está conectado:**
   ```bash
   npx prisma migrate status
   ```

2. **Execute as migrações primeiro:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Gere o Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Tente o seed novamente:**
   ```bash
   npx prisma db seed
   ```

---

## 🔗 Links Úteis

- [Como acessar o Shell do Railway](./INSTRUCOES_SHELL_RAILWAY.md)

