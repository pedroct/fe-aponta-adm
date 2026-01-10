# Guia de Testes

Este documento descreve a estratégia de testes, como executar testes e como escrever novos testes para o projeto.

## Índice

- [Tecnologias de Teste](#tecnologias-de-teste)
- [Executando Testes](#executando-testes)
- [Estrutura de Testes](#estrutura-de-testes)
- [Escrevendo Testes](#escrevendo-testes)
- [Cobertura de Código](#cobertura-de-código)
- [Melhores Práticas](#melhores-práticas)

## Tecnologias de Teste

### Framework Principal
- **Vitest 2.1.9** - Framework de testes moderno e rápido, compatível com a API do Jest

### Testing Library
- **@testing-library/react** - Utilitários para testar componentes React
- **@testing-library/jest-dom** - Matchers customizados para assertions DOM
- **@testing-library/user-event** - Simulação avançada de interações do usuário

### Ambiente
- **jsdom** - Implementação JavaScript do DOM para testes Node.js

## Executando Testes

### Comandos Disponíveis

```bash
# Executar todos os testes uma vez
npm test

# Executar testes em modo watch (reexecuta ao salvar)
npm test -- --watch

# Executar testes com interface visual
npm run test:ui

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar apenas testes de um arquivo específico
npm test -- src/services/__tests__/apiService.test.ts

# Executar testes que correspondem a um padrão
npm test -- --grep "deve criar"
```

### Interface Visual do Vitest

A interface visual oferece uma experiência interativa para executar e debugar testes:

```bash
npm run test:ui
```

Acesse `http://localhost:51204/__vitest__/` no navegador.

## Estrutura de Testes

### Organização de Arquivos

```
src/
├── components/
│   ├── AtividadesCadastro.tsx
│   └── __tests__/
│       └── AtividadesCadastro.test.tsx
├── services/
│   ├── apiService.ts
│   └── __tests__/
│       └── apiService.test.ts
└── test/
    └── setup.ts  # Configuração global dos testes
```

### Convenções

- Arquivos de teste usam a extensão `.test.ts` ou `.test.tsx`
- Testes ficam em uma pasta `__tests__` ao lado do arquivo testado
- Cada arquivo de teste deve testar apenas um módulo

## Escrevendo Testes

### Teste de Serviço (API)

Exemplo: [src/services/__tests__/apiService.test.ts](../src/services/__tests__/apiService.test.ts)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { criarAtividade } from '../apiService';

describe('apiService', () => {
  beforeEach(() => {
    // Limpar mocks antes de cada teste
    vi.clearAllMocks();
  });

  describe('criarAtividade', () => {
    it('deve criar uma atividade com sucesso', async () => {
      // Arrange: preparar dados e mocks
      const mockAtividade = {
        nome: 'Teste',
        descricao: 'Descrição',
        ativo: true,
        id_projeto: 'proj-1',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'ativ-1', ...mockAtividade }),
      });

      // Act: executar a função
      const result = await criarAtividade(mockAtividade);

      // Assert: verificar resultados
      expect(result).toHaveProperty('id');
      expect(result.nome).toBe('Teste');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/atividades'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('deve lançar erro quando a requisição falhar', async () => {
      // Arrange
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ detail: 'Erro na API' }),
      });

      // Act & Assert
      await expect(
        criarAtividade({
          nome: 'Teste',
          descricao: 'Desc',
          ativo: true,
          id_projeto: 'proj-1',
        })
      ).rejects.toThrow('Erro na API');
    });
  });
});
```

### Teste de Componente React

Exemplo: [src/components/__tests__/AtividadesCadastro.test.tsx](../src/components/__tests__/AtividadesCadastro.test.tsx)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AtividadesCadastro } from '../AtividadesCadastro';
import * as apiService from '../../services/apiService';

describe('AtividadesCadastro', () => {
  beforeEach(() => {
    // Mock das funções de API
    vi.spyOn(apiService, 'listarProjetos').mockResolvedValue([
      {
        id: 'proj-1',
        nome: 'Projeto Teste',
        descricao: 'Descrição',
        estado: 'ativo',
        external_id: 'ext-1',
        url: 'https://exemplo.com',
        last_sync_at: '2026-01-10',
        created_at: '2026-01-10',
        updated_at: '2026-01-10',
      },
    ]);

    vi.spyOn(apiService, 'listarAtividades').mockResolvedValue([]);
  });

  it('deve renderizar o componente corretamente', async () => {
    // Renderizar componente
    render(<AtividadesCadastro />);

    // Verificar elementos na tela
    await waitFor(() => {
      expect(screen.getByText('Cadastro de Atividades')).toBeInTheDocument();
      expect(screen.getByLabelText('Nome da Atividade')).toBeInTheDocument();
      expect(screen.getByText('Adicionar')).toBeInTheDocument();
    });
  });

  it('deve validar campos obrigatórios ao adicionar atividade', async () => {
    const user = userEvent.setup();
    render(<AtividadesCadastro />);

    // Tentar adicionar sem preencher campos
    const btnAdicionar = screen.getByText('Adicionar');
    await user.click(btnAdicionar);

    // Verificar mensagem de erro
    await waitFor(() => {
      expect(screen.getByText(/preencha todos os campos/i)).toBeInTheDocument();
    });
  });

  it('deve criar uma nova atividade com sucesso', async () => {
    const user = userEvent.setup();

    // Mock da criação
    vi.spyOn(apiService, 'criarAtividade').mockResolvedValue({
      id: 'ativ-2',
      nome: 'Nova Atividade',
      descricao: 'Descrição da atividade',
      ativo: true,
      id_projeto: 'proj-1',
      criado_em: '2026-01-10',
      atualizado_em: '2026-01-10',
    });

    render(<AtividadesCadastro />);

    // Preencher formulário
    await waitFor(() => {
      const inputNome = screen.getByLabelText('Nome da Atividade');
      expect(inputNome).toBeInTheDocument();
    });

    const inputNome = screen.getByLabelText('Nome da Atividade');
    await user.type(inputNome, 'Nova Atividade');

    // Clicar em adicionar
    const btnAdicionar = screen.getByText('Adicionar');
    await user.click(btnAdicionar);

    // Verificar que a função foi chamada
    await waitFor(() => {
      expect(apiService.criarAtividade).toHaveBeenCalled();
    });
  });
});
```

## Cobertura de Código

### Visualizar Relatório de Cobertura

Após executar `npm run test:coverage`, os relatórios são gerados em:

- **Terminal**: Tabela com resumo de cobertura
- **HTML**: `coverage/index.html` (abra no navegador)
- **JSON**: `coverage/coverage-final.json`

### Métricas de Cobertura

A cobertura é medida em quatro dimensões:

1. **Statements** - Porcentagem de declarações executadas
2. **Branches** - Porcentagem de ramificações (if/else) testadas
3. **Functions** - Porcentagem de funções chamadas
4. **Lines** - Porcentagem de linhas executadas

### Metas de Cobertura

- **Serviços críticos (API)**: > 95%
- **Componentes**: > 70%
- **Utilitários**: > 80%
- **Total do projeto**: > 60%

### Arquivos Excluídos

Configurado em [vitest.config.ts](../vitest.config.ts):

```typescript
coverage: {
  exclude: [
    'node_modules/',
    'src/test/',
    '**/*.d.ts',
    '**/*.config.*',
    '**/dist/',
    'webpack.config.js',
  ]
}
```

## Melhores Práticas

### 1. Padrão AAA (Arrange-Act-Assert)

```typescript
it('deve fazer algo', () => {
  // Arrange: preparar dados e estado inicial
  const data = { foo: 'bar' };

  // Act: executar a ação
  const result = minhaFuncao(data);

  // Assert: verificar o resultado
  expect(result).toBe('esperado');
});
```

### 2. Descrições Claras

✅ Bom:
```typescript
it('deve retornar erro quando o nome está vazio', () => {});
```

❌ Ruim:
```typescript
it('testa validação', () => {});
```

### 3. Testes Isolados

Cada teste deve ser independente e não depender de outros testes:

```typescript
describe('MinhaFuncao', () => {
  beforeEach(() => {
    // Resetar estado antes de cada teste
    vi.clearAllMocks();
  });

  it('teste 1', () => {
    // Este teste não afeta outros
  });

  it('teste 2', () => {
    // Começa com estado limpo
  });
});
```

### 4. Mock de Dependências Externas

Sempre faça mock de:
- Chamadas de API (fetch)
- Timers (setTimeout, setInterval)
- Date.now()
- Math.random()
- Módulos externos

```typescript
// Mock de fetch
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'mock' }),
});

// Mock de módulo
vi.mock('../apiService', () => ({
  criarAtividade: vi.fn(),
}));
```

### 5. Testes de Estados de Loading e Erro

Sempre teste:
- Estado inicial (loading)
- Estado de sucesso
- Estado de erro

```typescript
it('deve exibir loading ao carregar dados', async () => {
  render(<MeuComponente />);
  expect(screen.getByText('Carregando...')).toBeInTheDocument();
});

it('deve exibir erro quando falhar', async () => {
  vi.spyOn(apiService, 'listar').mockRejectedValue(new Error('Falha'));
  render(<MeuComponente />);
  await waitFor(() => {
    expect(screen.getByText(/erro/i)).toBeInTheDocument();
  });
});
```

### 6. Uso de waitFor para Operações Assíncronas

```typescript
it('deve carregar dados', async () => {
  render(<MeuComponente />);

  // Aguardar elemento aparecer
  await waitFor(() => {
    expect(screen.getByText('Dados carregados')).toBeInTheDocument();
  });
});
```

### 7. Simular Interações do Usuário

Use `@testing-library/user-event`:

```typescript
import userEvent from '@testing-library/user-event';

it('deve preencher formulário', async () => {
  const user = userEvent.setup();
  render(<Formulario />);

  const input = screen.getByLabelText('Nome');
  await user.type(input, 'João Silva');

  const botao = screen.getByText('Enviar');
  await user.click(botao);

  // Verificações...
});
```

## Debugging de Testes

### 1. Ver HTML Renderizado

```typescript
import { render, screen } from '@testing-library/react';

it('teste', () => {
  const { debug } = render(<MeuComponente />);

  // Imprimir todo o HTML
  debug();

  // Imprimir elemento específico
  debug(screen.getByRole('button'));
});
```

### 2. Usar Console.log

```typescript
it('teste', () => {
  const resultado = minhaFuncao();
  console.log('Resultado:', resultado);
  expect(resultado).toBe('esperado');
});
```

### 3. Executar Apenas um Teste

```typescript
// Usar it.only para executar apenas este teste
it.only('teste específico', () => {
  // ...
});
```

### 4. Pular Testes Temporariamente

```typescript
// Usar it.skip para pular
it.skip('teste com problema', () => {
  // ...
});
```

## Problemas Comuns

### 1. "Cannot find module"

Verifique o [vitest.config.ts](../vitest.config.ts) e o [tsconfig.json](../tsconfig.json) para resolver paths.

### 2. "act(...) warning"

Use `waitFor` para operações assíncronas:

```typescript
await waitFor(() => {
  expect(screen.getByText('Texto')).toBeInTheDocument();
});
```

### 3. Mocks não funcionam

Certifique-se de limpar mocks entre testes:

```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

### 4. Timeout em testes

Aumente o timeout para operações lentas:

```typescript
it('teste lento', async () => {
  // ...
}, 10000); // 10 segundos
```

## Recursos Adicionais

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [User Event API](https://testing-library.com/docs/user-event/intro)

## Conclusão

Manter uma boa cobertura de testes garante:
- ✅ Código mais confiável
- ✅ Refatoração segura
- ✅ Documentação viva
- ✅ Menos bugs em produção
- ✅ Desenvolvimento mais rápido a longo prazo
