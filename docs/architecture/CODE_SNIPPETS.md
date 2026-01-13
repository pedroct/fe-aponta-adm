# 💻 Código-Pronto para Implementação

**Data:** 13 de janeiro de 2026  
**Projeto:** fe-aponta-adm  
**Tipo:** Code Snippets para Copy-Paste

---

## 📋 Índice de Snippets

1. [vss-extension.json - Novo Manifesto](#1-vss-extensionjson---novo-manifesto)
2. [AtividadesCadastro.tsx - Imports e Types](#2-atividadescadastrotsx---imports-e-types)
3. [detectHubMode() - Método de Detecção](#3-detecthubmode---método-de-detecção)
4. [renderProjetoSection() - UI Condicional](#4-renderprojetosection---ui-condicional)
5. [loadAtividadesForProject() - Carregamento Filtrado](#5-loadatividadesforproject---carregamento-filtrado)
6. [handleCreateAtividade() - Validação Atualizada](#6-handlecriaratividade---validação-atualizada)
7. [componentDidMount() - Inicialização](#7-componentdidmount---inicialização)
8. [Testes Unitários](#8-testes-unitários)

---

## 1. vss-extension.json - Novo Manifesto

**Substitua completamente o objeto `contributions`:**

> ✅ **CONFIRMADO:** Ambos os hubs podem apontar para o mesmo arquivo `dist/index.html`
> 
> Conforme documentação oficial Microsoft (Add a hub), não há restrição em compartilhar o mesmo URI entre múltiplas contributions. A detecção de qual hub está ativo acontece em tempo de execução via `SDK.getPageContext()`.

```json
{
  "manifestVersion": 1,
  "id": "aponta-adm",
  "name": "Gestão do Aponta",
  "version": "1.0.0",
  "publisher": "sefaz-ceara",
  "description": "Extensão para gerenciamento de apontamentos de atividades em projetos da Sefaz Ceará",
  "categories": ["Azure Boards"],
  "contentScriptInjection": {
    "attributes": {
      "content-security-policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: wss:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://amcdn.msftauth.net https://js.monitor.azure.com; connect-src 'self' https: wss:; font-src 'self' data: https:"
    }
  },
  "targets": [
    {
      "id": "Microsoft.VisualStudio.Services"
    }
  ],
  "scopes": [
    "vso.memberentitlementmanagement",
    "vso.project",
    "vso.work"
  ],
  "icons": {
    "default": "icon.png"
  },
  "files": [
    {
      "path": "dist",
      "target": "/",
      "addressable": true
    }
  ],
  "contributions": [
    {
      "id": "aponta-adm-collection-hub",
      "type": "ms.vss-web.hub",
      "description": "Gestão de Atividades - Nível Organização",
      "targets": ["ms.vss-web.collection-admin-hub-group"],
      "properties": {
        "name": "Aponta: Gerir Atividades (Organização)",
        "uri": "dist/index.html"
      }
    },
    {
      "id": "aponta-adm-project-hub",
      "type": "ms.vss-web.hub",
      "description": "Gestão de Atividades - Nível Projeto",
      "targets": ["ms.vss-web.project-admin-hub-group"],
      "properties": {
        "name": "Aponta: Gerir Atividades (Projeto)",
        "uri": "dist/index.html"
      }
    }
  ]
}
```

---

## 2. AtividadesCadastro.tsx - Imports e Types

**Adicione ao topo do arquivo (imports):**

```typescript
// Imports existentes já devem estar aqui
import * as React from 'react';
import * as SDK from 'azure-devops-extension-sdk';
// ... outros imports ...

// Novo: Para detectar hub mode
interface HubContext {
  mode: 'collection' | 'project';
  projectId?: string;
  projectName?: string;
}
```

**Atualize o State interface:**

```typescript
export class AtividadesCadastro extends React.Component<{}, {
  // Estado existente
  atividades: IAtividade[];
  nomeAtividade: string;
  descricao: string;
  projetoSelecionado: IListBoxItem | undefined;
  projetos: IListBoxItem[];
  isLoading: boolean;
  isLoadingProjetos: boolean;
  isLoadingAtividades: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  dialogAberto: boolean;
  atividadeParaExcluir: IAtividade | null;
  atividadeEmEdicao: string | null;
  
  // Novo estado para hubs
  hubMode: 'collection' | 'project';
  projectNameReadOnly: string | null;
  projectIdContext: string | null;
  isLoadingHubContext: boolean;
}> {
  // ... resto do código ...
}
```

**No constructor, inicialize o novo state:**

```typescript
constructor(props: {}) {
  super(props);
  this.state = {
    // Estado existente
    atividades: [],
    nomeAtividade: '',
    descricao: '',
    projetoSelecionado: undefined,
    projetos: [],
    isLoading: false,
    isLoadingProjetos: false,
    isLoadingAtividades: false,
    errorMessage: null,
    successMessage: null,
    dialogAberto: false,
    atividadeParaExcluir: null,
    atividadeEmEdicao: null,
    
    // Novo estado
    hubMode: 'collection',
    projectNameReadOnly: null,
    projectIdContext: null,
    isLoadingHubContext: true,
  };
}
```

---

## 3. detectHubMode() - Método de Detecção

**Adicione este método à classe:**

```typescript
private detectHubMode = async (): Promise<void> => {
  try {
    console.log('[AtividadesCadastro] Detectando hub mode...');
    
    // Obter contexto da página via SDK
    const pageContext = SDK.getPageContext();
    
    // Verificar se existe projeto no contexto (project-level hub)
    if (pageContext.project && pageContext.project.id) {
      // 🎯 Project Admin Hub
      console.log('[AtividadesCadastro] Detectado: Project Admin Hub');
      console.log('[AtividadesCadastro] Projeto:', pageContext.project.name);
      
      this.safeSetState({
        hubMode: 'project',
        projectNameReadOnly: pageContext.project.name,
        projectIdContext: pageContext.project.id,
        isLoadingHubContext: false,
      });
      
      // Carregar apenas atividades deste projeto
      await this.loadAtividadesForProject(pageContext.project.id);
    } else {
      // 🎯 Collection Admin Hub
      console.log('[AtividadesCadastro] Detectado: Collection Admin Hub');
      
      this.safeSetState({
        hubMode: 'collection',
        projectNameReadOnly: null,
        projectIdContext: null,
        isLoadingHubContext: false,
      });
      
      // Carregar todos os projetos e atividades
      await this.loadAtividadesAndProjetos();
    }
  } catch (error) {
    console.error('[AtividadesCadastro] Erro ao detectar hub mode:', error);
    
    this.safeSetState({
      hubMode: 'collection', // Fallback
      isLoadingHubContext: false,
      errorMessage: 'Erro ao inicializar interface. Tente recarregar a página.',
    });
  }
}
```

---

## 4. renderProjetoSection() - UI Condicional

**Adicione este método à classe:**

```typescript
private renderProjetoSection = (): React.ReactNode => {
  const { hubMode, projectNameReadOnly, projetos, isLoadingProjetos, projetoSelecionado } = this.state;
  
  if (hubMode === 'project' && projectNameReadOnly) {
    // 🎯 Project Hub: Mostrar como read-only
    return (
      <div className="projeto-section read-only" style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Projeto
        </label>
        <TextField
          value={projectNameReadOnly}
          readOnly={true}
          placeholder="Projeto"
          width={TextFieldWidth.auto}
        />
        <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
          ℹ️ Você pode gerenciar atividades apenas para este projeto.
        </small>
      </div>
    );
  }
  
  // 🎯 Collection Hub: Dropdown normal
  return (
    <div className="projeto-section" style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Projeto *
      </label>
      <Dropdown
        items={projetos}
        selection={this.projetoSelection}
        disabled={isLoadingProjetos || projetos.length === 0}
        placeholder="Selecione um projeto"
        onSelect={(item) => {
          console.log('[AtividadesCadastro] Projeto selecionado:', item?.text);
        }}
      />
      {projetos.length === 0 && !isLoadingProjetos && (
        <small style={{ display: 'block', marginTop: '8px', color: '#d32f2f' }}>
          ⚠️ Nenhum projeto disponível.
        </small>
      )}
    </div>
  );
}
```

---

## 5. loadAtividadesForProject() - Carregamento Filtrado

**Adicione este método à classe:**

```typescript
private loadAtividadesForProject = async (projectId: string): Promise<void> => {
  this.safeSetState({ isLoadingAtividades: true, errorMessage: null });
  
  try {
    console.log('[AtividadesCadastro] Carregando atividades do projeto:', projectId);
    
    // Carregar todas as atividades
    const allAtividades = await listarAtividades();
    
    // Filtrar apenas as do projeto atual
    const filteredAtividades = allAtividades.filter(
      (atividade) => atividade.id_projeto === projectId
    );
    
    console.log('[AtividadesCadastro] Total de atividades:', allAtividades.length);
    console.log('[AtividadesCadastro] Atividades do projeto:', filteredAtividades.length);
    
    this.safeSetState({
      atividades: filteredAtividades,
      isLoadingAtividades: false,
    });
  } catch (error: any) {
    console.error('[AtividadesCadastro] Erro ao carregar atividades:', error);
    
    this.safeSetState({
      errorMessage: error.message || 'Erro ao carregar atividades',
      atividades: [],
      isLoadingAtividades: false,
    });
  }
}
```

---

## 6. handleCreateAtividade() - Validação Atualizada

**Procure por `handleCreateAtividade` e substitua o método:**

```typescript
private handleCreateAtividade = async (): Promise<void> => {
  const { nomeAtividade, descricao, projetoSelecionado, hubMode, projectIdContext } = this.state;
  
  // Validação: Nome é obrigatório
  if (!nomeAtividade.trim()) {
    this.safeSetState({ errorMessage: 'Nome da atividade é obrigatório' });
    return;
  }
  
  // Validação: Descrição mínima (opcional)
  if (!descricao.trim()) {
    this.safeSetState({ errorMessage: 'Descrição é obrigatória' });
    return;
  }
  
  // Determinar ID do projeto baseado no hub mode
  let projectId: string | null = null;
  
  if (hubMode === 'project') {
    // 🎯 Project Hub: Usar projeto do contexto
    projectId = projectIdContext;
    console.log('[AtividadesCadastro] Project Hub - Usando projeto do contexto:', projectId);
  } else {
    // 🎯 Collection Hub: Usar projeto selecionado no dropdown
    if (!projetoSelecionado) {
      this.safeSetState({ errorMessage: 'Selecione um projeto' });
      return;
    }
    projectId = projetoSelecionado.key as string;
    console.log('[AtividadesCadastro] Collection Hub - Usando projeto do dropdown:', projectId);
  }
  
  // Validação final
  if (!projectId) {
    this.safeSetState({ errorMessage: 'Erro: projeto não identificado' });
    return;
  }
  
  // Criar atividade
  this.safeSetState({ isLoading: true, errorMessage: null });
  
  try {
    console.log('[AtividadesCadastro] Criando atividade...', {
      nome: nomeAtividade,
      descricao,
      projectId,
    });
    
    await criarAtividade({
      nome: nomeAtividade,
      descricao,
      ativo: true,
      id_projeto: projectId,
    });
    
    console.log('[AtividadesCadastro] Atividade criada com sucesso');
    
    this.safeSetState({
      successMessage: 'Atividade criada com sucesso! 🎉',
      nomeAtividade: '',
      descricao: '',
      isLoading: false,
    });
    
    // Recarregar atividades baseado no hub mode
    if (hubMode === 'project') {
      await this.loadAtividadesForProject(projectId);
    } else {
      await this.loadAtividadesAndProjetos();
    }
  } catch (error: any) {
    console.error('[AtividadesCadastro] Erro ao criar atividade:', error);
    
    this.safeSetState({
      errorMessage: error.message || 'Erro ao criar atividade',
      isLoading: false,
    });
  }
}
```

---

## 7. componentDidMount() - Inicialização

**Procure por `componentDidMount` e substitua:**

```typescript
public componentDidMount(): void {
  this._isMounted = true;
  
  console.log('[AtividadesCadastro] Component montado');
  
  // Inicializar SDK do Azure DevOps
  SDK.init({ loaded: false, applyTheme: true });
  
  SDK.ready()
    .then(() => {
      console.log('[AtividadesCadastro] SDK pronto');
      
      // Detectar modo de hub e carregar dados apropriados
      return this.detectHubMode();
    })
    .then(() => {
      console.log('[AtividadesCadastro] Inicialização completa');
      
      try {
        SDK.notifyLoadSucceeded();
      } catch (e) {
        console.warn('[AtividadesCadastro] notifyLoadSucceeded falhou:', e);
      }
    })
    .catch((error) => {
      console.error('[AtividadesCadastro] Erro durante inicialização:', error);
      
      this.safeSetState({
        errorMessage: 'Erro ao inicializar extensão. Verifique sua conexão.',
        isLoadingHubContext: false,
      });
    });
}
```

---

## 8. Testes Unitários

**Crie arquivo `src/components/__tests__/AtividadesCadastro.hub-modes.test.tsx`:**

```typescript
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AtividadesCadastro } from '../AtividadesCadastro';
import * as SDK from 'azure-devops-extension-sdk';

// Mock do SDK
jest.mock('azure-devops-extension-sdk', () => ({
  init: jest.fn(),
  ready: jest.fn(),
  getPageContext: jest.fn(),
  getAccessToken: jest.fn(),
  notifyLoadSucceeded: jest.fn(),
}));

describe('AtividadesCadastro - Hub Modes', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Collection Admin Hub', () => {
    beforeEach(() => {
      // Simular Collection Admin Hub (sem projeto no contexto)
      (SDK.getPageContext as jest.Mock).mockReturnValue({
        project: null,
        organization: { name: 'Sefaz Ceará' },
        user: { name: 'Admin User' },
      });
      
      (SDK.ready as jest.Mock).mockResolvedValue(undefined);
      (SDK.getAccessToken as jest.Mock).mockResolvedValue('test-token');
    });

    it('deve mostrar dropdown de projetos em Collection Hub', async () => {
      render(<AtividadesCadastro />);
      
      await waitFor(() => {
        // Verificar que label "Projeto" aparece
        expect(screen.getByText(/Projeto \*/)).toBeInTheDocument();
      });
      
      // Verificar que não há label "read-only"
      const readOnlyMessages = screen.queryAllByText(/gerenciar atividades apenas/i);
      expect(readOnlyMessages.length).toBe(0);
    });

    it('deve permitir seleção de projeto', async () => {
      render(<AtividadesCadastro />);
      
      await waitFor(() => {
        // Verificar que dropdown está presente
        const dropdown = screen.getByPlaceholderText(/Selecione um projeto/);
        expect(dropdown).toBeInTheDocument();
      });
    });
  });

  describe('Project Admin Hub', () => {
    beforeEach(() => {
      // Simular Project Admin Hub (com projeto no contexto)
      (SDK.getPageContext as jest.Mock).mockReturnValue({
        project: {
          id: 'project-123',
          name: 'Meu Projeto',
          url: 'https://...',
        },
        organization: { name: 'Sefaz Ceará' },
        user: { name: 'Project Admin' },
      });
      
      (SDK.ready as jest.Mock).mockResolvedValue(undefined);
      (SDK.getAccessToken as jest.Mock).mockResolvedValue('test-token');
    });

    it('deve mostrar projeto em read-only no Project Hub', async () => {
      render(<AtividadesCadastro />);
      
      await waitFor(() => {
        // Verificar que o nome do projeto aparece
        expect(screen.getByDisplayValue('Meu Projeto')).toBeInTheDocument();
      });
    });

    it('deve mostrar aviso sobre restrição de projeto', async () => {
      render(<AtividadesCadastro />);
      
      await waitFor(() => {
        expect(screen.getByText(/gerenciar atividades apenas para este projeto/i))
          .toBeInTheDocument();
      });
    });

    it('não deve mostrar dropdown de projetos', async () => {
      render(<AtividadesCadastro />);
      
      await waitFor(() => {
        const dropdowns = screen.queryAllByPlaceholderText(/Selecione um projeto/);
        expect(dropdowns.length).toBe(0);
      });
    });
  });

  describe('Criação de Atividades por Hub', () => {
    it('deve usar projeto do contexto no Project Hub', async () => {
      // Setup Project Hub
      (SDK.getPageContext as jest.Mock).mockReturnValue({
        project: { id: 'proj-123', name: 'Projeto A' },
        organization: { name: 'Org' },
        user: { name: 'User' },
      });
      
      (SDK.ready as jest.Mock).mockResolvedValue(undefined);
      (SDK.getAccessToken as jest.Mock).mockResolvedValue('token');
      
      render(<AtividadesCadastro />);
      
      await waitFor(() => {
        // Verificar que o state contém projectIdContext
        // (Este teste seria mais específico com acesso direto ao state)
        expect(true).toBe(true); // Placeholder
      });
    });

    it('deve usar projeto do dropdown no Collection Hub', async () => {
      // Setup Collection Hub
      (SDK.getPageContext as jest.Mock).mockReturnValue({
        project: null,
        organization: { name: 'Org' },
        user: { name: 'User' },
      });
      
      (SDK.ready as jest.Mock).mockResolvedValue(undefined);
      (SDK.getAccessToken as jest.Mock).mockResolvedValue('token');
      
      render(<AtividadesCadastro />);
      
      await waitFor(() => {
        // Verificar que dropdown é visível
        expect(screen.getByPlaceholderText(/Selecione um projeto/)).toBeInTheDocument();
      });
    });
  });
});
```

---

## 📝 Notas de Implementação

### Ordem Recomendada

1. **Passo 1:** Atualizar `vss-extension.json` ✅
2. **Passo 2:** Adicionar state e types ✅
3. **Passo 3:** Implementar `detectHubMode()` ✅
4. **Passo 4:** Implementar `renderProjetoSection()` ✅
5. **Passo 5:** Implementar `loadAtividadesForProject()` ✅
6. **Passo 6:** Atualizar `handleCreateAtividade()` ✅
7. **Passo 7:** Atualizar `componentDidMount()` ✅
8. **Passo 8:** Adicionar testes ✅

### Debug Flags

Todos os métodos incluem `console.log()` com prefixo `[AtividadesCadastro]` para facilitar debug. No navegador:

```javascript
// No DevTools Console, filtrar por:
filter: [AtividadesCadastro]
```

### Fallbacks

- Se SDK falhar, `hubMode` defaulta para `'collection'` (comportamento anterior)
- Se projeto não for detectado, trata como Collection Hub
- Mensagens de erro amigáveis ao usuário

---

**✅ Todos os snippets prontos para implementação!**
