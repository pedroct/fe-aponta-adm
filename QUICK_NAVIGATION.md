# 🗺️ Guia Rápido de Navegação

Uso: Leia este arquivo para saber onde encontrar o que você precisa.

## 🎯 Encontre Rapidamente

### ❓ "Quero começar a desenvolver"
→ [docs/guides/INICIAR-WINDOWS.md](docs/guides/INICIAR-WINDOWS.md)

### ❓ "Qual é a estrutura do projeto?"
→ [docs/architecture/CONTEXT.md](docs/architecture/CONTEXT.md)

### ❓ "Como rodar os testes?"
→ [docs/guides/DESENVOLVIMENTO.md](docs/guides/DESENVOLVIMENTO.md)

### ❓ "Qual é a documentação completa?"
→ [docs/README.md](docs/README.md) ← **LEIA PRIMEIRO!**

### ❓ "Algo não está funcionando"
→ [docs/troubleshooting/TROUBLESHOOTING.md](docs/troubleshooting/TROUBLESHOOTING.md)

### ❓ "Quais são os comandos úteis?"
→ [docs/guides/QUICK_REFERENCE.md](docs/guides/QUICK_REFERENCE.md)

### ❓ "Como usar a API?"
→ [docs/api/API.md](docs/api/API.md)

### ❓ "Como testar a extensão em Azure DevOps?"
→ [docs/testing/TESTE_HUBS.md](docs/testing/TESTE_HUBS.md)

### ❓ "Qual é o código-fonte principal?"
→ [src/components/AtividadesCadastro.tsx](src/components/AtividadesCadastro.tsx)

### ❓ "Onde estão os scripts?"
→ [scripts/](scripts/) (start.bat, test-connection.ps1, etc)

### ❓ "Onde estão as configs?"
→ [config/](config/) (webpack, .env.example, etc)

## 📂 Estrutura de Diretórios

```
raiz/
├── docs/                    # Toda documentação
│   ├── guides/             # Como usar e desenvolver
│   ├── architecture/       # Design e arquitetura
│   ├── api/                # APIs e integrações
│   ├── testing/            # Testes
│   └── troubleshooting/    # Problemas e soluções
│
├── config/                 # Configuração (webpack, env)
├── scripts/                # Automação (start, testes)
├── src/                    # Código-fonte
├── public/                 # Assets estáticos
└── dist/                   # Build output
```

## 🚀 Fluxo Típico de Trabalho

```
1. COMEÇAR
   └─> docs/guides/INICIAR-WINDOWS.md
   
2. ENTENDER
   └─> docs/architecture/CONTEXT.md
   └─> docs/architecture/SCAFFOLD_PLAN.md
   
3. DESENVOLVER
   └─> docs/guides/DESENVOLVIMENTO.md
   └─> npm run dev (rodar localmente)
   
4. CODAR
   └─> src/ (desenvolver os componentes)
   └─> docs/guides/QUICK_REFERENCE.md (consultar comandos)
   
5. TESTAR
   └─> npm run test (testes unitários)
   └─> docs/testing/TESTE_HUBS.md (testes manuais)
   
6. PROBLEMA?
   └─> docs/troubleshooting/TROUBLESHOOTING.md
   
7. PUBLICAR
   └─> npm run build
   └─> npm run package
```

## 🔍 Referência Rápida por Tipo de Usuário

### 👤 Novo Usuário
1. [docs/README.md](docs/README.md) - Visão geral
2. [docs/guides/INICIAR-WINDOWS.md](docs/guides/INICIAR-WINDOWS.md) - Setup
3. [docs/guides/QUICK_REFERENCE.md](docs/guides/QUICK_REFERENCE.md) - Comandos

### 👨‍💻 Desenvolvedor
1. [docs/guides/DESENVOLVIMENTO.md](docs/guides/DESENVOLVIMENTO.md) - Setup dev
2. [docs/architecture/CONTEXT.md](docs/architecture/CONTEXT.md) - Entender projeto
3. [src/](src/) - Código-fonte

### 🧪 QA/Tester
1. [docs/testing/TESTE_HUBS.md](docs/testing/TESTE_HUBS.md) - Manual testing
2. [docs/testing/TESTING.md](docs/testing/TESTING.md) - Testes unitários
3. [docs/testing/PRONTO_PARA_TESTES.md](docs/testing/PRONTO_PARA_TESTES.md) - Checklist

### 🔧 DevOps/CI-CD
1. [config/webpack.config.js](config/webpack.config.js) - Build config
2. [scripts/](scripts/) - Scripts de automação
3. [docs/guides/CONTRIBUTING.md](docs/guides/CONTRIBUTING.md) - Standards

### 📚 Documentação
1. [docs/README.md](docs/README.md) - Índice central
2. [docs/architecture/REORGANIZATION_SUMMARY.md](docs/architecture/REORGANIZATION_SUMMARY.md) - Estrutura atual
3. [docs/guides/CONTRIBUTING.md](docs/guides/CONTRIBUTING.md) - Como contribuir

## 🎯 Objetivos Comuns

| Objetivo | Arquivo |
|----------|---------|
| Instalar | [docs/guides/INICIAR-WINDOWS.md](docs/guides/INICIAR-WINDOWS.md) |
| Desenvolver | [docs/guides/DESENVOLVIMENTO.md](docs/guides/DESENVOLVIMENTO.md) |
| Testar | [docs/testing/TESTING.md](docs/testing/TESTING.md) |
| Integrar API | [docs/api/API.md](docs/api/API.md) |
| Entender código | [docs/architecture/CODE_SNIPPETS.md](docs/architecture/CODE_SNIPPETS.md) |
| Resolver erro | [docs/troubleshooting/TROUBLESHOOTING.md](docs/troubleshooting/TROUBLESHOOTING.md) |
| Validar projeto | [docs/guides/VALIDATION_CHECKLIST.md](docs/guides/VALIDATION_CHECKLIST.md) |
| Ver estrutura | [docs/guides/PROJECT_STRUCTURE.md](docs/guides/PROJECT_STRUCTURE.md) |

## 📞 Precisa de Ajuda?

1. **Erro específico?** → Procure em [docs/troubleshooting/TROUBLESHOOTING.md](docs/troubleshooting/TROUBLESHOOTING.md)
2. **Não encontrou?** → Verifique [docs/README.md](docs/README.md)
3. **Dúvida sobre código?** → Veja [docs/architecture/CODE_SNIPPETS.md](docs/architecture/CODE_SNIPPETS.md)
4. **Contribuir?** → Leia [docs/guides/CONTRIBUTING.md](docs/guides/CONTRIBUTING.md)
5. **Ver estrutura?** → Consulte [docs/guides/PROJECT_STRUCTURE.md](docs/guides/PROJECT_STRUCTURE.md)

---

**💡 Dica:** Mantenha aberto [docs/README.md](docs/README.md) como sua referência principal!
**📌 Novidade:** Hub icons implementados! Veja [docs/architecture/HUB_ICONS_QUICK_REFERENCE.md](docs/architecture/HUB_ICONS_QUICK_REFERENCE.md)

