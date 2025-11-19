# 🦷 Clínica Odonto Azul - Sistema Completo

Sistema completo de gestão para clínica odontológica com frontend moderno e backend robusto.

## 🚀 Tecnologias

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Design responsivo e moderno
- Paleta de cores premium (Azul/Cinza/Branco)

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- Multer + Sharp (upload de imagens)
- Nodemailer (envio de emails)
- Swagger/OpenAPI (documentação)

## 📁 Estrutura do Projeto

```
├── src/                    # Código fonte do backend
│   ├── controllers/        # Controladores da API
│   ├── services/          # Lógica de negócio
│   ├── routes/            # Rotas da API
│   ├── middleware/        # Middlewares (auth, validação, etc)
│   ├── config/            # Configurações
│   └── utils/             # Utilitários
├── prisma/                # Schema e migrações do banco
├── public/                # Páginas do admin
├── images/                # Imagens do site
├── uploads/               # Uploads de imagens
├── index.html             # Página inicial
├── sobre.html             # Página sobre
├── tratamentos.html       # Página de tratamentos
├── agendamento.html       # Página de agendamento
└── package.json           # Dependências
```

## 🛠️ Instalação Local

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- PostgreSQL (para produção) ou SQLite (para desenvolvimento)

### Passos

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd copia_de_numero_3
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example.txt .env
# Edite o .env com suas configurações
```

4. **Configure o banco de dados**
```bash
# Gerar Prisma Client
npx prisma generate

# Executar migrações
npx prisma migrate dev

# Popular banco com dados iniciais
npm run prisma:seed
```

5. **Inicie o servidor**
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 🌐 Deploy

### Railway (Backend)
- Veja o guia completo em `README_DEPLOY.md`
- Configuração em `railway.json`

### Vercel (Frontend)
- Veja o guia completo em `README_DEPLOY.md`
- Configuração em `vercel.json`

## 📚 Documentação

- **Deploy**: `README_DEPLOY.md` - Guia completo de hospedagem
- **Deploy Rápido**: `DEPLOY.md` - Versão resumida
- **Revisão**: `REVISAO_COMPLETA.md` - Relatório de revisão
- **Acesso Admin**: `GUIA_ACESSO_ADMIN.md` - Como acessar o painel

## 🔐 Credenciais Padrão

**Admin:**
- Email: `admin@clinica.com`
- Senha: `admin123`

**Admin Alternativo:**
- Email: `admin@odontoazul.com`
- Senha: `admin123`

⚠️ **IMPORTANTE**: Altere essas credenciais em produção!

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor em modo desenvolvimento
npm run build        # Compila TypeScript
npm run start        # Inicia servidor em produção
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Executa migrações
npm run prisma:seed      # Popula banco com dados iniciais
npm test             # Executa testes
```

## 🎨 Características

- ✅ Design moderno e responsivo
- ✅ SEO otimizado
- ✅ Acessibilidade (WCAG AA)
- ✅ Segurança (XSS, CSRF, Rate Limiting)
- ✅ Painel administrativo completo
- ✅ Sistema de agendamentos
- ✅ Gestão de tratamentos
- ✅ Sistema de avaliações
- ✅ Upload de imagens
- ✅ Envio de emails

## 📄 Licença

MIT

## 👨‍💻 Desenvolvido com

- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- HTML5/CSS3/JavaScript

---

**Clínica Odonto Azul** - Transformando sorrisos com tecnologia e carinho 🦷
