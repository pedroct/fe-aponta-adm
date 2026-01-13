# 📋 Contexto do Projeto - fe-aponta-adm

**Data:** 13 de janeiro de 2026  
**Status:** ✅ Contexto inicializado com MCP @ai-coders/context  
**Versão do Projeto:** 1.0.0

---

## � Planejamento de Alterações (Janeiro 2026)

**📌 Divisão em Dois Hubs** está em planejamento. Documentos disponíveis:
- [SCAFFOLD_PLAN.md](SCAFFOLD_PLAN.md) - Plano detalhado usando scaffoldPlan do MCP
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Resumo executivo visual
- [CODE_SNIPPETS.md](CODE_SNIPPETS.md) - Código pronto para implementação

**Objetivo:** Dividir frontend em 2 hubs com funcionalidades específicas por escopo de organização vs. projeto.

---

## 📌 Resumo Executivo

**fe-aponta-adm** é uma **extensão do Azure DevOps** desenvolvida em **React 16.14 + TypeScript 4.9** para gerenciar cadastro e administração de atividades vinculadas a projetos. A aplicação funciona como um hub administrativo integrado ao Azure DevOps, permitindo operações CRUD completas sobre atividades com autenticação via token do Azure.

**Propósito:** Gerenciamento centralizado de apontamentos de atividades para a Sefaz Ceará dentro do Azure DevOps

**Status da Divisão de Hubs:**
- ✅ Planejamento completo
- ⏳ Aguardando implementação
- 📋 Documentação: SCAFFOLD_PLAN.md, IMPLEMENTATION_SUMMARY.md, CODE_SNIPPETS.md

---

## 🏗️ Arquitetura e Estrutura do Projeto

### Hierarquia de Diretórios

```
fe-aponta-adm/
│
├── src/                                    # Código-fonte
│   ├── index.tsx                          # Entry point produção (com SDK Azure)
│   ├── index-dev.tsx                      # Entry point desenvolvimento (standalone)
│   │
│   ├── components/
│   │   ├── AtividadesCadastro.tsx         # Componente principal (756 linhas)
│   │   │   └── Features: CRUD, Form, Table, Dialog, Messages
│   │   └── __tests__/
│   │       └── AtividadesCadastro.test.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx                # Gerenciamento de autenticação
│   │       └── Provides: useAuth hook, token management
│   │
│   ├── services/
│   │   ├── apiService.ts                  # Camada de comunicação API
│   │   │   └── Functions: create/list/update/delete atividades e listaProjetos
│   │   └── __tests__/
│   │       └── apiService.test.ts
│   │
│   └── test/
│       └── setup.ts                       # Configuração do Vitest
│
├── public/                                 # Arquivos estáticos
│   ├── index.html                         # Template produção
│   ├── dev.html                           # Template desenvolvimento
│   └── favicon.ico
│
├── dist/                                   # Build output (gerado)
├── coverage/                               # Relatórios de cobertura (gerado)
│
├── docs/                                   # Documentação
│   ├── README.md
│   ├── DESENVOLVIMENTO.md
│   ├── TESTING.md
│   ├── API.md
│   ├── GITFLOW.md
│   ├── CONTRIBUTING.md
│   ├── TROUBLESHOOTING.md
│   ├── INICIAR-WINDOWS.md
│   └── ACESSO-RAPIDO.md
│
├── Configuration Files
│   ├── package.json                       # Dependências e scripts
│   ├── tsconfig.json                      # Configuração TypeScript
│   ├── webpack.config.js                  # Bundler config (dual entry)
│   ├── webpack.dev.config.js              # Config desenvolvimento
│   ├── vitest.config.ts                   # Testes config
│   ├── vss-extension.json                 # Manifesto Azure DevOps
│   ├── .mcp.json                          # Configuração MCP servers
│   └── .env.example                       # Template variáveis ambiente
│
└── Scripts
    ├── start.bat                          # Iniciar em Windows
    └── test-connection.ps1                # Script teste conexão
```

---

## 📦 Dependências Principais

### Dependências de Produção

| Pacote | Versão | Propósito |
|--------|--------|----------|
| **react** | ^16.14.0 | Biblioteca UI |
| **react-dom** | ^16.14.0 | Renderização DOM |
| **azure-devops-extension-sdk** | ^4.2.0 | SDK integração Azure |
| **azure-devops-extension-api** | ^4.0.2 | API Azure DevOps |
| **azure-devops-ui** | ^2.257.0 | Componentes UI estilizados |

### Dependências de Desenvolvimento

| Pacote | Versão | Propósito |
|--------|--------|----------|
| **typescript** | ^4.9.5 | Tipagem estática |
| **webpack** | ^5.75.0 | Module bundler |
| **webpack-cli** | ^5.0.1 | CLI webpack |
| **webpack-dev-server** | ^5.2.3 | Dev server |
| **ts-loader** | ^9.4.2 | TypeScript loader webpack |
| **vitest** | ^4.0.17 | Framework testes |
| **@vitest/ui** | ^4.0.17 | UI testes |
| **@vitest/coverage-v8** | ^4.0.17 | Coverage reporter |
| **@testing-library/react** | ^12.1.5 | Utilities testes React |
| **@testing-library/jest-dom** | ^6.9.1 | Custom matchers |
| **jsdom** | ^27.4.0 | DOM para testes |
| **html-webpack-plugin** | ^5.5.0 | HTML template |
| **copy-webpack-plugin** | ^9.1.0 | Copy files webpack |
| **css-loader** | ^6.7.1 | CSS loader |
| **style-loader** | ^3.3.1 | Style injector |
| **dotenv** | ^17.2.3 | Variáveis ambiente |
| **dotenv-webpack** | ^8.1.1 | Dotenv webpack plugin |
| **tfx-cli** | ^0.23.1 | Azure DevOps CLI |
| **http-server** | ^14.1.1 | Servidor HTTP simples |

---

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────┐
│  Inicialização da Aplicação                             │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  AuthProvider (AuthContext.tsx)                         │
│  - Envolvimento da árvore de componentes                │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  SDK.ready()                                            │
│  - Aguarda SDK do Azure estar pronto                    │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  SDK.getAccessToken()                                   │
│  - Obtém token do usuário autenticado                   │
└─────────────────┬───────────────────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
    Token ✓           Erro/Falha
         │                 │
         ▼                 ▼
   setToken()        setError()
         │                 │
         └────────┬────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  setAzureDevOpsToken(token)                             │
│  - Configura token no apiService                        │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Requisições API com Authorization Header              │
│  Authorization: Bearer {token}                          │
└─────────────────────────────────────────────────────────┘
```

### Arquivo: [src/context/AuthContext.tsx](src/context/AuthContext.tsx)

**Responsabilidades:**
- Inicialização do SDK do Azure DevOps
- Obtenção e armazenamento do token de acesso
- Exposição do contexto via React Context API
- Hook `useAuth()` para consumo em componentes

**State:**
```typescript
interface AuthContextType {
  token: string | null;           // Token de acesso atual
  isLoading: boolean;             // Estado carregamento
  error: string | null;           // Mensagem de erro, se houver
}
```

**Tratamento de Erros:**
- Captura falhas de inicialização do SDK
- Logs de erro no console para debug
- Fallback: aplicação continua sem token (modo desenvolvimento)

---

## 🌐 Camada de Serviços - API

### Arquivo: [src/services/apiService.ts](src/services/apiService.ts)

**URL Base:** `https://api-aponta.pedroct.com.br`

**Configuração via Variáveis de Ambiente:**
- `API_BASE_URL`: URL customizada da API
- `API_TOKEN`: Token alternativo (fallback)

### Interfaces de Dados

```typescript
interface Atividade {
  nome: string;
  descricao: string;
  ativo: boolean;
  id_projeto: string;
}

interface AtividadeResponse extends Atividade {
  id: string;
  criado_por: string | null;
  criado_em: string;
  atualizado_em: string;
  nome_projeto?: string;
}

interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  estado: string;
  external_id: string;
  url: string;
  last_sync_at: string;
  created_at: string;
  updated_at: string;
}
```

### Endpoints e Funções

| Função | Método | Endpoint | Descrição |
|--------|--------|----------|-----------|
| `criarAtividade(atividade)` | POST | `/api/v1/atividades` | Cria nova atividade |
| `listarAtividades()` | GET | `/api/v1/atividades` | Lista todas as atividades |
| `atualizarAtividade(id, atividade)` | PUT | `/api/v1/atividades/{id}` | Atualiza atividade existente |
| `excluirAtividade(id)` | DELETE | `/api/v1/atividades/{id}` | Exclui atividade |
| `listarProjetos()` | GET | `/api/v1/projetos` | Lista todos os projetos |

### Headers HTTP

```
Content-Type: application/json
Authorization: Bearer {token_azure_devops_ou_env}
```

### Tratamento de Erros

- ✅ Detecção de erros CORS ("Failed to fetch", "NetworkError")
- ✅ Parsing de resposta de erro (JSON com `detail` ou `message`)
- ✅ Mensagens amigáveis ao usuário em português
- ✅ Incluição de URL e contexto no erro

**Exemplo de Erro:**
```
Erro de conectividade. Verifique se a API está acessível 
e se CORS está configurado corretamente para a origem 
desta extensão. URL: https://api-aponta.pedroct.com.br
```

---

## 🎨 Componentes React

### Componente Principal: [src/components/AtividadesCadastro.tsx](src/components/AtividadesCadastro.tsx)

**Tipo:** Class Component (756 linhas)

**Responsabilidades:**
- Renderização da interface de administração de atividades
- Gerenciamento do formulário de cadastro
- Listagem tabular de atividades
- Diálogos de confirmação (exclusão)
- Mensagens de feedback (sucesso/erro)
- Loading states

### Estado Local (State)

```typescript
{
  // Dados de atividades
  atividades: IAtividade[];
  
  // Formulário
  nomeAtividade: string;
  descricao: string;
  projetoSelecionado: IListBoxItem | undefined;
  
  // Projetos disponíveis
  projetos: IListBoxItem[];
  
  // Estados de carregamento
  isLoading: boolean;
  isLoadingProjetos: boolean;
  isLoadingAtividades: boolean;
  
  // Mensagens
  errorMessage: string | null;
  successMessage: string | null;
  
  // Dialogs
  dialogAberto: boolean;
  atividadeParaExcluir: IAtividade | null;
  atividadeEmEdicao: string | null;
}
```

### Estrutura de Dados Internas

```typescript
interface IAtividade {
  id: string;
  nome: string;
  descricao: string;
  nome_projeto: string;
  ativo: boolean;
  id_projeto: string;
  criado_por: string | null;
}
```

### Funcionalidades Principais

1. **Listagem de Atividades**
   - Carregamento na montagem do componente
   - Refresh automático após CRUD
   - Tabela com colunas: Nome, Descrição, Projeto, Status, Ações

2. **Criar Atividade**
   - Formulário: Nome, Descrição, Seleção de Projeto
   - Validação básica
   - Requisição POST via apiService
   - Feedback de sucesso

3. **Editar Atividade**
   - Preenchimento automático do formulário
   - Flag `atividadeEmEdicao` para diferenciação visual
   - Requisição PUT via apiService

4. **Excluir Atividade**
   - Dialog de confirmação
   - Flag `atividadeParaExcluir` para segurança
   - Requisição DELETE via apiService
   - Refresh automático

5. **Carregamento de Projetos**
   - Dropdown poblado via `listarProjetos()`
   - Seleção armazenada em `projetoSelection`

### Componentes Azure DevOps UI Utilizados

- `Card` - Container de seções
- `TextField` - Inputs de texto
- `Dropdown` - Seleção de projetos
- `Button` - Ações (Criar, Editar, Excluir)
- `Table` - Listagem de atividades
- `Dialog` - Confirmação de exclusão
- `MessageCard` - Feedback de sucesso/erro
- `Icon` - Ícones de ações

### Padrões de Segurança

- `_isMounted` - Prevenção de memory leaks
- `safeSetState()` - Validação de montagem antes de setState
- `rootRef` - Referência segura ao DOM

---

## ⚙️ Configuração de Build e Deployment

### Webpack Configuration: [webpack.config.js](webpack.config.js)

**Dual Entry Point:**

| Modo | Entry | Template | Output |
|------|-------|----------|--------|
| Produção | `src/index.tsx` | `public/index.html` | `dist/index.js` |
| Desenvolvimento | `src/index-dev.tsx` | `public/dev.html` | `dist/index.js` |

**Ativação via:** `SET DEV_MODE=true` (Windows)

**Configurações:**
- **Resolve Extensions:** `.ts`, `.tsx`, `.js`, `.jsx`
- **Module Rules:**
  - TypeScript: `ts-loader`
  - CSS: `style-loader`, `css-loader`
- **Plugins:**
  - `HtmlWebpackPlugin` - Geração de HTML
  - `CopyWebpackPlugin` - Cópia de assets
  - `DotenvWebpack` - Variáveis de ambiente
- **Optimization:**
  - Minificação em produção
  - Tree shaking habilitado
  - Usado exports em produção

### TypeScript Configuration: [tsconfig.json](tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2015",                    // Alvo ECMAScript
    "module": "commonjs",                  // Sistema de módulos
    "lib": ["ES2015", "DOM"],              // Bibliotecas incluídas
    "jsx": "react",                        // JSX para React
    "strict": false,                       // ⚠️ Sem mode strict
    "esModuleInterop": true,               // Interop com CommonJS
    "skipLibCheck": true,                  // Skip .d.ts checks
    "moduleResolution": "node",            // Resolução Node.js
    "declaration": true,                   // Gera .d.ts
    "outDir": "./dist"                     // Saída compilada
  }
}
```

**⚠️ Nota:** `strict: false` permite desenvolvimento mais rápido mas compromete type safety.

---

## 🧪 Configuração de Testes

### Vitest Config: [vitest.config.ts](vitest.config.ts)

```typescript
{
  test: {
    globals: true,                    // Globals vitest sem import
    environment: 'jsdom',             // DOM simulado
    setupFiles: './src/test/setup.ts' // Setup antes dos testes
  },
  coverage: {
    provider: 'v8',                   // Coverage com V8
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/',
      'src/test/',
      '**/*.d.ts',
      '**/*.config.*',
      '**/dist/',
      'webpack.config.js'
    ]
  }
}
```

### Scripts de Teste

```bash
npm test              # Rodar testes uma vez
npm run test:ui       # Interface visual interativa
npm run test:coverage # Relatório de cobertura
```

### Cobertura Esperada

- `/src/components/**/*.test.tsx`
- `/src/services/**/*.test.ts`
- Exclusão: configs, setup, dist, node_modules

---

## 📦 Extensão Azure DevOps

### Manifesto: [vss-extension.json](vss-extension.json)

**Metadados:**
```json
{
  "manifestVersion": 1,
  "id": "aponta-adm",
  "publisher": "sefaz-ceara",
  "name": "Aponta - Administração",
  "version": "1.0.0",
  "categories": ["Azure Boards"]
}
```

**Permissões (Scopes):**
- `vso.memberentitlementmanagement` - Gerenciamento de membros
- `vso.project` - Acesso a projetos
- `vso.work` - Acesso a work items

**Hub Registrado:**
```json
{
  "id": "aponta-adm-hub",
  "type": "ms.vss-web.hub",
  "name": "Aponta: Gerir Atividades",
  "uri": "dist/index.html",
  "targets": ["ms.vss-web.project-admin-hub-group"]
}
```

**Content Security Policy:**
```
default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: wss:;
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://amcdn.msftauth.net https://js.monitor.azure.com;
connect-src 'self' https: wss:;
font-src 'self' data: https:;
```

### Empacotamento

```bash
npm run package  # Gera .vsix via tfx-cli
```

---

## 🚀 Scripts NPM

| Script | Comando | Descrição |
|--------|---------|-----------|
| `start` | `npm run build:dev && npx http-server dist -p 8082 -o` | Build + servidor na porta 8082 |
| `build:dev` | `SET DEV_MODE=true&& webpack --mode development` | Build desenvolvimento |
| `build` | `webpack --mode production` | Build produção |
| `dev` | `webpack --mode development --watch` | Watch mode |
| `test` | `vitest` | Testes unitários |
| `test:ui` | `vitest --ui` | Interface visual testes |
| `test:coverage` | `vitest --coverage` | Relatório cobertura |
| `package` | `tfx extension create --manifest-globs vss-extension.json` | Empacotar extensão |

---

## 🌍 Variáveis de Ambiente

### Arquivo: `.env` (criado via `dotenv-webpack`)

```env
# API Configuration
API_BASE_URL=https://api-aponta.pedroct.com.br
API_TOKEN=seu_token_aqui_se_necessario

# Build Mode
DEV_MODE=false
```

**Acesso no Código:**
```typescript
process.env.API_BASE_URL
process.env.API_TOKEN
```

---

## 📋 Padrões de Código

### Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes React | PascalCase | `AtividadesCadastro` |
| Interfaces | `I` prefix | `IAtividade`, `IListBoxItem` |
| Services | camelCase | `apiService` |
| Context | `*Context` | `AuthContext` |
| Hooks | `use*` | `useAuth` |
| Funções | camelCase | `criarAtividade()` |

### Tipagem

- ✅ TypeScript estrito em serviços
- ⚠️ Componentes com `strict: false` (considerar migration)
- ✅ Interfaces bem definidas para API
- ✅ Generic types em funções auxiliares

### Tratamento de Erros

```typescript
try {
  // Operação
} catch (err: any) {
  const message = err?.message || 'Erro desconhecido';
  // Tratamento amigável ao usuário
}
```

### Cleanup e Memory Leaks

```typescript
private _isMounted: boolean = false;

componentDidMount() {
  this._isMounted = true;
}

componentWillUnmount() {
  this._isMounted = false;
}

private safeSetState = (state: Partial<State>) => {
  if (this._isMounted) {
    this.setState(state);
  }
}
```

---

## 🔄 Fluxo de Trabalho - CRUD de Atividades

### Criar Atividade

```
User Input (Form)
    ↓
Validação: nome + projeto selecionado
    ↓
criarAtividade(atividade: Atividade)
    ↓
POST /api/v1/atividades { nome, descricao, id_projeto, ativo }
    ↓
Success: Limpar form + Refresh lista + Toast "Criado com sucesso"
Error: Mostrar mensagem de erro + Toast vermelho
```

### Listar Atividades

```
componentDidMount() → listarAtividades()
    ↓
GET /api/v1/atividades
    ↓
Mapeamento: AtividadeResponse → IAtividade
    ↓
Renderização em Table com colunas
    ↓
Ações por linha: Editar, Excluir
```

### Editar Atividade

```
Click em "Editar" → atividadeEmEdicao = id
    ↓
Populate Form com dados da atividade
    ↓
User modifica campos
    ↓
atualizarAtividade(id, atividade)
    ↓
PUT /api/v1/atividades/{id} { nome, descricao, ... }
    ↓
Success: Reset form + Refresh lista
```

### Excluir Atividade

```
Click em "Excluir" → Dialog confirmação
    ↓
User confirma → excluirAtividade(id)
    ↓
DELETE /api/v1/atividades/{id}
    ↓
Success: Remover da lista + Toast "Excluído"
Error: Mostrar erro + Manter lista
```

---

## 📊 Estrutura de Mensagens

### Sucesso
```
MessageCard
├── Severity: Success (verde)
├── Dismiss: Auto
└── Mensagem: "Atividade criada com sucesso!"
```

### Erro
```
MessageCard
├── Severity: Error (vermelho)
├── Dismiss: Manual
└── Mensagem: Detalhada com contexto
```

### Loading
```
<div>Carregando autenticação...</div>
<div>Carregando atividades...</div>
```

---

## 🛠️ Desenvolvimento Local (Windows)

### Inicialização Rápida

```bat
REM Opção 1: Usar script
start.bat

REM Opção 2: Via terminal VS Code
npm start
```

**URL Local:** `http://localhost:3000` (ou 8082)

### Modo Watch

```bash
npm run dev    # Recompila automaticamente
```

### Debug

```typescript
console.log('[App] Mensagem de debug');
console.warn('[AuthContext] Aviso');
console.error('[apiService] Erro');
```

**Prefixo [Component] para rastreamento**

---

## 🔗 Integração Azure DevOps

### Requisitos

1. **Conta Azure DevOps** com permissões de admin
2. **Publisher Account** no Visual Studio Marketplace
3. **Extensão Publicada** para instalação

### Instalação em Ambiente Azure

1. Fazer upload do `.vsix` para o Marketplace
2. Instalar em Organizações Azure DevOps
3. Navegar para: `Project > Admin > Extensions > Aponta: Gerir Atividades`

### Autenticação

- Token do Azure obtido automaticamente via `SDK.getAccessToken()`
- Enviado em header: `Authorization: Bearer {token}`
- Token é válido apenas para a sessão do usuário

---

## 📚 Documentação Adicional

| Documento | Localização | Conteúdo |
|-----------|------------|----------|
| Getting Started | [LEIA-ME-PRIMEIRO.txt](LEIA-ME-PRIMEIRO.txt) | Instruções rápidas Windows |
| Desenvolvimento | [docs/DESENVOLVIMENTO.md](docs/DESENVOLVIMENTO.md) | Setup ambiente dev |
| Testes | [docs/TESTING.md](docs/TESTING.md) | Estratégia e exemplos testes |
| API | [docs/API.md](docs/API.md) | Documentação endpoints |
| Git Flow | [docs/GITFLOW.md](docs/GITFLOW.md) | Workflow Git |
| Troubleshooting | [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Resolução de problemas |

---

## ⚠️ Conhecidos e Melhorias

### Conhecidos

1. **TypeScript Strict:** Desabilitado (`strict: false`)
   - Impacto: Menos type safety
   - Solução: Ativar em fases (componente a componente)

2. **React 16.14:** Versão legacy
   - Impacto: Sem hooks nativos, apenas Context API
   - Solução: Migration gradual para React 18+

3. **Entry Point Duplo:** Dev vs Prod
   - Impacto: Dois pontos de entrada mantêm-se sincronizados
   - Solução: Consolidar em um único entry

### Melhorias Recomendadas

- [ ] Ativar `strict: true` TypeScript
- [ ] Adicionar Memoization em componentes (React.memo)
- [ ] Aumentar cobertura de testes (target: >80%)
- [ ] Acessibilidade (ARIA labels, keyboard nav)
- [ ] Documentação Swagger/OpenAPI para API
- [ ] CI/CD pipeline (GitHub Actions ou Azure Pipelines)
- [ ] Error Boundary para tratamento de crashes
- [ ] Logging estruturado (Sentry ou similar)

---

## 🎯 Quick Reference

### Iniciar Projeto
```bash
npm install              # Instalar dependências
npm start                # Dev server + browser
npm run build            # Build produção
```

### Testes
```bash
npm test                 # Rodar testes
npm run test:coverage    # Cobertura
npm run test:ui          # Interface visual
```

### Debug
- Browser DevTools: F12 ou Ctrl+Shift+I
- Console: Ver logs prefixados com `[Component]`
- Network: Verificar requisições à API

### Publicar Extensão
```bash
npm run package          # Gera .vsix
# Upload manualmente no Marketplace ou via tfx-cli
```

---

## 📞 Contato e Recursos

- **Organização:** Sefaz Ceará
- **Publisher:** sefaz-ceara
- **Marketplace:** Visual Studio Marketplace
- **Repositório:** [conforme configurado no Git]
- **API Backend:** `https://api-aponta.pedroct.com.br`

---

**Documento de Contexto Finalizado**  
*Gerado em: 13 de janeiro de 2026*  
*MCP: @ai-coders/context*
