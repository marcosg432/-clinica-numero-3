# 📦 Criar Repositório no GitHub - "clinica-numero-3"

## 🚀 Passo a Passo

### 1️⃣ Criar o Repositório no GitHub

1. **Acesse o GitHub**
   - Vá para: https://github.com/new
   - Ou: https://github.com → Clique no "+" → "New repository"

2. **Preencha os dados:**
   - **Repository name**: `clinica-numero-3`
   - **Description**: `Sistema completo de gestão para clínica odontológica`
   - **Visibility**: Escolha **Public** ou **Private**
   - ⚠️ **NÃO marque** "Add a README file" (já temos um)
   - ⚠️ **NÃO marque** "Add .gitignore" (já temos um)
   - ⚠️ **NÃO marque** "Choose a license" (pode adicionar depois)

3. **Clique em "Create repository"**

### 2️⃣ Conectar o Repositório Local ao GitHub

Após criar o repositório no GitHub, execute estes comandos no terminal:

```bash
# Navegar para o diretório do projeto
cd "C:\Users\andre\OneDrive\Área de Trabalho\copia_de_numero_3"

# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/clinica-numero-3.git

# Verificar se foi adicionado corretamente
git remote -v

# Fazer push do código
git branch -M main
git push -u origin main
```

### 3️⃣ Se pedir autenticação

Se o GitHub pedir usuário e senha:
- **Username**: Seu username do GitHub
- **Password**: Use um **Personal Access Token** (não a senha normal)

**Como criar Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)"
3. Dê um nome (ex: "clinica-numero-3")
4. Marque: `repo` (acesso completo aos repositórios)
5. Clique em "Generate token"
6. **Copie o token** (só aparece uma vez!)
7. Use esse token como senha

---

## ✅ Verificação

Após o push, acesse:
- `https://github.com/SEU_USUARIO/clinica-numero-3`

Você deve ver todos os arquivos do projeto lá!

---

## 🔄 Comandos Úteis

```bash
# Ver status
git status

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push

# Ver histórico
git log --oneline
```

---

**Pronto! Seu repositório está criado e conectado! 🎉**

