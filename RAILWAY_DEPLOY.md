# 🚂 Guia Completo de Deploy no Railway

Este guia atualizado fornece todas as configurações necessárias para fazer deploy do projeto no Railway.

## ✅ O que já está configurado

- ✅ `railway.json` - Configuração do Railway
- ✅ `nixpacks.toml` - Build configurado com Node.js 20
- ✅ `scripts/prepare-railway.js` - Script automático para preparar schema PostgreSQL
- ✅ `prisma/schema.prisma.production` - Schema otimizado para PostgreSQL
- ✅ Scripts no `package.json` para deploy automatizado
- ✅ `.railwayignore` - Arquivos ignorados no deploy

---

## 🎯 Passo a Passo - Deploy no Railway

### PARTE 1: Criar Projeto no Railway

1. **Acesse o Railway**
   - Vá para https://railway.app
   - Faça login com sua conta GitHub

2. **Criar Novo Projeto**
   - Clique em **"New Project"**
   - Selecione **"Deploy from GitHub repo"**
   - Escolha seu repositório
   - Railway começará a fazer deploy automaticamente

3. **Aguardar Primeiro Build**
   - O primeiro build pode falhar (isso é normal se o PostgreSQL ainda não estiver configurado)
   - Aguarde o build terminar

---

### PARTE 2: Adicionar Banco de Dados PostgreSQL

1. **Adicionar PostgreSQL**
   - No projeto Railway, clique em **"+ New"**
   - Selecione **"Database"**
   - Escolha **"Add PostgreSQL"**
   - Aguarde a criação (pode levar alguns minutos)

2. **Verificar Variável DATABASE_URL**
   - Railway cria automaticamente a variável `DATABASE_URL`
   - Vá em **"Variables"** para confirmar que está configurada
   - A URL deve começar com `postgresql://` ou `postgres://`

---

### PARTE 3: Configurar Variáveis de Ambiente

No projeto Railway, vá em **"Variables"** e adicione:

```env
# Ambiente
NODE_ENV=production
PORT=3000

# Autenticação JWT
JWT_SECRET=<GERE_UMA_CHAVE_FORTE>
JWT_EXPIRES_IN=7d

# CORS (será atualizado depois com a URL do frontend)
CORS_ORIGIN=https://seu-projeto.vercel.app

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-app-password-gmail
EMAIL_FROM=Clínica Odonto Azul <noreply@odontoazul.com>

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANTE:**

- **JWT_SECRET**: Gere uma chave forte:
  ```bash
  # No terminal (Linux/Mac):
  openssl rand -base64 32
  
  # Ou no PowerShell (Windows):
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
  ```

- **EMAIL_PASS**: Use uma "App Password" do Gmail:
  1. Google Account → Segurança
  2. Ative "Verificação em 2 etapas"
  3. Vá em "Senhas de app"
  4. Gere uma nova senha de app para "Email"
  5. Use essa senha (não a senha normal do Gmail)

- **CORS_ORIGIN**: Você atualizará isso depois com a URL do frontend

---

### PARTE 4: Executar Setup Inicial do Banco

Após configurar as variáveis, você precisa executar o setup inicial:

1. **Abrir Shell no Railway**
   - No projeto Railway, vá em **"Deployments"**
   - Clique nos **"..."** do último deploy
   - Selecione **"Open Shell"**

2. **Executar Setup**
   - Execute o script de setup:
   ```bash
   npm run railway:setup
   ```
   
   Ou execute manualmente:
   ```bash
   # Preparar schema para PostgreSQL
   node scripts/prepare-railway.js
   
   # Gerar Prisma Client
   npx prisma generate
   
   # Executar migrações
   npx prisma migrate deploy
   
   # Popular banco com dados iniciais
   npx prisma db seed
   ```

3. **Verificar se funcionou**
   - Verifique os logs para confirmar que:
     - ✅ Schema foi preparado
     - ✅ Prisma Client foi gerado
     - ✅ Migrações foram executadas
     - ✅ Seed foi executado

---

### PARTE 5: Obter URL da API

1. **Gerar Domínio**
   - No projeto Railway, vá em **"Settings"**
   - Em **"Networking"**, ative **"Generate Domain"**
   - Railway criará um domínio automático (ex: `seu-projeto.up.railway.app`)

2. **Copiar URL**
   - Copie a URL completa (ex: `https://seu-projeto.up.railway.app`)
   - **Esta é sua URL da API!** Anote ela.

3. **Testar API**
   - Acesse: `https://seu-projeto.up.railway.app/health`
   - Deve retornar: `{"status":"ok","timestamp":"..."}`

---

## 🔄 Processo Automático de Build

O Railway agora está configurado para:

1. **Detectar PostgreSQL automaticamente** - O script `prepare-railway.js` detecta se `DATABASE_URL` é PostgreSQL
2. **Ajustar schema automaticamente** - Troca o schema para PostgreSQL durante o build
3. **Gerar Prisma Client** - Gera o client automaticamente
4. **Build do TypeScript** - Compila o código TypeScript

**O que você precisa fazer manualmente apenas uma vez:**
- Executar `npm run railway:setup` no shell do Railway (após adicionar PostgreSQL)
- Isso criará as tabelas e populará o banco

**Próximos deploys:**
- Se você adicionar novas migrações do Prisma, elas serão aplicadas automaticamente no build

---

## 📝 Scripts Disponíveis

No `package.json`, os seguintes scripts foram adicionados:

- `npm run railway:prepare` - Prepara schema para PostgreSQL
- `npm run railway:setup` - Setup completo (prepare + generate + migrate + seed)
- `npm run build:railway` - Build otimizado para Railway

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se o PostgreSQL foi criado no Railway
- Verifique se `DATABASE_URL` está configurada em Variables
- Execute `npx prisma migrate deploy` no shell do Railway

### Erro: "Schema not found" ou erro de Prisma
- Execute `npm run railway:setup` no shell do Railway
- Verifique se o script `prepare-railway.js` está sendo executado no build

### Erro: "CORS policy"
- Adicione a URL do frontend em `CORS_ORIGIN` nas variáveis do Railway
- Formato: `https://seu-site.vercel.app` (sem barra no final)

### Build falha no Railway
- Verifique os logs do build no Railway
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se o Node.js 20 está disponível (configurado no `nixpacks.toml`)

### Migrações não são aplicadas
- Execute manualmente: `npx prisma migrate deploy` no shell do Railway
- Verifique se as migrações existem na pasta `prisma/migrations`

---

## ✅ Checklist Final

- [ ] Railway: Projeto criado
- [ ] Railway: PostgreSQL adicionado
- [ ] Railway: Variáveis configuradas (todas)
- [ ] Railway: `npm run railway:setup` executado no shell
- [ ] Railway: Domínio gerado e URL copiada
- [ ] Railway: `/health` retorna OK
- [ ] Frontend: `config.js` atualizado com URL da API do Railway
- [ ] Frontend: Deploy realizado (Vercel ou outro)
- [ ] Railway: `CORS_ORIGIN` atualizado com URL do frontend
- [ ] Testado: Site carrega
- [ ] Testado: Formulários funcionam
- [ ] Testado: Admin funciona (`/dashboard`)

---

## 🎉 Pronto!

Seu backend está configurado no Railway! 

**Próximos passos:**
1. Configure o frontend (Vercel ou outro)
2. Atualize `CORS_ORIGIN` com a URL do frontend
3. Teste tudo end-to-end

**URLs importantes:**
- Backend: `https://seu-projeto.up.railway.app`
- Health Check: `https://seu-projeto.up.railway.app/health`
- API Docs: `https://seu-projeto.up.railway.app/api-docs`

---

## 📚 Referências

- Railway Docs: https://docs.railway.app
- Prisma Docs: https://www.prisma.io/docs
- Nixpacks Docs: https://nixpacks.com/docs

