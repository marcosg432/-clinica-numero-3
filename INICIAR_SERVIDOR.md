# 🚀 Como Iniciar o Servidor

## Problema de Conexão com Localhost

Se você está tendo problemas de conexão com localhost, siga estes passos:

### 1. Abra um Terminal/PowerShell no diretório do projeto

Navegue até o diretório do projeto:
```
cd "C:\Users\andre\OneDrive\Área de Trabalho\copia_de_numero_3"
```

### 2. Verifique se as dependências estão instaladas

```powershell
npm install
```

### 3. Gere o Prisma Client (se necessário)

```powershell
npx prisma generate
```

### 4. Inicie o servidor

```powershell
npm run dev
```

Você deve ver uma mensagem como:
```
🚀 Servidor rodando na porta 3000
📚 Documentação Swagger: http://localhost:3000/api-docs
🏥 Health check: http://localhost:3000/health
```

### 5. Acesse o sistema

- **Site Principal:** http://localhost:3000/index.html
- **Painel Admin:** http://localhost:3000/dashboard/admin-login.html
- **Documentação API:** http://localhost:3000/api-docs

### Credenciais Padrão do Admin

- **Email:** admin@clinica.com
- **Senha:** admin123

### Se o servidor não iniciar

1. Verifique se a porta 3000 está livre:
   ```powershell
   netstat -ano | findstr :3000
   ```

2. Se houver algum processo usando a porta, finalize-o:
   ```powershell
   Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

3. Verifique se o arquivo `.env` existe e está configurado corretamente

4. Verifique os logs de erro no terminal

### Problemas Comuns

- **Erro de banco de dados:** Execute `npx prisma migrate dev` para criar as tabelas
- **Erro de módulos:** Execute `npm install` novamente
- **Porta em uso:** Altere a porta no arquivo `.env` (PORT=3001)


