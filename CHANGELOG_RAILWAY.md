# 📋 Changelog - Configuração Railway

## ✅ Configurações Implementadas

### 1. Scripts de Deploy Automatizado

#### `scripts/prepare-railway.js`
- Script Node.js que detecta automaticamente PostgreSQL pela `DATABASE_URL`
- Troca o `schema.prisma` para PostgreSQL automaticamente
- Usa o `schema.prisma.production` como base quando disponível
- Faz backup do schema original

#### `scripts/railway-setup.sh`
- Script bash para setup inicial no Railway
- Executa: prepare → generate → migrate → seed
- Facilita a configuração inicial do banco

---

### 2. Configurações de Build

#### `railway.json`
- ✅ Builder: NIXPACKS
- ✅ Build command: `npm run railway:prepare && npm run build && npx prisma generate`
- ✅ Start command: `npm run start`
- ✅ Health check configurado: `/health`
- ✅ Restart policy: ON_FAILURE (máximo 10 tentativas)

#### `nixpacks.toml`
- ✅ Node.js 20 (atualizado de 18)
- ✅ Instalação: `npm ci`
- ✅ Build: prepara schema → build → generate
- ✅ Start: `npm run start`

---

### 3. Scripts no package.json

Novos scripts adicionados:

```json
{
  "build:railway": "Script de build otimizado para Railway",
  "railway:prepare": "Prepara schema para PostgreSQL",
  "railway:setup": "Setup completo (prepare + generate + migrate + seed)"
}
```

---

### 4. Schema do Prisma para Produção

#### `prisma/schema.prisma.production`
- ✅ Provider: PostgreSQL
- ✅ Tipos corretos para PostgreSQL (arrays, text, etc)
- ✅ Compatível com o schema original
- ✅ Campos alinhados: `heroImage`, `honeypot`, `whatsapp`, `instagram`, `facebook`

---

### 5. Arquivo .railwayignore

- ✅ Lista de arquivos ignorados no deploy
- ✅ Reduz tamanho do deploy
- ✅ Ignora node_modules, dist, .env locais, etc

---

### 6. Documentação

#### `RAILWAY_DEPLOY.md`
- ✅ Guia completo e atualizado de deploy no Railway
- ✅ Passo a passo detalhado
- ✅ Troubleshooting
- ✅ Checklist final

---

## 🔄 Como Funciona

### Processo Automático de Build

1. **Railway detecta o repositório**
   - Usa `nixpacks.toml` ou `railway.json`

2. **Fase de Instalação**
   - Executa `npm ci` para instalar dependências

3. **Fase de Build**
   - Executa `npm run railway:prepare`
     - Detecta se `DATABASE_URL` é PostgreSQL
     - Se for PostgreSQL, troca `schema.prisma` para usar PostgreSQL
   - Executa `npm run build` (compila TypeScript)
   - Executa `npx prisma generate` (gera Prisma Client)

4. **Fase de Deploy**
   - Executa `npm run start` (inicia o servidor)
   - Railway monitora a saúde através de `/health`

### Setup Inicial Manual (apenas uma vez)

Após adicionar PostgreSQL no Railway, execute no shell:

```bash
npm run railway:setup
```

Isso:
1. Prepara schema para PostgreSQL
2. Gera Prisma Client
3. Executa migrações (`prisma migrate deploy`)
4. Popula banco com dados iniciais (`prisma db seed`)

---

## 📝 Próximos Passos

1. **Criar projeto no Railway**
   - Acesse https://railway.app
   - Conecte seu repositório GitHub

2. **Adicionar PostgreSQL**
   - No projeto: "+ New" → "Database" → "Add PostgreSQL"

3. **Configurar Variáveis**
   - Adicione todas as variáveis de ambiente necessárias
   - Veja `RAILWAY_DEPLOY.md` para lista completa

4. **Executar Setup**
   - Deployments → "..." → "Open Shell"
   - Execute: `npm run railway:setup`

5. **Gerar Domínio**
   - Settings → Networking → "Generate Domain"
   - Copie a URL da API

6. **Configurar Frontend**
   - Atualize `public/config.js` com a URL da API do Railway
   - Faça deploy do frontend (Vercel ou outro)

7. **Atualizar CORS**
   - Volte no Railway → Variables
   - Atualize `CORS_ORIGIN` com a URL do frontend

---

## 🎯 Benefícios

✅ **Deploy Automatizado**: Schema detectado automaticamente  
✅ **Menos Erros**: Scripts garantem configuração correta  
✅ **Documentação Completa**: Guias passo a passo  
✅ **Setup Rápido**: Um comando para configurar tudo  
✅ **Manutenção Fácil**: Processo claro e documentado  

---

## ⚠️ Notas Importantes

- O schema SQLite permanece para desenvolvimento local
- O schema PostgreSQL é usado automaticamente em produção
- Execute `npm run railway:setup` apenas uma vez (após adicionar PostgreSQL)
- Próximos deploys aplicam migrações automaticamente
- Sempre verifique os logs do Railway se algo der errado

---

## 🔗 Arquivos Relacionados

- `railway.json` - Configuração do Railway
- `nixpacks.toml` - Configuração do build
- `scripts/prepare-railway.js` - Script de preparação
- `scripts/railway-setup.sh` - Script de setup
- `prisma/schema.prisma.production` - Schema para PostgreSQL
- `.railwayignore` - Arquivos ignorados
- `RAILWAY_DEPLOY.md` - Guia completo de deploy

