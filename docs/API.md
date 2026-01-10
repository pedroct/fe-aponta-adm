# Documentação da API

Este documento detalha todos os endpoints da API utilizados pela extensão, incluindo exemplos de requisições e respostas.

## Índice

- [Configuração](#configuração)
- [Autenticação](#autenticação)
- [Endpoints de Atividades](#endpoints-de-atividades)
- [Endpoints de Projetos](#endpoints-de-projetos)
- [Tipos e Interfaces](#tipos-e-interfaces)
- [Tratamento de Erros](#tratamento-de-erros)
- [Exemplos de Uso](#exemplos-de-uso)

## Configuração

### URL Base

A URL base da API é configurável através da variável de ambiente:

```env
API_BASE_URL=http://localhost:8000
```

**Padrão**: `http://localhost:8000`

### Headers Padrão

Todas as requisições incluem os seguintes headers:

```http
Content-Type: application/json
Authorization: Bearer {AZURE_DEVOPS_PAT}
```

## Autenticação

A API utiliza autenticação via Bearer Token (Azure DevOps Personal Access Token).

### Configurar PAT

1. Gere um Personal Access Token no Azure DevOps
2. Configure a variável de ambiente:

```env
AZURE_DEVOPS_PAT=seu-token-aqui
```

3. O token será incluído automaticamente em todas as requisições

## Endpoints de Atividades

### Criar Atividade

Cria uma nova atividade no sistema.

**Endpoint**: `POST /api/v1/atividades`

**Request Body**:
```json
{
  "nome": "Nome da Atividade",
  "descricao": "Descrição detalhada",
  "ativo": true,
  "id_projeto": "uuid-do-projeto"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid-da-atividade",
  "nome": "Nome da Atividade",
  "descricao": "Descrição detalhada",
  "ativo": true,
  "id_projeto": "uuid-do-projeto",
  "nome_projeto": "Nome do Projeto",
  "criado_em": "2026-01-10T14:30:00Z",
  "atualizado_em": "2026-01-10T14:30:00Z"
}
```

**Exemplo de Código**:
```typescript
import { criarAtividade } from './services/apiService';

const novaAtividade = {
  nome: 'Desenvolvimento de Feature',
  descricao: 'Implementar novo módulo de relatórios',
  ativo: true,
  id_projeto: 'proj-123'
};

const resultado = await criarAtividade(novaAtividade);
console.log('Atividade criada:', resultado.id);
```

---

### Listar Atividades

Lista todas as atividades cadastradas.

**Endpoint**: `GET /api/v1/atividades`

**Query Parameters** (opcionais):
- `ativo`: Filtrar por status (true/false)
- `id_projeto`: Filtrar por projeto

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "uuid-1",
      "nome": "Atividade 1",
      "descricao": "Descrição 1",
      "ativo": true,
      "id_projeto": "proj-123",
      "nome_projeto": "Projeto ABC",
      "criado_em": "2026-01-10T14:30:00Z",
      "atualizado_em": "2026-01-10T14:30:00Z"
    },
    {
      "id": "uuid-2",
      "nome": "Atividade 2",
      "descricao": "Descrição 2",
      "ativo": false,
      "id_projeto": "proj-456",
      "nome_projeto": "Projeto XYZ",
      "criado_em": "2026-01-09T10:15:00Z",
      "atualizado_em": "2026-01-09T10:15:00Z"
    }
  ],
  "total": 2
}
```

**Exemplo de Código**:
```typescript
import { listarAtividades } from './services/apiService';

const atividades = await listarAtividades();
console.log(`Total de atividades: ${atividades.length}`);

atividades.forEach(ativ => {
  console.log(`${ativ.nome} - ${ativ.nome_projeto}`);
});
```

---

### Atualizar Atividade

Atualiza uma atividade existente.

**Endpoint**: `PUT /api/v1/atividades/{id}`

**URL Parameters**:
- `id`: UUID da atividade

**Request Body**:
```json
{
  "nome": "Nome Atualizado",
  "descricao": "Descrição atualizada",
  "ativo": false,
  "id_projeto": "uuid-do-projeto"
}
```

**Response** (200 OK):
```json
{
  "id": "uuid-da-atividade",
  "nome": "Nome Atualizado",
  "descricao": "Descrição atualizada",
  "ativo": false,
  "id_projeto": "uuid-do-projeto",
  "nome_projeto": "Nome do Projeto",
  "criado_em": "2026-01-10T14:30:00Z",
  "atualizado_em": "2026-01-10T16:45:00Z"
}
```

**Exemplo de Código**:
```typescript
import { atualizarAtividade } from './services/apiService';

const atividadeAtualizada = {
  nome: 'Atividade Modificada',
  descricao: 'Nova descrição',
  ativo: false,
  id_projeto: 'proj-123'
};

const resultado = await atualizarAtividade('ativ-uuid', atividadeAtualizada);
console.log('Atividade atualizada:', resultado);
```

---

### Excluir Atividade

Remove uma atividade do sistema.

**Endpoint**: `DELETE /api/v1/atividades/{id}`

**URL Parameters**:
- `id`: UUID da atividade

**Response** (204 No Content):
```
(sem corpo de resposta)
```

**Exemplo de Código**:
```typescript
import { excluirAtividade } from './services/apiService';

await excluirAtividade('ativ-uuid');
console.log('Atividade excluída com sucesso');
```

---

## Endpoints de Projetos

### Listar Projetos

Lista todos os projetos disponíveis.

**Endpoint**: `GET /api/v1/projetos`

**Response** (200 OK):
```json
[
  {
    "id": "uuid-1",
    "nome": "Projeto Alpha",
    "descricao": "Descrição do projeto",
    "estado": "ativo",
    "external_id": "azure-devops-project-id",
    "url": "https://dev.azure.com/org/project",
    "last_sync_at": "2026-01-10T14:00:00Z",
    "created_at": "2026-01-01T10:00:00Z",
    "updated_at": "2026-01-10T14:00:00Z"
  },
  {
    "id": "uuid-2",
    "nome": "Projeto Beta",
    "descricao": "Outro projeto",
    "estado": "ativo",
    "external_id": "azure-devops-project-id-2",
    "url": "https://dev.azure.com/org/project2",
    "last_sync_at": "2026-01-10T13:30:00Z",
    "created_at": "2026-01-05T09:00:00Z",
    "updated_at": "2026-01-10T13:30:00Z"
  }
]
```

**Exemplo de Código**:
```typescript
import { listarProjetos } from './services/apiService';

const projetos = await listarProjetos();

// Converter para dropdown options
const opcoesProjetos = projetos.map(proj => ({
  id: proj.id,
  text: proj.nome
}));

console.log('Projetos disponíveis:', opcoesProjetos);
```

---

## Tipos e Interfaces

### TypeScript Interfaces

```typescript
// Atividade (request)
interface Atividade {
  nome: string;
  descricao: string;
  ativo: boolean;
  id_projeto: string;
}

// Atividade (response)
interface AtividadeResponse extends Atividade {
  id: string;
  criado_em: string;
  atualizado_em: string;
  nome_projeto?: string;
}

// Projeto
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

### Validações

#### Atividade
- `nome`: obrigatório, string não vazia, máx 255 caracteres
- `descricao`: obrigatório, string não vazia, máx 1000 caracteres
- `ativo`: obrigatório, boolean
- `id_projeto`: obrigatório, UUID válido

#### Projeto
- `id`: UUID gerado automaticamente
- `nome`: obrigatório, único
- `external_id`: ID do projeto no Azure DevOps

---

## Tratamento de Erros

### Códigos de Status HTTP

| Código | Significado | Quando ocorre |
|--------|-------------|---------------|
| 200 | OK | Requisição bem-sucedida (GET, PUT) |
| 201 | Created | Recurso criado com sucesso (POST) |
| 204 | No Content | Recurso excluído com sucesso (DELETE) |
| 400 | Bad Request | Dados inválidos na requisição |
| 401 | Unauthorized | Token de autenticação inválido |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: nome duplicado) |
| 500 | Internal Server Error | Erro no servidor |

### Formato de Erro

Todas as respostas de erro seguem o formato:

```json
{
  "detail": "Mensagem de erro descritiva",
  "error_code": "CODIGO_ERRO",
  "field": "campo_com_erro" // opcional
}
```

### Exemplos de Erros

#### Validação de Campo

```json
{
  "detail": "Nome da atividade é obrigatório",
  "error_code": "VALIDATION_ERROR",
  "field": "nome"
}
```

#### Recurso Não Encontrado

```json
{
  "detail": "Atividade não encontrada",
  "error_code": "NOT_FOUND"
}
```

#### Autenticação Falhou

```json
{
  "detail": "Token de autenticação inválido ou expirado",
  "error_code": "UNAUTHORIZED"
}
```

### Tratamento no Código

```typescript
try {
  const atividade = await criarAtividade(dados);
  console.log('Sucesso:', atividade);
} catch (error) {
  if (error instanceof Error) {
    // A mensagem já vem formatada do apiService
    console.error('Erro:', error.message);

    // Exibir mensagem para o usuário
    mostrarMensagemErro(error.message);
  }
}
```

---

## Exemplos de Uso

### Fluxo Completo: Criar e Listar Atividades

```typescript
import {
  criarAtividade,
  listarAtividades,
  listarProjetos
} from './services/apiService';

async function fluxoCompleto() {
  try {
    // 1. Listar projetos disponíveis
    const projetos = await listarProjetos();
    console.log('Projetos:', projetos.map(p => p.nome));

    // 2. Criar nova atividade
    const novaAtividade = {
      nome: 'Implementar Dashboard',
      descricao: 'Criar dashboard de métricas',
      ativo: true,
      id_projeto: projetos[0].id
    };

    const atividadeCriada = await criarAtividade(novaAtividade);
    console.log('Atividade criada:', atividadeCriada.id);

    // 3. Listar todas as atividades
    const atividades = await listarAtividades();
    console.log(`Total: ${atividades.length} atividades`);

    atividades.forEach(ativ => {
      console.log(`- ${ativ.nome} (${ativ.nome_projeto})`);
    });

  } catch (error) {
    console.error('Erro:', error);
  }
}

fluxoCompleto();
```

### Filtrar Atividades Ativas

```typescript
import { listarAtividades } from './services/apiService';

async function listarAtivas() {
  const todasAtividades = await listarAtividades();

  // Filtrar apenas ativas
  const ativas = todasAtividades.filter(ativ => ativ.ativo);

  console.log(`Atividades ativas: ${ativas.length}`);
  return ativas;
}
```

### Atualizar Status de Atividade

```typescript
import {
  atualizarAtividade,
  listarAtividades
} from './services/apiService';

async function desativarAtividade(atividadeId: string) {
  // Buscar atividade atual
  const atividades = await listarAtividades();
  const atividade = atividades.find(a => a.id === atividadeId);

  if (!atividade) {
    throw new Error('Atividade não encontrada');
  }

  // Atualizar status
  const atualizada = await atualizarAtividade(atividadeId, {
    ...atividade,
    ativo: false
  });

  console.log('Atividade desativada:', atualizada.nome);
  return atualizada;
}
```

### Excluir Múltiplas Atividades

```typescript
import { excluirAtividade } from './services/apiService';

async function excluirVarias(ids: string[]) {
  const resultados = await Promise.allSettled(
    ids.map(id => excluirAtividade(id))
  );

  const sucesso = resultados.filter(r => r.status === 'fulfilled').length;
  const falhas = resultados.filter(r => r.status === 'rejected').length;

  console.log(`Excluídas: ${sucesso}, Falhas: ${falhas}`);

  return { sucesso, falhas };
}
```

---

## Boas Práticas

### 1. Sempre Tratar Erros

```typescript
try {
  await criarAtividade(dados);
} catch (error) {
  // Sempre trate os erros
  console.error(error);
  mostrarMensagemParaUsuario('Erro ao criar atividade');
}
```

### 2. Validar Dados Antes de Enviar

```typescript
function validarAtividade(atividade: Atividade): boolean {
  if (!atividade.nome || atividade.nome.trim() === '') {
    throw new Error('Nome é obrigatório');
  }

  if (!atividade.id_projeto) {
    throw new Error('Projeto é obrigatório');
  }

  return true;
}

// Usar antes de criar
if (validarAtividade(dados)) {
  await criarAtividade(dados);
}
```

### 3. Usar Loading States

```typescript
async function carregarAtividades() {
  setLoading(true);

  try {
    const atividades = await listarAtividades();
    setAtividades(atividades);
  } catch (error) {
    setErro(error.message);
  } finally {
    setLoading(false);
  }
}
```

### 4. Cache de Dados

```typescript
let cacheProje project: Projeto[] | null = null;

async function obterProjetos(forcarRecarregar = false): Promise<Projeto[]> {
  if (cacheProjetos && !forcarRecarregar) {
    return cacheProjetos;
  }

  cacheProjetos = await listarProjetos();
  return cacheProjetos;
}
```

---

## Referências

- Código fonte: [src/services/apiService.ts](../src/services/apiService.ts)
- Testes: [src/services/__tests__/apiService.test.ts](../src/services/__tests__/apiService.test.ts)
- README principal: [README.md](../README.md)
