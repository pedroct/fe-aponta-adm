# 🏗️ Scaffold Plan - Divisão de Hubs (fe-aponta-adm)

**Data:** 13 de janeiro de 2026  
**Status:** 📋 Planejamento  
**MCP:** @ai-coders/context - scaffoldPlan

---

## 📌 Visão Geral da Alteração

O projeto será dividido em **dois hubs independentes** com funcionalidades específicas:

### Hub 1: Organization Settings (Collection-level Admin)
- **Target:** `ms.vss-web.collection-admin-hub-group`
- **Escopo:** Organização/Coleção
- **Acesso:** Administrador da Organização
- **Permissão:** Gerenciar atividades de **QUALQUER PROJETO** da organização
- **Interface:** Mantém dropdown de projetos (sem restrição)

### Hub 2: Project Settings (Project-level Admin)
- **Target:** `ms.vss-web.project-admin-hub-group`
- **Escopo:** Projeto específico
- **Acesso:** Administrador do Projeto
- **Permissão:** Gerenciar atividades **APENAS do seu projeto**
- **Interface:** Remove dropdown, exibe projeto em label read-only

---

## 🎯 Objetivos

✅ Permitir dois modelos de administração diferentes  
✅ Restringir acesso baseado em escopo (organização vs. projeto)  
✅ Simplificar interface para admins de projeto  
✅ Manter funcionalidade completa para admins de organização  
✅ Obter nome do projeto via SDK para hub de projeto  

---

## 🔍 Análise Técnica

### Diferenças de Contexto

| Aspecto | Collection Hub | Project Hub |
|--------|---|---|
| **pageContext.project** | Pode ser nulo | Sempre disponível |
| **Acesso a projetos** | Todos da organização | Apenas o atual |
| **Hub ID esperado** | `admin.collection-admin-hub` | `admin.project-admin-hub` |
| **Dropdown projetos** | ✅ Necessário | ❌ Remover |

### SDK APIs Necessárias

```typescript
// Obter contexto
const pageContext = SDK.getPageContext();

// Verificar escopo
const projectName = pageContext.project?.name;        // Projeto atual
const projectId = pageContext.project?.id;            // ID do projeto
const collectionName = pageContext.organization?.name; // Organização

// Detectar hub
const hubId = pageContext.webContext?.hub;  // Para determinar qual hub está ativo

// Serviço de projeto (alternativa)
import { CommonServiceIds, IProjectPageService } from "azure-devops-extension-api";

SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService)
  .then(service => service.getProject())
  .then(project => console.log(project.name));
```

---

## 📋 Plano de Implementação

### Fase 1: Atualizar Manifesto (vss-extension.json)

**Ação:** Manter ambos os hubs com targets diferentes

```json
{
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

**Mudanças:**
- ✅ IDs de contribution únicos (`aponta-adm-collection-hub`, `aponta-adm-project-hub`)
- ✅ Nomes diferenciados para identificação no UI
- ✅ Targets específicos para cada hub
- ✅ **AMBOS apontam para mesmo arquivo `dist/index.html`** ✅ CONFIRMADO
  - Válido conforme documentação Microsoft: Add a hub
  - Mesma aplicação React com lógica condicional
  - Detecção de escopo via SDK.getPageContext()
  - Vantagem: Single build output, sem duplicação

---

### Fase 2: Detectar Modo de Execução (Component)

**Arquivo afetado:** [src/components/AtividadesCadastro.tsx](src/components/AtividadesCadastro.tsx)

**Novo estado a adicionar:**
```typescript
interface State {
  // ... estado existente ...
  
  // Novo estado para detectar hub
  hubMode: 'collection' | 'project';      // Qual hub está ativo
  projectNameReadOnly: string | null;      // Nome do projeto (project hub)
  projetoSelecionado: IListBoxItem | undefined;
  isLoadingHubContext: boolean;            // Carregando contexto
}
```

**Lógica de Detecção:**
```typescript
private async detectHubMode(): Promise<void> {
  try {
    const pageContext = SDK.getPageContext();
    
    // Verificar se existe projeto no contexto (project-level hub)
    if (pageContext.project) {
      // Project Admin Hub
      this.safeSetState({
        hubMode: 'project',
        projectNameReadOnly: pageContext.project.name,
        isLoadingHubContext: false,
      });
      
      // Filtrar atividades apenas do projeto atual
      this.loadAtividadesForProject(pageContext.project.id);
    } else {
      // Collection Admin Hub
      this.safeSetState({
        hubMode: 'collection',
        projectNameReadOnly: null,
        isLoadingHubContext: false,
      });
      
      // Carregar todos os projetos e atividades
      this.loadAtividadesAndProjetos();
    }
  } catch (error) {
    console.error('[AtividadesCadastro] Erro ao detectar hub mode:', error);
    this.safeSetState({
      isLoadingHubContext: false,
      errorMessage: 'Erro ao inicializar interface',
    });
  }
}
```

---

### Fase 3: Renderização Condicional

**Arquivo:** [src/components/AtividadesCadastro.tsx](src/components/AtividadesCadastro.tsx)

#### 3.1 Dropdown de Projetos (Condicional)

```typescript
private renderProjetoSection(): React.ReactNode {
  const { hubMode, projectNameReadOnly, projetoSelecionado, projetos, isLoadingProjetos } = this.state;
  
  if (hubMode === 'project' && projectNameReadOnly) {
    // Project Hub: Mostrar como read-only
    return (
      <div className="projeto-section read-only">
        <label>Projeto</label>
        <TextField
          value={projectNameReadOnly}
          readOnly={true}
          placeholder="Projeto"
        />
        <small>Você pode gerenciar atividades apenas para este projeto</small>
      </div>
    );
  }
  
  // Collection Hub: Dropdown normal
  return (
    <div className="projeto-section">
      <label>Projeto *</label>
      <Dropdown
        items={projetos}
        selection={this.projetoSelection}
        disabled={isLoadingProjetos}
        placeholder="Selecione um projeto"
      />
    </div>
  );
}
```

#### 3.2 Método render() atualizado

```typescript
public render(): JSX.Element {
  const { isLoadingHubContext, errorMessage, successMessage } = this.state;
  
  // Ainda carregando contexto
  if (isLoadingHubContext) {
    return <div>Inicializando interface...</div>;
  }
  
  return (
    <div ref={this.rootRef}>
      {errorMessage && (
        <MessageCard severity={MessageCardSeverity.Error} onDismiss={this.handleClearError}>
          {errorMessage}
        </MessageCard>
      )}
      {successMessage && (
        <MessageCard severity={MessageCardSeverity.Success} onDismiss={this.handleClearSuccess}>
          {successMessage}
        </MessageCard>
      )}
      
      <Card title="Formulário de Atividades">
        <div className="form-container">
          <TextField
            value={this.state.nomeAtividade}
            onChange={this.handleNomeChange}
            placeholder="Nome da Atividade"
            required
          />
          <TextField
            value={this.state.descricao}
            onChange={this.handleDescricaoChange}
            placeholder="Descrição"
            multiline
          />
          
          {/* Projeto: renderização condicional */}
          {this.renderProjetoSection()}
          
          <Button
            primary
            text="Criar Atividade"
            onClick={this.handleCreateAtividade}
            disabled={this.state.isLoading}
          />
        </div>
      </Card>
      
      {/* Tabela de atividades */}
      {this.renderTable()}
      
      {/* Dialog confirmação */}
      {this.renderDialog()}
    </div>
  );
}
```

---

### Fase 4: Filtros e Carregamentos

**Arquivo:** [src/components/AtividadesCadastro.tsx](src/components/AtividadesCadastro.tsx)

#### 4.1 Carregamento para Project Hub

```typescript
private async loadAtividadesForProject(projectId: string): Promise<void> {
  this.safeSetState({ isLoadingAtividades: true });
  
  try {
    const allAtividades = await listarAtividades();
    
    // Filtrar apenas atividades do projeto atual
    const filteredAtividades = allAtividades.filter(
      atividade => atividade.id_projeto === projectId
    );
    
    this.safeSetState({
      atividades: filteredAtividades,
      isLoadingAtividades: false,
    });
  } catch (error: any) {
    this.safeSetState({
      errorMessage: error.message || 'Erro ao carregar atividades',
      isLoadingAtividades: false,
    });
  }
}
```

#### 4.2 Validação ao Criar Atividade

```typescript
private handleCreateAtividade = async () => {
  const { nomeAtividade, descricao, projetoSelecionado, hubMode, projectNameReadOnly } = this.state;
  
  if (!nomeAtividade.trim()) {
    this.safeSetState({ errorMessage: 'Nome da atividade é obrigatório' });
    return;
  }
  
  if (hubMode === 'collection' && !projetoSelecionado) {
    this.safeSetState({ errorMessage: 'Selecione um projeto' });
    return;
  }
  
  // Determinar ID do projeto
  const projectId = hubMode === 'project'
    ? (SDK.getPageContext().project?.id || '')
    : (projetoSelecionado?.key || '');
  
  if (!projectId) {
    this.safeSetState({ errorMessage: 'Erro: projeto não identificado' });
    return;
  }
  
  // Prosseguir com criação
  this.safeSetState({ isLoading: true });
  
  try {
    await criarAtividade({
      nome: nomeAtividade,
      descricao,
      ativo: true,
      id_projeto: projectId,
    });
    
    this.safeSetState({
      successMessage: 'Atividade criada com sucesso!',
      nomeAtividade: '',
      descricao: '',
      isLoading: false,
    });
    
    // Recarregar atividades
    if (hubMode === 'project') {
      this.loadAtividadesForProject(projectId);
    } else {
      this.loadAtividadesAndProjetos();
    }
  } catch (error: any) {
    this.safeSetState({
      errorMessage: error.message,
      isLoading: false,
    });
  }
}
```

---

### Fase 5: Atualizar componentDidMount()

**Arquivo:** [src/components/AtividadesCadastro.tsx](src/components/AtividadesCadastro.tsx)

```typescript
public componentDidMount(): void {
  this._isMounted = true;
  
  // 1. Inicializar SDK
  SDK.ready().then(() => {
    // 2. Detectar modo (collection vs project)
    this.detectHubMode();
  }).catch(error => {
    console.error('[AtividadesCadastro] Erro SDK:', error);
    this.safeSetState({
      errorMessage: 'Erro ao inicializar extensão',
      isLoadingHubContext: false,
    });
  });
}
```

---

## 📁 Estrutura de Mudanças

### Arquivos a Modificar

```
1. vss-extension.json
   ├── Adicionar segundo hub com ID único
   ├── Manter IDs de contribution diferentes
   └── Especificar targets diferentes

2. src/components/AtividadesCadastro.tsx
   ├── Adicionar estado: hubMode, projectNameReadOnly
   ├── Nova method: detectHubMode()
   ├── Nova method: loadAtividadesForProject()
   ├── Atualizar: componentDidMount()
   ├── Atualizar: handleCreateAtividade()
   ├── Atualizar: render() com renderProjetoSection()
   └── Atualizar: validações de acesso
```

### Nenhum Arquivo Novo Necessário

✅ Não é necessário criar novos componentes  
✅ Lógica condicional no componente existente  
✅ Mesmo arquivo HTML para ambos os hubs  

---

## 🔄 Fluxo de Execução por Hub

### Scenario A: Usuário em Project Admin Hub

```
1. Extensão carregada
   ↓
2. SDK.ready()
   ↓
3. detectHubMode()
   - pageContext.project ✅ existe
   - hubMode = 'project'
   - projectNameReadOnly = pageContext.project.name
   ↓
4. loadAtividadesForProject(projectId)
   - Filtra apenas atividades do projeto
   ↓
5. render()
   - Mostra projeto em TextField readonly
   - Dropdown oculto
   ↓
6. User cria atividade
   - Usa projectId do contexto
   - Salva para o projeto correto
```

### Scenario B: Usuário em Collection Admin Hub

```
1. Extensão carregada
   ↓
2. SDK.ready()
   ↓
3. detectHubMode()
   - pageContext.project ❌ nulo
   - hubMode = 'collection'
   - projectNameReadOnly = null
   ↓
4. loadAtividadesAndProjetos()
   - Carrega todos os projetos
   - Carrega todas as atividades
   ↓
5. render()
   - Mostra dropdown de projetos
   - TextField readOnly oculto
   ↓
6. User seleciona projeto e cria atividade
   - Usa projectId do dropdown
   - Salva para projeto selecionado
```

---

## 🧪 Testes Necessários

### Teste 1: Project Admin Hub
- [ ] Navegar para Project Settings → Aponta: Gerir Atividades (Projeto)
- [ ] Verificar que dropdown não aparece
- [ ] Verificar que project name aparece readonly
- [ ] Criar atividade sem seleção de projeto
- [ ] Verificar que atividade é criada para o projeto correto
- [ ] Listar atividades - verificar que apenas atividades do projeto aparecem
- [ ] Editar atividade do projeto - sucesso
- [ ] Tentar editar atividade de outro projeto - deve falhar ou não aparecer

### Teste 2: Collection Admin Hub
- [ ] Navegar para Organization Settings → Aponta: Gerir Atividades (Organização)
- [ ] Verificar que dropdown de projetos aparece
- [ ] Verificar que label readonly não aparece
- [ ] Criar atividade sem selecionar projeto - erro
- [ ] Selecionar projeto e criar atividade - sucesso
- [ ] Listar atividades - verificar que todas aparecem
- [ ] Editar atividade de qualquer projeto - sucesso
- [ ] Excluir atividade - sucesso

### Teste 3: Compatibilidade
- [ ] Autenticação via token Azure DevOps
- [ ] CORS correto para ambas as rotas
- [ ] Performance ao carregar 100+ atividades
- [ ] Responsividade em mobile (se aplicável)

---

## ⚠️ Considerações de Segurança

1. **Filtragem no Frontend**
   - ✅ Filtragem visual no dropdown para project hub
   - ⚠️ Backend deve validar que usuário de projeto não acessa outras atividades
   - 🔒 Usar token de autenticação para validação server-side

2. **Permissões**
   - ✅ Azure DevOps SDK garante que só admins acessam settings
   - ✅ SDK fornece token válido para requisições API
   - ⚠️ Certificar que API valida token e permissões

3. **Validação de Projeto**
   - ✅ Usar `pageContext.project.id` como fonte única de verdade em project hub
   - ✅ Nunca confiar em valores do dropdown do lado do cliente
   - ⚠️ Backend deve validar que projeto_id pertence ao projeto autenticado

---

## 📦 Dependências

✅ **Nenhuma dependência nova necessária**

- `azure-devops-extension-sdk` (já presente)
- `react` (já presente)
- Componentes Azure DevOps UI (já presente)

---

## 🚀 Plano de Deployment

### Fase 1: Desenvolvimento Local
1. Implementar mudanças em `AtividadesCadastro.tsx`
2. Atualizar `vss-extension.json`
3. Testar em modo dev (`npm start`)

### Fase 2: Testes Locais
1. Simular ambos os contextos
2. Validar detecção de hub
3. Testar fluxos CRUD

### Fase 3: Publicação
1. Build produção (`npm run build`)
2. Package extensão (`npm run package`)
3. Upload para Azure Marketplace

### Fase 4: Deployment em Org
1. Instalar `.vsix` em Azure DevOps
2. Testar em Project Admin Hub
3. Testar em Collection Admin Hub

---

## 📝 Checklist de Implementação

### Etapa 1: Manifesto
- [ ] Atualizar `vss-extension.json`
- [ ] Validar JSON syntax
- [ ] Verificar IDs únicos

### Etapa 2: Detecção de Hub
- [ ] Adicionar estado `hubMode`
- [ ] Implementar `detectHubMode()`
- [ ] Testar detecção

### Etapa 3: UI Condicional
- [ ] Criar `renderProjetoSection()`
- [ ] Atualizar `render()`
- [ ] Testar rendering

### Etapa 4: Filtros
- [ ] Implementar `loadAtividadesForProject()`
- [ ] Atualizar `handleCreateAtividade()`
- [ ] Testar validações

### Etapa 5: Testes
- [ ] Testes em project hub
- [ ] Testes em collection hub
- [ ] Testes de segurança

### Etapa 6: Documentation
- [ ] Atualizar `CONTEXT.md`
- [ ] Atualizar `README.md`
- [ ] Documentar alterações em changelog

---

## 🎓 Recursos Consultados

1. [Microsoft Learn - Extension Targets](https://learn.microsoft.com/en-us/azure/devops/extend/reference/targets/overview?view=azure-devops)
2. [Azure DevOps Extension SDK Docs](https://learn.microsoft.com/en-us/javascript/api/azure-devops-extension-sdk/)
3. [Azure DevOps Extension API](https://learn.microsoft.com/en-us/javascript/api/azure-devops-extension-api/)
4. Context7 MCP Documentation

---

**Scaffold Plan Completo ✅**  
*Pronto para Implementação*
