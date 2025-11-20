# 🖥️ Como Acessar o Shell do Railway

## 📍 Método 1: Via Menu do Deploy (Mais Comum)

1. **Acesse o Railway Dashboard**
   - Vá para https://railway.app
   - Faça login
   - Clique no seu projeto `-clínica-número-3`

2. **Vá para a aba "Implantações" (Deployments)**
   - Clique na aba "Implantações" no topo

3. **Encontre um deploy** (pode ser um que falhou ou que está em andamento)

4. **Clique nos três pontos verticais (...)** ao lado do deploy
   - Deve aparecer um menu dropdown

5. **Procure por "Open Shell" ou "Abrir Shell" ou "Shell"**
   - Clique nessa opção
   - Isso abrirá um terminal dentro do ambiente Railway

6. **Execute o comando:**
   ```bash
   npm run railway:setup
   ```

---

## 📍 Método 2: Via Configurações do Serviço

1. **No projeto Railway, vá para "Configurações" (Settings)**
   - Clique na aba "Configurações" no topo

2. **Procure por uma seção "Shell" ou "Terminal"**
   - Algumas vezes há um botão direto para abrir o shell

---

## 📍 Método 3: Se o Shell não aparecer no menu

Se você não encontrar a opção "Open Shell" no menu:

1. **Certifique-se de que o deploy foi criado**
   - Mesmo que tenha falhado, o shell deve estar disponível

2. **Tente atualizar a página (F5)**
   - Às vezes a interface precisa ser atualizada

3. **Verifique se você está na aba correta**
   - Deve estar na aba "Implantações" ou "Deployments"

---

## ⚠️ Importante

- O shell só fica disponível **após o deploy ser criado** (mesmo que falhe)
- Você precisa ter permissão de administrador no projeto Railway
- O shell roda **dentro do ambiente Railway**, não no seu computador local

---

## 🔧 Comandos para Executar no Shell

Depois de abrir o shell, execute:

```bash
# Setup completo (recomendado)
npm run railway:setup

# Ou manualmente, passo a passo:
node scripts/prepare-railway.js
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

---

## 📸 Onde Procurar

No Railway, você verá algo assim:

```
[Deploy mais recente]        ... (três pontos) → [Abrir Shell]
```

Ou:

```
Deployments
  └─ "Melhorar a verificação..." 
       └─ [Botão com três pontos] → [Open Shell]
```

---

## ❓ Ainda não encontrou?

Se ainda não conseguir encontrar:
1. Tire uma captura de tela do que você está vendo
2. Verifique se o deploy já foi criado (aparece na lista)
3. Tente clicar diretamente no nome do deploy para ver mais opções

