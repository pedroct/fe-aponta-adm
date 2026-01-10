# Apontamentos - Extensão Azure DevOps

Extensão para gerenciamento de cadastro de atividades no Azure DevOps, permitindo criar, editar, visualizar e excluir atividades vinculadas a projetos.

## Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [Testes](#testes)
- [Build e Deploy](#build-e-deploy)
- [Funcionalidades](#funcionalidades)
- [API](#api)
- [Configuração](#configuração)
- [Documentação Adicional](#documentação-adicional)

## Tecnologias Utilizadas

### Core
- **React 16.14.0** - Biblioteca para construção da interface
- **TypeScript 4.9.5** - Superset JavaScript com tipagem estática
- **Webpack 5** - Bundler de módulos

### Azure DevOps
- **Azure DevOps Extension SDK 4.0.2** - SDK para extensões
- **Azure DevOps Extension API 4.0.2** - API para comunicação
- **Azure DevOps UI 2.257.0** - Componentes de interface

### Testes
- **Vitest 2.1.9** - Framework de testes unitários
- **@testing-library/react 12.1.5** - Utilitários para testar React
- **@testing-library/jest-dom 6.9.1** - Matchers customizados
- **@testing-library/user-event 14.6.1** - Simulação de interações
- **jsdom 27.4.0** - Implementação DOM para testes
- **@vitest/coverage-v8 2.1.9** - Cobertura de código
- **@vitest/ui 2.1.9** - Interface visual para testes

## Estrutura do Projeto

```
fe-aponta-adm/
├── src/
│   ├── components/
│   │   ├── AtividadesCadastro.tsx          # Componente principal
│   │   └── __tests__/
│   │       └── AtividadesCadastro.test.tsx # Testes do componente
│   ├── services/
│   │   ├── apiService.ts                   # Serviço de API
│   │   └── __tests__/
│   │       └── apiService.test.ts          # Testes do serviço
│   ├── test/
│   │   └── setup.ts                        # Configuração de testes
│   ├── index.tsx                           # Ponto de entrada (produção)
│   └── index-dev.tsx                       # Ponto de entrada (desenvolvimento)
├── dist/                                   # Arquivos compilados
├── coverage/                               # Relatórios de cobertura
├── package.json                            # Dependências e scripts
├── tsconfig.json                           # Configuração TypeScript
├── vitest.config.ts                        # Configuração Vitest
├── webpack.config.js                       # Configuração Webpack
└── vss-extension.json                      # Manifesto da extensão
```

## Instalação

```bash
# Instalar dependências
npm install
```

## Desenvolvimento

### Modo Desenvolvimento (Navegador)

Para visualizar a interface no navegador durante o desenvolvimento:

```bash
npm start
```

Isso abrirá automaticamente o navegador em `http://localhost:8082` com hot-reload ativado.

### Build com Watch (Extensão)

Para desenvolvimento da extensão com recompilação automática:

```bash
npm run dev
```

### Ambiente de Desenvolvimento

O projeto utiliza variáveis de ambiente para configuração. Crie um arquivo `.env` na raiz:

```env
API_BASE_URL=http://localhost:8000
AZURE_DEVOPS_PAT=seu-personal-access-token
DEV_MODE=true
```

## Testes

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar com interface visual
npm run test:ui

# Executar com cobertura
npm run test:coverage
```

### Estrutura de Testes

O projeto possui **18 testes** divididos em:

- **8 testes de serviço** ([apiService.test.ts](src/services/__tests__/apiService.test.ts))
  - CRUD de atividades
  - Listagem de projetos
  - Tratamento de erros

- **10 testes de componente** ([AtividadesCadastro.test.tsx](src/components/__tests__/AtividadesCadastro.test.tsx))
  - Renderização
  - Carregamento de dados
  - Validação de formulário
  - Estados de loading
  - Tratamento de erros

### Cobertura de Código

Cobertura atual:
- **apiService.ts**: 98.64% (cobertura excelente)
- **AtividadesCadastro.tsx**: 69.12% (boa cobertura)

## Build e Deploy

### Build de Produção

```bash
npm run build
```

### Build de Desenvolvimento

```bash
npm run build:dev
```

### Empacotar Extensão

1. Configure o publisher no arquivo [vss-extension.json](vss-extension.json):
```json
{
  "publisher": "seu-publisher-id"
}
```

2. Execute o comando de empacotamento:
```bash
npm run package
```

3. Um arquivo `.vsix` será gerado na raiz do projeto

4. Publique no [Azure DevOps Marketplace](https://marketplace.visualstudio.com/azuredevops)

## Funcionalidades

### Cadastro de Atividades

- ✅ Criar nova atividade
- ✅ Listar todas as atividades
- ✅ Editar atividade existente
- ✅ Excluir atividade
- ✅ Vincular atividade a projeto
- ✅ Ativar/desativar atividade
- ✅ Validação de campos obrigatórios
- ✅ Estados de loading
- ✅ Tratamento de erros
- ✅ Mensagens de feedback

### Interface

Componentes Azure DevOps UI utilizados:
- **TextField** - Campos de entrada (nome, descrição)
- **Dropdown** - Seletor de projetos
- **Button** - Botões de ação
- **Card** - Container principal
- **Table** - Tabela de atividades
- **IconButton** - Botões de ação (editar/remover)
- **Checkbox** - Status ativo/inativo
- **MessageBar** - Mensagens de sucesso/erro

## API

### Serviço de API

O projeto se comunica com uma API REST através do [apiService.ts](src/services/apiService.ts).

#### Endpoints

```typescript
// Criar atividade
POST /api/v1/atividades
Body: { nome, descricao, ativo, id_projeto }

// Listar atividades
GET /api/v1/atividades
Response: { items: Atividade[] }

// Atualizar atividade
PUT /api/v1/atividades/:id
Body: { nome, descricao, ativo, id_projeto }

// Excluir atividade
DELETE /api/v1/atividades/:id

// Listar projetos
GET /api/v1/projetos
Response: Projeto[]
```

#### Autenticação

Todas as requisições incluem o header de autenticação:
```
Authorization: Bearer {AZURE_DEVOPS_PAT}
```

#### Interfaces TypeScript

```typescript
interface Atividade {
  nome: string;
  descricao: string;
  ativo: boolean;
  id_projeto: string;
}

interface AtividadeResponse extends Atividade {
  id: string;
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

## Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `API_BASE_URL` | URL base da API | `http://localhost:8000` |
| `AZURE_DEVOPS_PAT` | Personal Access Token | (vazio) |
| `DEV_MODE` | Modo de desenvolvimento | `false` |

### TypeScript

Configuração em [tsconfig.json](tsconfig.json):
- Target: ES2015
- Module: CommonJS
- JSX: React
- Strict mode: Desabilitado (compatibilidade React 16)

### Vitest

Configuração em [vitest.config.ts](vitest.config.ts):
- Environment: jsdom
- Globals: Habilitados
- Coverage provider: v8
- Setup file: [src/test/setup.ts](src/test/setup.ts)

## Documentação Adicional

Toda a documentação técnica está organizada na pasta [docs/](docs/):

- [TESTING.md](docs/TESTING.md) - Guia completo de testes
- [API.md](docs/API.md) - Documentação detalhada da API
- [CONTRIBUTING.md](docs/CONTRIBUTING.md) - Guia de contribuição
- [GITFLOW.md](docs/GITFLOW.md) - Fluxo de trabalho com Git e branches
- [DESENVOLVIMENTO.md](docs/DESENVOLVIMENTO.md) - Guia de desenvolvimento
- [INICIAR-WINDOWS.md](docs/INICIAR-WINDOWS.md) - Instruções para Windows
- [ACESSO-RAPIDO.md](docs/ACESSO-RAPIDO.md) - Links e referências rápidas
- [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - Solução de problemas

📖 **[Ver índice completo da documentação](docs/README.md)**

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run build` | Build de produção |
| `npm run build:dev` | Build de desenvolvimento |
| `npm run dev` | Build com watch |
| `npm start` | Servidor de desenvolvimento |
| `npm test` | Executar testes |
| `npm run test:ui` | Interface visual de testes |
| `npm run test:coverage` | Testes com cobertura |
| `npm run package` | Empacotar extensão |

## Suporte

Para reportar problemas ou sugerir melhorias, abra uma issue no repositório do projeto.

## Licença

[Adicione a licença do projeto aqui]
