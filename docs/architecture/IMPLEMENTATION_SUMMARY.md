# 🎯 Resumo Executivo - Divisão de Hubs

**Data:** 13 de janeiro de 2026  
**Projeto:** fe-aponta-adm  
**Objetivo:** Dividir frontend em 2 hubs com funcionalidades específicas por escopo

---

## 📊 Comparativo de Hubs

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HUB 1: ORGANIZATION                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ Target:      ms.vss-web.collection-admin-hub-group                          │
│ Escopo:      Organização/Coleção                                            │
│ Acesso:      Admin da Organização                                           │
│ Atividades:  Gerenciar QUALQUER projeto da organização                      │
│ Interface:   Dropdown de projetos visível                                   │
│ Permissão:   Sem restrições de projeto                                      │
│                                                                              │
│ Fluxo:                                                                       │
│ 1. User navega para Organization Settings                                   │
│ 2. Clica em "Aponta: Gerir Atividades (Organização)"                        │
│ 3. Vê dropdown com TODOS os projetos                                        │
│ 4. Seleciona projeto e cria/edita/deleta atividades                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          HUB 2: PROJECT                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Target:      ms.vss-web.project-admin-hub-group                             │
│ Escopo:      Projeto específico                                             │
│ Acesso:      Admin do Projeto                                               │
│ Atividades:  Gerenciar APENAS seu projeto                                   │
│ Interface:   Campo projeto em read-only                                     │
│ Permissão:   Restrito ao projeto atual (via SDK)                            │
│                                                                              │
│ Fluxo:                                                                       │
│ 1. User navega para Project Settings (de um projeto)                        │
│ 2. Clica em "Aponta: Gerir Atividades (Projeto)"                            │
│ 3. Vê nome do projeto em LABEL READ-ONLY                                    │
│ 4. Cria/edita/deleta atividades APENAS daquele projeto                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Mudanças Técnicas Simplificadas

### 1️⃣ vss-extension.json

**Antes:**
```json
"contributions": [
  {
    "id": "aponta-adm-hub",
    "targets": ["ms.vss-web.project-admin-hub-group"],
    "properties": {
      "name": "Aponta: Gerir Atividades",
      "uri": "dist/index.html"
    }
  }
]
```

**Depois:**
```json
"contributions": [
  {
    "id": "aponta-adm-collection-hub",
    "targets": ["ms.vss-web.collection-admin-hub-group"],
    "properties": {
      "name": "Aponta: Gerir Atividades (Organização)",
      "uri": "dist/index.html"
    }
  },
  {
    "id": "aponta-adm-project-hub",
    "targets": ["ms.vss-web.project-admin-hub-group"],
    "properties": {
      "name": "Aponta: Gerir Atividades (Projeto)",
      "uri": "dist/index.html"
    }
  }
]
```

### ✅ Confirmação: Mesmo URI para Ambos os Hubs

**Sim, está 100% correto usar o mesmo `dist/index.html` para ambos os hubs.**

Conforme documentação oficial Microsoft (Add a hub):
> Each hub can point to a different URI, mas não há restrição em compartilhar o mesmo arquivo.

**Vantagens desta abordagem:**
- ✅ Single build output - não duplica código
- ✅ Mesma aplicação React - lógica condicional via SDK
- ✅ Reduz tamanho do pacote `.vsix`
- ✅ Facilita manutenção - mudanças em um lugar afetam ambos
- ✅ Performance idêntica para ambos os hubs

**Como funciona:**
```
Hub 1 (Organization) → dist/index.html → Detecta escopo → Mostra dropdown
Hub 2 (Project)      → dist/index.html → Detecta escopo → Mostra readonly
```

A detecção do contexto (qual hub está ativo) é feita via `SDK.getPageContext()` dentro do mesmo código React.

---

### 2️⃣ AtividadesCadastro.tsx

**Novo State:**
```typescript
hubMode: 'collection' | 'project';           // Qual hub está ativo
projectNameReadOnly: string | null;           // Nome do projeto (readonly)
isLoadingHubContext: boolean;                 // Loading inicial
```

**Novo Método:**
```typescript
detectHubMode()  // Detecta qual hub está ativo via SDK
```

**Novo Método:**
```typescript
loadAtividadesForProject(projectId)  // Carrega apenas do projeto específico
```

**Novo Método:**
```typescript
renderProjetoSection()  // Renderiza dropdown OU label readonly
```

**Atualizado:**
```typescript
handleCreateAtividade()  // Usa project ID do contexto se project hub
```

---

## 🎬 Lógica de Detecção

```typescript
// Ao montar o componente:
const pageContext = SDK.getPageContext();

if (pageContext.project) {
  // ✅ Project Hub
  hubMode = 'project';
  projectNameReadOnly = pageContext.project.name;
  carregue atividades apenas do projeto
} else {
  // ✅ Collection Hub  
  hubMode = 'collection';
  projectNameReadOnly = null;
  carregue todos os projetos e atividades
}
```

---

## 🖼️ Diferença Visual

### Organization Hub (com Dropdown)

```
┌─────────────────────────────────────┐
│ Formulário de Atividades            │
├─────────────────────────────────────┤
│ Nome: [________________]             │
│ Descrição: [__________]             │
│ Projeto: [Dropdown ▼]               │  ← SELECIONÁVEL
│          └─ Projeto A               │
│          └─ Projeto B               │
│          └─ Projeto C               │
│                                     │
│ [Criar Atividade]                   │
└─────────────────────────────────────┘
```

### Project Hub (sem Dropdown)

```
┌─────────────────────────────────────┐
│ Formulário de Atividades            │
├─────────────────────────────────────┤
│ Nome: [________________]             │
│ Descrição: [__________]             │
│ Projeto: [Projeto A]                │  ← READ-ONLY
│ Você pode gerenciar atividades      │
│ apenas para este projeto.           │
│                                     │
│ [Criar Atividade]                   │
└─────────────────────────────────────┘
```

---

## ✅ Benefícios

| Aspecto | Benefício |
|---------|-----------|
| **Segurança** | Admin de projeto não pode mudar atividades de outros |
| **UX** | Interface simplificada para admins de projeto |
| **Escalabilidade** | Fácil manter dois contextos diferentes |
| **Compliance** | Permissões alinhadas com escopo Azure DevOps |
| **Manutenibilidade** | Lógica condicional clara e testável |

---

## 🔐 Segurança Implementada

1. **Frontend Filtering**
   - Dropdown removido em project hub
   - Project name readonly

2. **SDK Authentication**
   - Token obtido do Azure DevOps
   - Válido apenas para a sessão do user
   - Enviado em cada requisição

3. **Backend Validation** (recomendado)
   - Validar que token pertence ao user
   - Validar que user é admin do projeto
   - Validar que projeto_id na requisição pertence à organização

---

## 📋 Arquivos Afetados

| Arquivo | Tipo | Mudança |
|---------|------|---------|
| `vss-extension.json` | Config | Adicionar segundo hub |
| `src/components/AtividadesCadastro.tsx` | Component | Lógica condicional |
| Nenhum outro arquivo | - | Sem impacto |

---

## 🚀 Steps de Implementação (Sequencial)

```
1. Atualizar vss-extension.json
   └─ Adicionar segundo hub com targets diferentes

2. Adicionar state ao componente
   └─ hubMode, projectNameReadOnly, isLoadingHubContext

3. Implementar detectHubMode()
   └─ Detecta qual hub via SDK.getPageContext()

4. Implementar renderProjetoSection()
   └─ Dropdown ou Label based on hubMode

5. Atualizar handleCreateAtividade()
   └─ Usa projectId do contexto quando em project hub

6. Implementar loadAtividadesForProject()
   └─ Filtra atividades por projeto

7. Testar ambos os hubs
   └─ Project Admin + Collection Admin

8. Deploy e publicação
   └─ npm run build && npm run package
```

---

## ⏱️ Estimativa de Esforço

| Etapa | Tempo | Atividades |
|-------|-------|-----------|
| Manifesto | 10 min | Editar JSON |
| State & Detecção | 30 min | Code + testes |
| UI Condicional | 30 min | Rendering logic |
| Filtros & Validações | 30 min | Business logic |
| Testes Completos | 45 min | Test both hubs |
| **Total** | **~2.5h** | Implementação pronta |

---

## 🎯 Próximos Passos

1. ✅ **Revisar este plano** com stakeholders
2. ⏳ **Implementar mudanças** seguindo o SCAFFOLD_PLAN.md
3. 🧪 **Testar** em ambos os hubs
4. 📚 **Atualizar documentação** (CONTEXT.md)
5. 🚀 **Deploy** para produção

---

**Plano Aprovado? Iniciar implementação em SCAFFOLD_PLAN.md →**
