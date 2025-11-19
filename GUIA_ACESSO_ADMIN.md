# 🔐 Guia de Acesso ao Painel Admin

## 📋 Credenciais Padrão

**Email:** `admin@odontoazul.com`  
**Senha:** `admin123`

---

## 🌐 URLs de Acesso

### Dashboard Web
```
http://localhost:3000/dashboard
```

### API de Login
```
POST http://localhost:3000/api/admin/login
```

**Body (JSON):**
```json
{
  "email": "admin@odontoazul.com",
  "password": "admin123"
}
```

### Documentação Swagger
```
http://localhost:3000/api-docs
```

---

## 🚀 Como Acessar

### 1. Certifique-se de que o servidor está rodando

```bash
npm run dev
```

### 2. Certifique-se de que o banco de dados está configurado

Se ainda não executou o seed:
```bash
npm run prisma:seed
```

### 3. Acesse o Dashboard

Abra no navegador:
```
http://localhost:3000/dashboard
```

### 4. Faça Login

Use as credenciais:
- **Email:** `admin@odontoazul.com`
- **Senha:** `admin123`

---

## 📝 Funcionalidades do Painel Admin

### ✅ Tratamentos (CRUD)
- Ver todos os tratamentos
- Criar novo tratamento
- Editar tratamento existente
- Deletar tratamento
- Upload de imagens

### ✅ Agendamentos
- Ver todos os agendamentos
- Confirmar agendamento
- Cancelar agendamento
- Ver detalhes do agendamento

### ✅ Avaliações
- Ver avaliações pendentes
- Aprovar avaliação
- Deletar avaliação

### ✅ Upload de Imagens
- Upload de imagens para tratamentos
- Otimização automática de imagens

---

## 🔧 Testando via API (Postman/Insomnia)

### Login
```http
POST http://localhost:3000/api/admin/login
Content-Type: application/json

{
  "email": "admin@odontoazul.com",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Administrador",
    "email": "admin@odontoazul.com",
    "role": "super_admin"
  }
}
```

### Usar o Token nas Requisições

Adicione no header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

### Exemplo: Listar Tratamentos
```http
GET http://localhost:3000/api/admin/treatments
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## ⚠️ Troubleshooting

### Erro: "Usuário não encontrado"
Execute o seed novamente:
```bash
npm run prisma:seed
```

### Erro: "Servidor não está rodando"
Inicie o servidor:
```bash
npm run dev
```

### Erro: "Banco de dados não conectado"
Verifique o arquivo `.env` e certifique-se de que o DATABASE_URL está correto.

---

## 🔒 Segurança

⚠️ **IMPORTANTE:** Altere a senha padrão em produção!

Para alterar a senha, você pode:
1. Usar o Prisma Studio: `npm run prisma:studio`
2. Ou criar um script de atualização de senha





