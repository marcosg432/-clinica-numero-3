# 📘 Documentação Completa do Sistema - Clínica Odonto Azul Backend

## 📑 Índice

1. [Por que estas tecnologias?](#por-que-estas-tecnologias)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Banco de Dados](#banco-de-dados)
5. [Rotas e Endpoints](#rotas-e-endpoints)
6. [Sistema de Upload](#sistema-de-upload)
7. [Sistema de E-mails](#sistema-de-e-mails)
8. [Autenticação e Segurança](#autenticação-e-segurança)
9. [Como Rodar o Projeto](#como-rodar-o-projeto)
10. [Como Fazer Build](#como-fazer-build)
11. [Configuração de Ambiente](#configuração-de-ambiente)
12. [Como Adicionar Novos Tratamentos](#como-adicionar-novos-tratamentos)
13. [Como Escalar o Sistema](#como-escalar-o-sistema)
14. [Boas Práticas Aplicadas](#boas-práticas-aplicadas)
15. [Testes](#testes)
16. [Deploy em Produção](#deploy-em-produção)

---

## 🎯 Por que estas tecnologias?

### Node.js + TypeScript

**Escolha:** Node.js com TypeScript foi escolhido por:

- **Produtividade:** TypeScript oferece type-safety, autocomplete e detecção de erros em tempo de desenvolvimento
- **Ecossistema:** Node.js tem uma das maiores comunidades e bibliotecas disponíveis
- **Performance:** V8 engine é extremamente otimizado, ideal para APIs REST
- **Escalabilidade:** Suporta milhares de conexões simultâneas com I/O não-bloqueante
- **Manutenibilidade:** TypeScript facilita refatoração e manutenção de código grande

### Express.js

**Escolha:** Framework web minimalista e flexível:

- **Simplicidade:** API simples e intuitiva
- **Middleware:** Sistema de middlewares poderoso e extensível
- **Maturidade:** Framework mais usado em Node.js, com vasta documentação
- **Performance:** Leve e rápido, sem overhead desnecessário
- **Flexibilidade:** Permite escolher bibliotecas específicas para cada necessidade

### PostgreSQL + Prisma

**Escolha:** Banco relacional com ORM type-safe:

- **PostgreSQL:**
  - Banco de dados relacional robusto e confiável
  - Suporte a arrays nativos (útil para gallery, benefits)
  - ACID compliance garantido
  - Excelente performance para consultas complexas
  - Suporte a JSON quando necessário

- **Prisma:**
  - Type-safety end-to-end (do banco ao código)
  - Migrations automáticas e versionadas
  - Geração automática de tipos TypeScript
  - Query builder intuitivo
  - Prisma Studio para visualização de dados
  - Suporte a múltiplos bancos (fácil migração futura)

### JWT para Autenticação

**Escolha:** JSON Web Tokens:

- **Stateless:** Não requer sessões no servidor
- **Escalável:** Funciona perfeitamente em múltiplos servidores
- **Seguro:** Assinatura digital previne tampering
- **Padrão da indústria:** Amplamente adotado
- **Flexível:** Pode incluir claims customizados

### Multer + Sharp para Upload

**Escolha:** Combinação poderosa:

- **Multer:** Middleware padrão para upload de arquivos no Express
- **Sharp:** Biblioteca C++ otimizada para processamento de imagens
  - Redimensionamento eficiente
  - Compressão sem perda de qualidade visível
  - Suporte a múltiplos formatos
  - Performance superior a alternativas JavaScript

### Nodemailer para E-mails

**Escolha:** Biblioteca mais popular e confiável:

- **Compatibilidade:** Funciona com qualquer servidor SMTP
- **Templates:** Suporte a HTML e templates
- **Confiável:** Usado por milhões de projetos
- **Flexível:** Permite filas e retry automático

### Swagger/OpenAPI

**Escolha:** Documentação automática:

- **Padrão da indústria:** OpenAPI é o padrão universal
- **Interativo:** Interface web para testar endpoints
- **Automático:** Geração a partir de comentários no código
- **Atualização:** Sempre sincronizado com o código

### Jest para Testes

**Escolha:** Framework completo:

- **Zero config:** Funciona out-of-the-box
- **Cobertura:** Gera relatórios de cobertura automaticamente
- **Mocking:** Sistema de mocks poderoso
- **Snapshot:** Testes de snapshot para regressão
- **Supertest:** Integração perfeita para testes de API

---

## 🏗️ Arquitetura do Sistema

### Padrão Arquitetural: MVC + Service Layer

O sistema segue uma arquitetura em camadas bem definida:

```
┌─────────────────────────────────────┐
│         Cliente (Frontend)          │
└──────────────┬──────────────────────┘
               │ HTTP/REST
               ▼
┌─────────────────────────────────────┐
│         Express Server              │
│  ┌──────────────────────────────┐  │
│  │      Middlewares              │  │
│  │  - CORS                       │  │
│  │  - Helmet (Security)          │  │
│  │  - Rate Limiting              │  │
│  │  - Body Parser                │  │
│  └──────────────┬─────────────────┘  │
│                 ▼                     │
│  ┌──────────────────────────────┐  │
│  │      Routes                  │  │
│  │  - /api (públicas)           │  │
│  │  - /api/admin (protegidas)   │  │
│  └──────────────┬─────────────────┘  │
│                 ▼                     │
│  ┌──────────────────────────────┐  │
│  │      Controllers              │  │
│  │  - Validação de entrada      │  │
│  │  - Chamada de serviços       │  │
│  │  - Formatação de resposta    │  │
│  └──────────────┬─────────────────┘  │
│                 ▼                     │
│  ┌──────────────────────────────┐  │
│  │      Services                 │  │
│  │  - Lógica de negócio          │  │
│  │  - Regras de validação        │  │
│  │  - Orquestração               │  │
│  └──────────────┬─────────────────┘  │
│                 ▼                     │
│  ┌──────────────────────────────┐  │
│  │      Prisma ORM               │  │
│  │  - Queries type-safe          │  │
│  │  - Migrations                 │  │
│  └──────────────┬─────────────────┘  │
│                 ▼                     │
└─────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      PostgreSQL Database             │
└─────────────────────────────────────┘
```

### Fluxo de uma Requisição

1. **Cliente** faz requisição HTTP
2. **Middlewares** processam:
   - CORS verifica origem
   - Helmet adiciona headers de segurança
   - Rate Limiter verifica limites
   - Body Parser parseia JSON
3. **Router** direciona para rota correta
4. **Middleware de Autenticação** (se rota protegida):
   - Valida JWT token
   - Verifica permissões
5. **Middleware de Validação**:
   - Valida dados de entrada
   - Sanitiza inputs
6. **Controller**:
   - Recebe dados validados
   - Chama Service apropriado
   - Formata resposta
7. **Service**:
   - Executa lógica de negócio
   - Interage com banco via Prisma
   - Retorna dados processados
8. **Response** é enviada ao cliente

### Princípios Aplicados

- **Separation of Concerns:** Cada camada tem responsabilidade única
- **DRY (Don't Repeat Yourself):** Lógica reutilizável em services
- **Single Responsibility:** Cada função faz uma coisa bem feita
- **Dependency Injection:** Services injetados via imports
- **Error Handling Centralizado:** Middleware de erro único

---

## 📁 Estrutura de Pastas

```
clinica-odonto-azul-backend/
│
├── src/                          # Código fonte TypeScript
│   ├── config/                   # Configurações
│   │   ├── database.ts          # Cliente Prisma
│   │   ├── env.ts               # Variáveis de ambiente
│   │   └── swagger.ts           # Configuração Swagger
│   │
│   ├── controllers/             # Controladores (camada de apresentação)
│   │   ├── authController.ts    # Autenticação
│   │   ├── homeController.ts    # Home page
│   │   ├── treatmentController.ts
│   │   ├── appointmentController.ts
│   │   ├── reviewController.ts
│   │   └── uploadController.ts
│   │
│   ├── middleware/              # Middlewares
│   │   ├── auth.ts              # JWT authentication
│   │   ├── errorHandler.ts      # Tratamento de erros
│   │   ├── rateLimiter.ts       # Rate limiting
│   │   └── validator.ts          # Validação de dados
│   │
│   ├── routes/                  # Definição de rotas
│   │   ├── publicRoutes.ts     # Rotas públicas
│   │   └── adminRoutes.ts      # Rotas admin (protegidas)
│   │
│   ├── services/                # Lógica de negócio
│   │   ├── authService.ts
│   │   ├── treatmentService.ts
│   │   ├── appointmentService.ts
│   │   ├── reviewService.ts
│   │   └── homeService.ts
│   │
│   ├── utils/                   # Utilitários
│   │   ├── upload.ts            # Upload de imagens
│   │   └── email.ts             # Envio de e-mails
│   │
│   ├── __tests__/               # Testes automatizados
│   │   ├── setup.ts
│   │   ├── auth.test.ts
│   │   └── appointment.test.ts
│   │
│   └── server.ts                # Arquivo principal (entry point)
│
├── prisma/                      # Prisma ORM
│   ├── schema.prisma            # Schema do banco de dados
│   └── seed.ts                  # Dados iniciais (seed)
│
├── uploads/                     # Imagens enviadas
│   └── .gitkeep
│
├── dist/                        # Código compilado (gerado)
│
├── node_modules/                # Dependências (gerado)
│
├── .env                         # Variáveis de ambiente (não versionado)
├── .env.example                 # Exemplo de variáveis
├── .gitignore
├── .dockerignore
│
├── Dockerfile                   # Imagem Docker
├── docker-compose.yml           # Orquestração Docker
│
├── jest.config.js              # Configuração Jest
├── tsconfig.json               # Configuração TypeScript
├── package.json                # Dependências e scripts
│
├── README.md                    # Documentação básica
└── DOCUMENTACAO_DO_SISTEMA.md  # Esta documentação
```

### Explicação de Cada Pasta

#### `src/config/`
Contém todas as configurações do sistema:
- **database.ts:** Instância única do Prisma Client (singleton)
- **env.ts:** Centraliza todas as variáveis de ambiente com validação
- **swagger.ts:** Configuração da documentação OpenAPI

#### `src/controllers/`
Camada de apresentação - recebe requisições e retorna respostas:
- **Responsabilidade:** Validação básica, formatação de resposta, tratamento de erros HTTP
- **Não contém:** Lógica de negócio (fica em services)

#### `src/middleware/`
Interceptadores de requisições:
- **auth.ts:** Verifica JWT e permissões
- **errorHandler.ts:** Captura e formata erros
- **rateLimiter.ts:** Limita requisições por IP
- **validator.ts:** Valida e sanitiza dados de entrada

#### `src/routes/`
Define endpoints e conecta middlewares aos controllers:
- **publicRoutes.ts:** Rotas acessíveis sem autenticação
- **adminRoutes.ts:** Rotas protegidas que requerem autenticação

#### `src/services/`
Camada de lógica de negócio:
- **Responsabilidade:** Regras de negócio, validações complexas, orquestração
- **Isolamento:** Services não conhecem HTTP, podem ser reutilizados

#### `src/utils/`
Funções auxiliares reutilizáveis:
- **upload.ts:** Processamento de imagens (Multer + Sharp)
- **email.ts:** Envio de e-mails (Nodemailer)

---

## 🗄️ Banco de Dados

### Schema Prisma

O banco de dados possui 5 tabelas principais:

#### 1. `users` (Administradores)

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String   // Hash bcrypt
  role      String   @default("admin")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Campos:**
- `id`: UUID único
- `name`: Nome do administrador
- `email`: Email único (usado para login)
- `password`: Hash bcrypt da senha
- `role`: "admin" ou "super_admin"
- `createdAt/updatedAt`: Timestamps automáticos

#### 2. `treatments` (Tratamentos)

```prisma
model Treatment {
  id              String   @id @default(uuid())
  slug            String   @unique
  title           String
  description     String   @db.Text
  fullDescription String?  @db.Text
  price           Float?
  heroImage       String?
  gallery         String[] // Array de URLs
  benefits        String[] // Array de benefícios
  observations    String?  @db.Text
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  appointments    Appointment[]
  reviews         Review[]
}
```

**Campos:**
- `slug`: URL-friendly (ex: "ortodontia-digital")
- `title`: Título do tratamento
- `description`: Descrição curta (home)
- `fullDescription`: Descrição completa (página do tratamento)
- `price`: Preço (opcional)
- `heroImage`: Imagem principal
- `gallery`: Array de URLs de imagens
- `benefits`: Array de benefícios
- `observations`: Observações adicionais
- `isActive`: Se está ativo/publicado

**Relacionamentos:**
- Um tratamento pode ter vários agendamentos
- Um tratamento pode ter várias avaliações

#### 3. `appointments` (Agendamentos)

```prisma
model Appointment {
  id                String   @id @default(uuid())
  name              String
  phone             String
  email             String
  selectedTreatments String[] // Array de IDs
  datePreferred     String?
  timePreferred     String?
  notes             String?  @db.Text
  status            String   @default("pending")
  honeypot          String?  // Anti-bot
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  treatmentId       String?
  treatment         Treatment? @relation(...)
}
```

**Campos:**
- `name`: Nome do paciente
- `phone`: Telefone
- `email`: Email
- `selectedTreatments`: Array de IDs de tratamentos selecionados
- `datePreferred/timePreferred`: Preferências de data/hora
- `notes`: Observações do paciente
- `status`: "pending" | "confirmed" | "cancelled" | "completed"
- `honeypot`: Campo oculto para detectar bots

#### 4. `reviews` (Avaliações)

```prisma
model Review {
  id          String   @id @default(uuid())
  name        String
  rating      Int      // 1 a 5
  comment     String   @db.Text
  approved    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  treatmentId String?
  treatment   Treatment? @relation(...)
}
```

**Campos:**
- `name`: Nome do avaliador
- `rating`: Nota de 1 a 5
- `comment`: Comentário
- `approved`: Se foi aprovada por admin (moderação)

#### 5. `clinic_info` (Informações da Clínica)

```prisma
model ClinicInfo {
  id           String   @id @default(uuid())
  address      String
  phone        String
  email        String?
  whatsapp     String?
  instagram    String?
  facebook     String?
  workingHours String?  @db.Text
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

**Campos:**
- Informações de contato e redes sociais
- Horários de funcionamento

### Migrations

O Prisma gerencia migrations automaticamente:

```bash
# Criar nova migration
npm run prisma:migrate

# Aplicar migrations em produção
npx prisma migrate deploy
```

**Como funciona:**
1. Você modifica `schema.prisma`
2. Executa `prisma migrate dev --name nome_da_migration`
3. Prisma gera SQL e aplica no banco
4. Migration fica em `prisma/migrations/` versionada

### Seed (Dados Iniciais)

O arquivo `prisma/seed.ts` popula o banco com dados iniciais:

- Usuário admin padrão
- Informações da clínica
- Tratamentos de exemplo
- Avaliações de exemplo

**Executar seed:**
```bash
npm run prisma:seed
```

---

## 🛣️ Rotas e Endpoints

### Rotas Públicas (`/api`)

#### Home

**GET `/api/home`**
- **Descrição:** Retorna todos os dados da home page
- **Resposta:**
```json
{
  "banner": {
    "title": "Transforme seu sorriso",
    "subtitle": "..."
  },
  "about": {
    "title": "Quem somos",
    "description": "..."
  },
  "treatments": [...],
  "reviews": [...],
  "clinicInfo": {...}
}
```

**GET `/api/home/gallery`**
- **Descrição:** Retorna array de URLs de imagens da galeria
- **Resposta:**
```json
{
  "images": ["/uploads/img1.jpg", "/uploads/img2.jpg", ...]
}
```

**GET `/api/home/reviews`**
- **Descrição:** Retorna avaliações aprovadas
- **Resposta:**
```json
[
  {
    "id": "...",
    "name": "Maria Silva",
    "rating": 5,
    "comment": "...",
    "treatment": {...}
  }
]
```

#### Tratamentos

**GET `/api/treatments`**
- **Descrição:** Lista todos os tratamentos
- **Query params:**
  - `active=true` - Apenas tratamentos ativos
- **Resposta:**
```json
[
  {
    "id": "...",
    "slug": "ortodontia-digital",
    "title": "Ortodontia Digital",
    "description": "...",
    "price": 3500.00,
    "heroImage": "/uploads/...",
    "gallery": [...],
    "benefits": [...]
  }
]
```

**GET `/api/treatments/:slug`**
- **Descrição:** Detalhes completos de um tratamento
- **Parâmetros:**
  - `slug` - Slug do tratamento
- **Resposta:**
```json
{
  "id": "...",
  "slug": "ortodontia-digital",
  "title": "Ortodontia Digital",
  "description": "...",
  "fullDescription": "...",
  "price": 3500.00,
  "heroImage": "/uploads/...",
  "gallery": [...],
  "benefits": [...],
  "observations": "...",
  "reviews": [...]
}
```

#### Agendamentos

**POST `/api/appointments`**
- **Descrição:** Cria um novo agendamento
- **Body:**
```json
{
  "name": "João Silva",
  "phone": "+55 67 99999-0000",
  "email": "joao@email.com",
  "selectedTreatments": ["uuid1", "uuid2"],
  "datePreferred": "2024-12-25",
  "timePreferred": "10:00",
  "notes": "Observações opcionais",
  "honeypot": ""
}
```
- **Validações:**
  - Nome obrigatório (2-100 caracteres, apenas letras)
  - Telefone obrigatório
  - Email válido
  - Pelo menos um tratamento selecionado
  - Honeypot deve estar vazio (anti-bot)
- **Rate Limit:** 3 requisições por 15 minutos por IP
- **Ações:**
  - Salva no banco
  - Envia email para paciente
  - Envia email para clínica

#### Avaliações

**POST `/api/reviews`**
- **Descrição:** Cria uma nova avaliação (requer aprovação)
- **Body:**
```json
{
  "name": "Maria Silva",
  "rating": 5,
  "comment": "Excelente atendimento!",
  "treatmentId": "uuid" // opcional
}
```

### Rotas Admin (`/api/admin`)

Todas as rotas admin requerem autenticação via JWT.

#### Autenticação

**POST `/api/admin/login`**
- **Descrição:** Login de administrador
- **Body:**
```json
{
  "email": "admin@odontoazul.com",
  "password": "admin123"
}
```
- **Resposta:**
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
- **Rate Limit:** 5 tentativas por 15 minutos

**Uso do token:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Tratamentos (CRUD)

**GET `/api/admin/treatments`**
- Lista todos os tratamentos (incluindo inativos)

**GET `/api/admin/treatments/:id`**
- Detalhes de um tratamento específico

**POST `/api/admin/treatments`**
- Cria novo tratamento
- **Body:**
```json
{
  "slug": "novo-tratamento",
  "title": "Novo Tratamento",
  "description": "Descrição curta",
  "fullDescription": "Descrição completa",
  "price": 2000.00,
  "heroImage": "/uploads/hero.jpg",
  "gallery": ["/uploads/img1.jpg", "/uploads/img2.jpg"],
  "benefits": ["Benefício 1", "Benefício 2"],
  "observations": "Observações",
  "isActive": true
}
```

**PUT `/api/admin/treatments/:id`**
- Atualiza tratamento existente
- Body igual ao POST (todos campos opcionais)

**DELETE `/api/admin/treatments/:id`**
- Remove tratamento permanentemente

#### Agendamentos

**GET `/api/admin/appointments`**
- Lista todos os agendamentos
- **Query params:**
  - `status` - Filtrar por status
  - `page` - Página (paginação)
  - `limit` - Itens por página
- **Resposta:**
```json
{
  "appointments": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**GET `/api/admin/appointments/:id`**
- Detalhes de um agendamento

**PUT `/api/admin/appointments/:id/confirm`**
- Confirma um agendamento (status → "confirmed")

**PUT `/api/admin/appointments/:id/cancel`**
- Cancela um agendamento (status → "cancelled")

#### Avaliações

**GET `/api/admin/reviews/pending`**
- Lista avaliações pendentes de aprovação

**PUT `/api/admin/reviews/:id/approve`**
- Aprova uma avaliação (approved → true)

**DELETE `/api/admin/reviews/:id`**
- Remove uma avaliação

#### Upload

**POST `/api/admin/upload`**
- Upload de imagem
- **Form-data:**
  - `image` - Arquivo (JPG, PNG, WEBP, max 5MB)
- **Resposta:**
```json
{
  "message": "Imagem enviada com sucesso",
  "url": "/uploads/img-1234567890-optimized.jpg",
  "filename": "img-1234567890-optimized.jpg"
}
```

---

## 📤 Sistema de Upload

### Como Funciona

1. **Cliente envia arquivo** via `multipart/form-data`
2. **Multer intercepta** e salva temporariamente
3. **Validação:**
   - Tipo: JPG, PNG, WEBP
   - Tamanho: Máximo 5MB
4. **Sharp processa:**
   - Redimensiona para largura máxima 1200px
   - Comprime com qualidade 85%
   - Converte para JPEG otimizado
5. **Arquivo otimizado** é salvo em `uploads/`
6. **Arquivo original** é removido
7. **URL retornada** para uso no frontend

### Código Relevante

**`src/utils/upload.ts`:**
```typescript
// Configuração Multer
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `img-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Filtro de tipos
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo não permitido'));
  }
};

// Otimização com Sharp
export const optimizeImage = async (inputPath, outputPath, width = 1200) => {
  await sharp(inputPath)
    .resize(width, null, { withoutEnlargement: true, fit: 'inside' })
    .jpeg({ quality: 85 })
    .toFile(outputPath);
  
  fs.unlinkSync(inputPath); // Remove original
};
```

### Uso no Frontend

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('/api/admin/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
  .then(res => res.json())
  .then(data => {
    console.log('URL da imagem:', data.url);
  });
```

### Melhorias Futuras

- Upload para S3/Cloud Storage
- Geração de thumbnails
- Suporte a múltiplos arquivos
- CDN para servir imagens

---

## 📧 Sistema de E-mails

### Como Funciona

Quando um agendamento é criado:

1. **Sistema cria agendamento** no banco
2. **Serviço de email é chamado** (`sendAppointmentEmails`)
3. **Dois emails são enviados:**
   - **Para o paciente:** Confirmação de recebimento
   - **Para a clínica:** Notificação de novo agendamento

### Templates

**Email para Paciente:**
- HTML responsivo
- Confirma dados do agendamento
- Informações de contato
- Design profissional

**Email para Clínica:**
- Formato de notificação
- Todos os dados do paciente
- Tratamentos selecionados
- Preferências de data/hora
- Observações

### Configuração

**Variáveis de ambiente:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
EMAIL_FROM=Clínica Odonto Azul <noreply@odontoazul.com>
```

**Gmail (App Password):**
1. Ative 2FA na sua conta Google
2. Gere uma "App Password" em: https://myaccount.google.com/apppasswords
3. Use essa senha em `EMAIL_PASS`

### Código Relevante

**`src/utils/email.ts`:**
```typescript
const transporter = nodemailer.createTransport({
  host: env.email.host,
  port: env.email.port,
  secure: env.email.port === 465,
  auth: {
    user: env.email.user,
    pass: env.email.pass,
  },
});

export const sendAppointmentEmails = async (appointment) => {
  // Email para paciente
  await transporter.sendMail({
    from: env.email.from,
    to: appointment.email,
    subject: 'Agendamento Recebido - Clínica Odonto Azul',
    html: patientEmailTemplate(appointment),
  });

  // Email para clínica
  await transporter.sendMail({
    from: env.email.from,
    to: env.email.user,
    subject: `Novo Agendamento - ${appointment.name}`,
    html: clinicEmailTemplate(appointment),
  });
};
```

### Melhorias Futuras

- Fila de mensagens (Bull/BullMQ)
- Retry automático
- Templates mais elaborados
- Suporte a múltiplos idiomas
- Notificações SMS

---

## 🔒 Autenticação e Segurança

### JWT (JSON Web Tokens)

**Como funciona:**

1. **Login:**
   - Usuário envia email/senha
   - Sistema verifica credenciais
   - Se válido, gera JWT token
   - Token contém: `{ id, email, role }`

2. **Uso do token:**
   - Cliente envia token no header: `Authorization: Bearer <token>`
   - Middleware `authenticate` valida token
   - Se válido, adiciona `req.user` com dados do usuário

3. **Expiração:**
   - Token expira em 7 dias (configurável)
   - Cliente deve fazer login novamente após expiração

**Código:**
```typescript
// Geração do token
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  env.jwtSecret,
  { expiresIn: env.jwtExpiresIn }
);

// Validação do token
const decoded = jwt.verify(token, env.jwtSecret);
req.user = decoded;
```

### Hash de Senhas

**Bcrypt:**
- Algoritmo de hash unidirecional
- Salt automático (10 rounds)
- Impossível reverter

**Código:**
```typescript
// Hash ao criar usuário
const hashedPassword = await bcrypt.hash(password, 10);

// Verificação no login
const isValid = await bcrypt.compare(password, user.password);
```

### Rate Limiting

**Proteções:**
- **API geral:** 100 requisições por 15 minutos
- **Agendamentos:** 3 requisições por 15 minutos
- **Login:** 5 tentativas por 15 minutos

**Implementação:**
```typescript
export const appointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3,
  message: 'Muitos agendamentos. Tente novamente em alguns minutos.',
});
```

### Validação e Sanitização

**Express-Validator:**
- Valida formato de dados
- Sanitiza inputs (remove HTML, trim, etc.)
- Normaliza emails

**Exemplo:**
```typescript
body('email')
  .trim()
  .notEmpty()
  .isEmail()
  .normalizeEmail()
```

### Honeypot (Anti-Bot)

**Campo oculto** no formulário de agendamento:
- Se preenchido → Bot detectado
- Rejeita requisição

**Código:**
```typescript
if (data.honeypot && data.honeypot !== '') {
  throw new AppError('Requisição inválida', 400);
}
```

### Helmet (Headers de Segurança)

Adiciona headers HTTP de segurança:
- `X-Content-Type-Options`
- `X-Frame-Options`
- `X-XSS-Protection`
- `Strict-Transport-Security`
- etc.

### CORS

Configurado para permitir apenas origens específicas:
```typescript
cors({
  origin: env.cors.origin, // Array de URLs permitidas
  credentials: true,
})
```

---

## 🚀 Como Rodar o Projeto

### Desenvolvimento Local

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar banco de dados:**
   - Instalar PostgreSQL
   - Criar banco: `clinica_odonto`
   - Configurar `DATABASE_URL` no `.env`

3. **Executar migrations:**
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. **Popular banco (opcional):**
```bash
npm run prisma:seed
```

5. **Iniciar servidor:**
```bash
npm run dev
```

Servidor rodando em: `http://localhost:3000`

### Docker

1. **Subir serviços:**
```bash
docker compose up -d
```

2. **Ver logs:**
```bash
docker compose logs -f app
```

3. **Executar seed (primeira vez):**
```bash
docker compose exec app npm run prisma:seed
```

4. **Parar serviços:**
```bash
docker compose down
```

### Prisma Studio (Visualizar Dados)

```bash
npm run prisma:studio
```

Abre interface web em: `http://localhost:5555`

---

## 🔨 Como Fazer Build

### Build para Produção

1. **Compilar TypeScript:**
```bash
npm run build
```

2. **Gerar Prisma Client:**
```bash
npm run prisma:generate
```

3. **Executar migrations:**
```bash
npx prisma migrate deploy
```

4. **Iniciar servidor:**
```bash
npm start
```

### Build Docker

```bash
docker build -t clinica-odonto-api .
```

---

## ⚙️ Configuração de Ambiente

### Variáveis Obrigatórias

```env
# Servidor
PORT=3000
NODE_ENV=production

# Banco de dados
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# JWT
JWT_SECRET=chave-super-secreta-mude-em-producao
JWT_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
EMAIL_FROM=Clínica Odonto Azul <noreply@odontoazul.com>
```

### Variáveis Opcionais

```env
# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880  # 5MB em bytes

# CORS
CORS_ORIGIN=http://localhost:3000,https://seusite.com

# Rate Limit
RATE_LIMIT_WINDOW_MS=900000  # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100
```

### Segurança em Produção

⚠️ **IMPORTANTE:**
- Use `JWT_SECRET` forte e único
- Use senha forte para banco de dados
- Configure CORS apenas para domínios permitidos
- Use HTTPS em produção
- Não commite `.env` no Git

---

## ➕ Como Adicionar Novos Tratamentos

### Via API (Recomendado)

1. **Fazer login:**
```bash
POST /api/admin/login
{
  "email": "admin@odontoazul.com",
  "password": "admin123"
}
```

2. **Upload de imagem:**
```bash
POST /api/admin/upload
Form-data: image = arquivo.jpg
```

3. **Criar tratamento:**
```bash
POST /api/admin/treatments
Authorization: Bearer <token>
{
  "slug": "novo-tratamento",
  "title": "Novo Tratamento",
  "description": "Descrição curta",
  "fullDescription": "Descrição completa...",
  "price": 2000.00,
  "heroImage": "/uploads/img-123.jpg",
  "gallery": ["/uploads/img1.jpg", "/uploads/img2.jpg"],
  "benefits": ["Benefício 1", "Benefício 2"],
  "observations": "Observações importantes",
  "isActive": true
}
```

### Via Prisma Studio

1. Abrir Prisma Studio: `npm run prisma:studio`
2. Clicar em "treatments"
3. Adicionar novo registro
4. Preencher campos obrigatórios

### Via Código (Seed)

Editar `prisma/seed.ts` e adicionar novo tratamento no array.

---

## 📈 Como Escalar o Sistema

### Horizontal Scaling (Múltiplos Servidores)

1. **Load Balancer:**
   - Nginx ou AWS ALB na frente
   - Distribui requisições entre instâncias

2. **Stateless:**
   - ✅ Sistema já é stateless (JWT)
   - ✅ Sem sessões no servidor
   - ✅ Qualquer instância pode processar qualquer requisição

3. **Banco de Dados:**
   - **Read Replicas:** Para leituras
   - **Connection Pooling:** PgBouncer
   - **Caching:** Redis para queries frequentes

### Vertical Scaling (Mais Recursos)

1. **Aumentar recursos do servidor:**
   - Mais CPU
   - Mais RAM
   - SSD rápido

2. **Otimizações:**
   - Aumentar pool de conexões Prisma
   - Cache de queries frequentes
   - CDN para imagens

### Otimizações de Performance

1. **Caching:**
```typescript
// Redis para cache
import Redis from 'ioredis';
const redis = new Redis();

// Cache de tratamentos
const treatments = await redis.get('treatments');
if (treatments) return JSON.parse(treatments);
```

2. **Database Indexing:**
```prisma
model Treatment {
  slug String @unique @map("idx_slug")  // Já indexado
  isActive Boolean @map("idx_active")    // Adicionar índice
}
```

3. **Pagination:**
   - Já implementado em agendamentos
   - Aplicar em outras listagens

4. **Lazy Loading:**
   - Carregar relacionamentos apenas quando necessário

### Arquitetura Escalável

```
                    ┌─────────────┐
                    │   CDN       │
                    │  (Imagens)  │
                    └──────┬──────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                      │
   ┌────▼────┐                          ┌────▼────┐
   │  Nginx  │                          │  Nginx  │
   │   LB    │                          │   LB    │
   └────┬────┘                          └────┬────┘
        │                                      │
   ┌────▼────┐  ┌─────────┐            ┌────▼────┐
   │  App 1  │  │  App 2  │            │  App 3  │
   └────┬────┘  └────┬────┘            └────┬────┘
        │            │                      │
        └────────────┼──────────────────────┘
                     │
        ┌────────────▼────────────┐
        │   PostgreSQL Primary    │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  PostgreSQL Replicas    │
        │  (Read Only)             │
        └─────────────────────────┘
```

### Monitoramento

- **APM:** New Relic, Datadog
- **Logs:** ELK Stack, CloudWatch
- **Métricas:** Prometheus + Grafana
- **Alertas:** PagerDuty, OpsGenie

---

## ✅ Boas Práticas Aplicadas

### 1. Type Safety
- ✅ TypeScript em todo o código
- ✅ Prisma gera tipos automaticamente
- ✅ Validação com Zod/Express-Validator

### 2. Error Handling
- ✅ Classe `AppError` customizada
- ✅ Middleware centralizado de erros
- ✅ Erros não expõem informações sensíveis

### 3. Code Organization
- ✅ Separação de responsabilidades (MVC + Services)
- ✅ Arquivos pequenos e focados
- ✅ Nomenclatura clara e consistente

### 4. Security
- ✅ JWT com expiração
- ✅ Hash de senhas (bcrypt)
- ✅ Rate limiting
- ✅ Validação de entrada
- ✅ Sanitização
- ✅ CORS configurado
- ✅ Helmet para headers

### 5. Performance
- ✅ Connection pooling (Prisma)
- ✅ Paginação em listagens
- ✅ Otimização de imagens
- ✅ Queries eficientes

### 6. Maintainability
- ✅ Código documentado
- ✅ Estrutura clara
- ✅ Testes automatizados
- ✅ Migrations versionadas

### 7. DevOps
- ✅ Docker para containerização
- ✅ docker-compose para desenvolvimento
- ✅ Variáveis de ambiente
- ✅ Scripts npm organizados

---

## 🧪 Testes

### Estrutura de Testes

```
src/__tests__/
├── setup.ts              # Configuração global
├── auth.test.ts          # Testes de autenticação
└── appointment.test.ts   # Testes de agendamento
```

### Executar Testes

```bash
# Todos os testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

### Exemplo de Teste

```typescript
describe('POST /api/appointments', () => {
  it('deve criar um agendamento válido', async () => {
    const response = await request(app)
      .post('/api/appointments')
      .send({
        name: 'João Silva',
        phone: '+55 67 99999-0000',
        email: 'test@test.com',
        selectedTreatments: [treatmentId],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('appointment');
  });
});
```

### Cobertura de Testes

**Alvo:** 80%+ de cobertura

**Áreas críticas:**
- ✅ Autenticação
- ✅ Criação de agendamentos
- ✅ Validações
- ✅ CRUD de tratamentos

---

## 🚢 Deploy em Produção

### Opção 1: VPS (DigitalOcean, AWS EC2, etc.)

1. **Preparar servidor:**
```bash
# Instalar Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Instalar PM2
sudo npm install -g pm2
```

2. **Configurar banco:**
```bash
sudo -u postgres createdb clinica_odonto
sudo -u postgres createuser -P clinica_user
```

3. **Deploy do código:**
```bash
git clone <repo>
cd clinica-odonto-azul-backend
npm install
npm run build
```

4. **Configurar .env:**
```bash
nano .env  # Editar variáveis
```

5. **Executar migrations:**
```bash
npm run prisma:migrate
npm run prisma:seed
```

6. **Iniciar com PM2:**
```bash
pm2 start dist/server.js --name clinica-api
pm2 save
pm2 startup
```

7. **Nginx como reverse proxy:**
```nginx
server {
    listen 80;
    server_name api.odontoazul.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Opção 2: Docker em Produção

1. **Build e push:**
```bash
docker build -t clinica-odonto-api .
docker tag clinica-odonto-api registry.example.com/clinica-odonto-api
docker push registry.example.com/clinica-odonto-api
```

2. **docker-compose.prod.yml:**
```yaml
version: '3.8'
services:
  app:
    image: registry.example.com/clinica-odonto-api
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      # ... outras variáveis
    restart: always
```

3. **Deploy:**
```bash
docker compose -f docker-compose.prod.yml up -d
```

### Opção 3: Plataformas Cloud

**Heroku:**
```bash
heroku create clinica-odonto-api
heroku addons:create heroku-postgresql
git push heroku main
```

**Railway:**
- Conecte repositório
- Configure variáveis de ambiente
- Deploy automático

**AWS Elastic Beanstalk:**
- Upload do código
- Configure variáveis
- Deploy automático

### Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados criado e acessível
- [ ] Migrations executadas
- [ ] Seed executado (se necessário)
- [ ] HTTPS configurado (Let's Encrypt)
- [ ] CORS configurado corretamente
- [ ] Rate limiting ajustado
- [ ] Logs configurados
- [ ] Monitoramento ativo
- [ ] Backup do banco configurado
- [ ] Credenciais admin alteradas

---

## 📚 Recursos Adicionais

### Documentação das Tecnologias

- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [JWT](https://jwt.io/)
- [Swagger/OpenAPI](https://swagger.io/specification/)

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev                    # Inicia com hot reload
npm run build                  # Compila TypeScript
npm start                      # Produção

# Banco de dados
npm run prisma:generate        # Gera Prisma Client
npm run prisma:migrate         # Executa migrations
npm run prisma:seed            # Popula banco
npm run prisma:studio          # Interface visual

# Testes
npm test                       # Executa testes
npm run test:watch             # Modo watch
npm run test:coverage          # Com cobertura

# Docker
docker compose up -d           # Subir serviços
docker compose logs -f         # Ver logs
docker compose down            # Parar serviços
```

---

## 🎓 Conclusão

Este sistema foi desenvolvido seguindo as melhores práticas da indústria, priorizando:

- ✅ **Produtividade:** TypeScript + Prisma aceleram desenvolvimento
- ✅ **Escalabilidade:** Arquitetura stateless permite escalar horizontalmente
- ✅ **Segurança:** Múltiplas camadas de proteção
- ✅ **Organização:** Código limpo e bem estruturado
- ✅ **Manutenibilidade:** Fácil de entender e modificar

O sistema está pronto para produção e pode ser facilmente estendido com novas funcionalidades.

---

**Desenvolvido com ❤️ para Clínica Odonto Azul**

*Última atualização: 2024*








