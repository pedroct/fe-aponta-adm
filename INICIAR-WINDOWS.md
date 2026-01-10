# 🚀 Guia de Início Rápido - Windows

## ✅ Projeto Migrado com Sucesso!

O projeto foi copiado para: `C:\Projects\fe-aponta-adm`

---

## 📝 Passos para executar

### 1. Abrir o projeto no VS Code

O VS Code deve ter aberto automaticamente. Se não abriu:

1. Abra o **VS Code**
2. Vá em `File > Open Folder`
3. Selecione `C:\Projects\fe-aponta-adm`

---

### 2. Abrir Terminal Integrado

No VS Code, pressione:
- **Ctrl + `** (acento grave)
- Ou vá em `Terminal > New Terminal`

Isso abrirá o terminal do Windows (PowerShell ou CMD).

---

### 3. Executar o servidor de desenvolvimento

No terminal do VS Code, execute:

```bash
npm start
```

**Isso vai:**
1. ✅ Compilar o projeto em modo desenvolvimento
2. ✅ Iniciar o servidor HTTP na porta 3000
3. ✅ Abrir automaticamente o navegador em `http://localhost:3000`

---

## 🎯 Comandos Disponíveis

```bash
# Iniciar servidor de desenvolvimento (compila + abre navegador)
npm start

# Build de desenvolvimento (apenas compila)
npm run build:dev

# Build de produção (para extensão Azure DevOps)
npm run build

# Build com watch (recompila automaticamente ao salvar)
npm run dev
```

---

## 🔍 Verificar se Node.js está instalado

Se o comando `npm start` não funcionar, verifique se o Node.js está instalado no Windows:

```bash
node --version
npm --version
```

Se retornar a versão (ex: `v20.x.x`), está tudo OK!

Se **não** estiver instalado:
1. Baixe em: https://nodejs.org/
2. Instale a versão LTS
3. Reinicie o VS Code
4. Execute `npm start` novamente

---

## ✨ O que você vai ver

Após executar `npm start`, o navegador abrirá automaticamente em `http://localhost:3000` mostrando:

- 📝 **Campo "Atividade"** - Para digitar o nome da atividade
- 📋 **Dropdown "Projeto"** - Com opções: Projeto Alpha, Beta, Gamma, Delta
- ➕ **Botão "Adicionar"** - Para adicionar a atividade
- 📊 **Tabela de Atividades** - Lista das atividades cadastradas
- ✏️ **Botões de Editar/Remover** - Para gerenciar cada atividade

---

## 🔄 Hot Reload Ativado

Quando você editar qualquer arquivo `.tsx` ou `.ts`, o projeto será recompilado automaticamente e o navegador atualizará sozinho!

---

## 🐛 Problemas?

### Erro: "npm não é reconhecido"
- Node.js não está instalado no Windows
- Instale em: https://nodejs.org/

### Erro: "Cannot find module"
- Execute: `npm install`

### Porta 3000 já está em uso
- Mate o processo: `npx kill-port 3000`
- Ou use outra porta: `npx http-server dist -p 3001`

---

## 📂 Estrutura do Projeto

```
C:\Projects\fe-aponta-adm\
├── src/
│   ├── components/
│   │   └── AtividadesCadastro.tsx  ← Componente principal
│   ├── index.tsx                    ← Entrada para Azure DevOps
│   └── index-dev.tsx                ← Entrada para dev local
├── public/
│   ├── index.html                   ← HTML para Azure DevOps
│   └── dev.html                     ← HTML para dev local
├── dist/                            ← Arquivos compilados
├── package.json                     ← Dependências e scripts
└── webpack.config.js                ← Configuração webpack
```

---

## 🎉 Pronto para começar!

Execute no terminal do VS Code:

```bash
npm start
```

E comece a desenvolver! 🚀
