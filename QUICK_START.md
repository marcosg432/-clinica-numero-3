# 🚀 Início Rápido

## Instalação e Execução em 5 minutos

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados

**Opção A: PostgreSQL Local**
- Instale PostgreSQL
- Crie banco: `createdb clinica_odonto`
- Configure `DATABASE_URL` no `.env`

**Opção B: Docker (Mais Fácil)**
```bash
docker compose up -d postgres
```

### 3. Configurar Variáveis de Ambiente

Copie `env.example.txt` para `.env` e configure:

```bash
# Mínimo necessário para começar:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/clinica_odonto?schema=public"
JWT_SECRET=qualquer-chave-secreta-para-desenvolvimento
```

### 4. Configurar Banco

```bash
# Gerar Prisma Client
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Popular com dados iniciais
npm run prisma:seed
```

### 5. Iniciar Servidor

```bash
npm run dev
```

✅ **Servidor rodando em:** `http://localhost:3000`
✅ **Swagger:** `http://localhost:3000/api-docs`
✅ **Health Check:** `http://localhost:3000/health`

## Credenciais Padrão (Após Seed)

- **Email:** `admin@odontoazul.com`
- **Senha:** `admin123`

## Testar API

### 1. Fazer Login
```bash
POST http://localhost:3000/api/admin/login
Content-Type: application/json

{
  "email": "admin@odontoazul.com",
  "password": "admin123"
}
```

### 2. Usar Token nas Requisições
```bash
Authorization: Bearer <seu-token>
```

### 3. Testar Endpoint Público
```bash
GET http://localhost:3000/api/home
```

## Docker Compose (Tudo Junto)

```bash
# Subir tudo (app + banco)
docker compose up -d

# Ver logs
docker compose logs -f app

# Parar
docker compose down
```

## Próximos Passos

1. Leia o [README.md](./README.md) para mais detalhes
2. Consulte [DOCUMENTACAO_DO_SISTEMA.md](./DOCUMENTACAO_DO_SISTEMA.md) para documentação completa
3. Explore a documentação Swagger em `/api-docs`

---

**Problemas?** Verifique:
- PostgreSQL está rodando?
- Variáveis de ambiente configuradas?
- Migrations executadas?
- Porta 3000 está livre?








