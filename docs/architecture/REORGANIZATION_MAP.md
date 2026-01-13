# 📁 Mapa de Reorganização do Projeto

## Estrutura Padronizada

```
fe-aponta-adm/
├── 📄 Root Configuration Files
│   ├── package.json                 # Dependências do projeto
│   ├── tsconfig.json                # Configuração TypeScript
│   ├── vitest.config.ts             # Configuração Vitest
│   ├── vss-extension.json           # Manifesto da extensão VS
│   ├── README.md                    # Documentação principal
│   └── fe-aponta-adm.code-workspace # Workspace VS Code
│
├── 📂 .github/                      # Configurações GitHub
│   └── workflows/                   # CI/CD workflows
│
├── 📂 .vscode/                      # Configurações VS Code
│   ├── extensions.json              # Extensões recomendadas
│   ├── settings.json                # Configurações de workspace
│   └── launch.json                  # Configuração de debug
│
├── 📂 config/                       # Arquivos de configuração
│   ├── webpack.config.js            # Config produção
│   ├── webpack.dev.config.js        # Config desenvolvimento
│   └── .env.example                 # Variáveis de ambiente
│
├── 📂 scripts/                      # Scripts de automação
│   ├── start.bat                    # Script de inicialização
│   ├── test-connection.ps1          # Teste de conexão
│   └── README.md                    # Guia de scripts
│
├── 📂 src/                          # Código-fonte
│   ├── index.tsx                    # Entry point produção
│   ├── index-dev.tsx                # Entry point desenvolvimento
│   │
│   ├── components/                  # Componentes React
│   │   ├── AtividadesCadastro.tsx
│   │   └── __tests__/
│   │
│   ├── services/                    # Serviços/APIs
│   │   ├── apiService.ts
│   │   └── __tests__/
│   │
│   ├── context/                     # React Context
│   │   └── AuthContext.tsx
│   │
│   ├── test/                        # Setup de testes
│   │   └── setup.ts
│   │
│   └── types/                       # Definições TypeScript
│       └── (será criada)
│
├── 📂 public/                       # Arquivos estáticos
│   ├── dev.html
│   └── index.html
│
├── 📂 dist/                         # Build output
│   ├── index.html
│   └── index.js
│
├── 📂 coverage/                     # Coverage reports
│   └── (arquivos de cobertura)
│
├── 📂 docs/                         # Documentação do projeto
│   │
│   ├── README.md                    # Índice de documentação
│   │
│   ├── guides/                      # Guias de uso
│   │   ├── INICIAR-WINDOWS.md
│   │   ├── DESENVOLVIMENTO.md
│   │   ├── CONTRIBUTING.md
│   │   └── QUICK_REFERENCE.md
│   │
│   ├── architecture/                # Arquitetura e design
│   │   ├── CONTEXT.md               # Análise do projeto
│   │   ├── SCAFFOLD_PLAN.md         # Plano de implementação
│   │   ├── IMPLEMENTATION_SUMMARY.md
│   │   └── CODE_SNIPPETS.md
│   │
│   ├── api/                         # Documentação de API
│   │   ├── API.md                   # Referência de API
│   │   └── ACESSO-RAPIDO.md
│   │
│   ├── testing/                     # Testes
│   │   ├── TESTING.md               # Guia de testes
│   │   ├── TESTE_HUBS.md            # Testes dos hubs
│   │   ├── PRONTO_PARA_TESTES.md
│   │   └── TECHNICAL_VALIDATION.md
│   │
│   └── troubleshooting/             # Resolução de problemas
│       ├── TROUBLESHOOTING.md
│       └── BUILD_STATUS.md
│
├── 📂 node_modules/                 # Dependências (git ignored)
│
├── 📂 .claude/                      # Configurações Claude (git ignored)
│
└── 📄 Project Metadata
    ├── .env                         # Variáveis de ambiente (git ignored)
    ├── .gitignore                   # Arquivos ignorados
    ├── package-lock.json            # Lock file
    └── vss-extension.json           # Manifesto de extensão
```

## 📋 Mapeamento de Arquivo Reorganizados

### Configuração
| Arquivo | De | Para | Status |
|---------|----|----|--------|
| webpack.config.js | raiz | config/ | ✅ Pronto |
| webpack.dev.config.js | raiz | config/ | ✅ Pronto |
| .env.example | raiz | config/ | ✅ Pronto |

### Scripts
| Arquivo | De | Para | Status |
|---------|----|----|--------|
| start.bat | raiz | scripts/ | ✅ Pronto |
| test-connection.ps1 | raiz | scripts/ | ✅ Pronto |

### Documentação
| Arquivo | De | Para | Status |
|---------|----|----|--------|
| INICIAR-WINDOWS.md | docs/ | docs/guides/ | ✅ Pronto |
| DESENVOLVIMENTO.md | docs/ | docs/guides/ | ✅ Pronto |
| CONTRIBUTING.md | docs/ | docs/guides/ | ✅ Pronto |
| API.md | docs/ | docs/api/ | ✅ Pronto |
| ACESSO-RAPIDO.md | docs/ | docs/api/ | ✅ Pronto |
| TESTING.md | docs/ | docs/testing/ | ✅ Pronto |
| TROUBLESHOOTING.md | docs/ | docs/troubleshooting/ | ✅ Pronto |
| CONTEXT.md | raiz | docs/architecture/ | ✅ Pronto |
| SCAFFOLD_PLAN.md | raiz | docs/architecture/ | ✅ Pronto |
| IMPLEMENTATION_SUMMARY.md | raiz | docs/architecture/ | ✅ Pronto |
| CODE_SNIPPETS.md | raiz | docs/architecture/ | ✅ Pronto |
| TESTE_HUBS.md | raiz | docs/testing/ | ✅ Pronto |
| PRONTO_PARA_TESTES.md | raiz | docs/testing/ | ✅ Pronto |
| TECHNICAL_VALIDATION.md | raiz | docs/testing/ | ✅ Pronto |
| BUILD_STATUS.md | raiz | docs/troubleshooting/ | ✅ Pronto |

### Raiz (Manter)
| Arquivo | Motivo |
|---------|--------|
| README.md | Documentação principal do projeto |
| package.json | Metadados do projeto |
| package-lock.json | Lock file |
| tsconfig.json | Configuração TypeScript |
| vitest.config.ts | Configuração Vitest |
| vss-extension.json | Manifesto da extensão |
| fe-aponta-adm.code-workspace | Workspace VS Code |
| .gitignore | Git ignore |
| .env | Variáveis de ambiente |
| .env.example | Exemplo de variáveis |
| LEIA-ME-PRIMEIRO.txt | Guia de início rápido |

### Remover
| Arquivo | Motivo |
|---------|--------|
| .mcp.json | Arquivo de configuração MCP (redundante) |
| REORGANIZATION_MAP.md | Arquivo de mapeamento (opcional) |
| DOCUMENTATION_INDEX.md | Redundante com docs/README.md |
| DOCUMENTATION_STRUCTURE.md | Redundante com REORGANIZATION_MAP.md |
| DELIVERY_SUMMARY.md | Redundante com docs/architecture/ |
| COMPLETION_SUMMARY.md | Redundante com docs/architecture/ |
| QUICK_REFERENCE.md | Mover para docs/guides/ |

## 🚀 Passos de Reorganização

1. ✅ Criar estrutura de diretórios
2. ⏳ Mover arquivos de configuração
3. ⏳ Mover scripts
4. ⏳ Mover documentação
5. ⏳ Criar README's para cada diretório
6. ⏳ Atualizar paths em package.json se necessário
7. ⏳ Limpar raiz removendo arquivos redundantes

## 📝 Notas

- Todos os imports TypeScript/JavaScript devem ser atualizados se referenciarem caminhos antigos
- Arquivos `.md` na raiz serão removidos após documentação estar em `docs/`
- A pasta `docs/README.md` será o índice central de toda documentação
- Manter estrutura simples e clara para fácil navegação

