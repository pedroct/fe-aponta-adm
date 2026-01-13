# 🚀 Quick Reference - Hub Division

**Cartão de Referência Rápida**  
*Imprima ou salve como atalho*

---

## 📋 Os 2 Hubs

| Aspecto | Organization Hub | Project Hub |
|---------|---|---|
| **Target** | `collection-admin-hub-group` | `project-admin-hub-group` |
| **Escopo** | Organização | Projeto |
| **Acesso** | Admin Org | Admin Projeto |
| **Projetos** | Todos (dropdown) | Apenas seu (readonly) |
| **Arquivo Config** | vss-extension.json | vss-extension.json |
| **Arquivo Code** | AtividadesCadastro.tsx | AtividadesCadastro.tsx |

---

## 💻 3 Principais Mudanças no Código

### 1️⃣ State (AtividadesCadastro.tsx)
```typescript
// Adicione ao state
hubMode: 'collection' | 'project';
projectNameReadOnly: string | null;
projectIdContext: string | null;
isLoadingHubContext: boolean;
```

### 2️⃣ Detectar Hub (novo método)
```typescript
const pageContext = SDK.getPageContext();
if (pageContext.project) {
  hubMode = 'project';  // ← Project hub
} else {
  hubMode = 'collection'; // ← Collection hub
}
```

### 3️⃣ Renderizar Condicional
```typescript
if (hubMode === 'project') {
  // Mostrar projeto como TextField readonly
} else {
  // Mostrar dropdown de projetos
}
```

---

## 🔑 5 Métodos a Implementar

1. **detectHubMode()** - Detecta qual hub está ativo
2. **renderProjetoSection()** - Renderiza dropdown OU label readonly
3. **loadAtividadesForProject(id)** - Carrega atividades do projeto
4. **handleCreateAtividade()** - Cria usando projeto do contexto (project hub) ou dropdown (collection hub)
5. **componentDidMount()** - Inicia detecção

---

## 📝 Arquivos a Editar

```
vss-extension.json ←— Adicionar segundo hub com targets diferentes
AtividadesCadastro.tsx ←— Toda a lógica de detecção e UI
```

**Nenhum outro arquivo precisa mudar!**

---

## ✅ Checklist Implementação

### Passo 1: Manifesto (10 min)
- [ ] Copiar novo vss-extension.json de CODE_SNIPPETS.md
- [ ] Validar JSON syntax
- [ ] Commit: "feat: add project-level hub to vss-extension.json"

### Passo 2: State (15 min)
- [ ] Adicionar estado novo ao interface State
- [ ] Inicializar no constructor
- [ ] Commit: "feat: add hubMode state to AtividadesCadastro"

### Passo 3: Detecção (20 min)
- [ ] Copiar detectHubMode() de CODE_SNIPPETS.md
- [ ] Implementar em AtividadesCadastro
- [ ] Commit: "feat: implement detectHubMode()"

### Passo 4: UI (30 min)
- [ ] Copiar renderProjetoSection() de CODE_SNIPPETS.md
- [ ] Adicionar em render()
- [ ] Commit: "feat: add conditional project rendering"

### Passo 5: Filtros (30 min)
- [ ] Copiar loadAtividadesForProject() de CODE_SNIPPETS.md
- [ ] Atualizar handleCreateAtividade() de CODE_SNIPPETS.md
- [ ] Commit: "feat: add project-specific filtering"

### Passo 6: Mount (10 min)
- [ ] Atualizar componentDidMount() de CODE_SNIPPETS.md
- [ ] Commit: "feat: update component initialization"

### Passo 7: Testes (45 min)
- [ ] Adicionar testes de CODE_SNIPPETS.md
- [ ] npm test - validar
- [ ] Commit: "test: add hub mode tests"

### Passo 8: Build & Test (30 min)
- [ ] npm run build
- [ ] npm run package
- [ ] Testar em ambos hubs
- [ ] Commit: "chore: validate hub division build"

**Total: ~3 horas**

---

## 🧪 Testes Rápidos (30 min cada)

### Project Hub Test
```
1. Navegar para Project Settings
2. Clicar em "Aponta: Gerir Atividades (Projeto)"
3. ✅ Campo projeto aparece como readonly
4. ✅ Dropdown não aparece
5. ✅ Criar atividade - salva para projeto correto
6. ✅ Listar atividades - mostra apenas do projeto
```

### Collection Hub Test
```
1. Navegar para Organization Settings
2. Clicar em "Aponta: Gerir Atividades (Organização)"
3. ✅ Dropdown de projetos aparece
4. ✅ Campo readonly não aparece
5. ✅ Criar atividade - requer seleção de projeto
6. ✅ Listar atividades - mostra todas
```

---

## 🔒 Segurança (Validar)

- [ ] Token do Azure é enviado em cada requisição
- [ ] Project ID vem do SDK (não user input)
- [ ] Backend valida que user pode acessar projeto
- [ ] Testes de acesso cross-project falham

---

## 📚 Referências Rápidas

**Código:**
- Organization Hub: `ms.vss-web.collection-admin-hub-group`
- Project Hub: `ms.vss-web.project-admin-hub-group`

**SDK:**
```typescript
const pageContext = SDK.getPageContext();
const projectId = pageContext.project?.id;
const projectName = pageContext.project?.name;
```

**Documentação Completa:**
- [CODE_SNIPPETS.md](CODE_SNIPPETS.md) - Código pronto
- [SCAFFOLD_PLAN.md](SCAFFOLD_PLAN.md) - Detalhes técnicos
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Visão geral

---

## 💡 Pro Tips

1. **Use console.log com prefixo:**
   ```typescript
   console.log('[AtividadesCadastro] Mensagem aqui');
   ```
   Depois filtra no DevTools com: `[AtividadesCadastro]`

2. **Sempre validar projetoSelecionado em Collection Hub:**
   ```typescript
   if (!projetoSelecionado) return; // Previne bugs
   ```

3. **Fallback para Collection Hub se SDK falhar:**
   ```typescript
   hubMode = 'collection'; // Safe default
   ```

4. **Testar com diferentes accounts:**
   - Account A: Admin da Organização
   - Account B: Admin do Projeto
   - Validar acesso apropriado

---

## ⏱️ Timeline Realista

| Fase | Tempo | Task |
|------|-------|------|
| Planejamento | 30 min | Ler docs + entender |
| Implementação | 2-3h | Seguir passos 1-8 |
| Testes | 1-2h | Project + Collection hub |
| Code Review | 30 min | Validar com time |
| Deploy | 30 min | Build + package |
| **Total** | **5-6h** | **1 dia dev** |

---

## 🆘 Se Algo Quebrar

1. **Dropdown não aparece em Collection Hub?**
   - Verificar: `hubMode === 'collection'`
   - Verificar: `renderProjetoSection()` está sendo chamado em render()

2. **Readonly não aparece em Project Hub?**
   - Verificar: `pageContext.project` tem valor
   - Verificar: `detectHubMode()` detectou como 'project'

3. **Atividades não filtram?**
   - Verificar: `loadAtividadesForProject()` é chamado
   - Verificar: `projectIdContext` tem valor
   - Check: `atividade.id_projeto === projectId`

4. **Token não é enviado?**
   - Verificar: `SDK.ready()` antes de requisições
   - Verificar: `AuthContext` enviou token para `apiService`
   - Check: Network tab - Authorization header presente

---

## 📞 Contato Rápido

- **Documentação Completa:** SCAFFOLD_PLAN.md
- **Código Pronto:** CODE_SNIPPETS.md
- **Dúvidas Setup:** LEIA-ME-PRIMEIRO.txt
- **Troubleshooting:** docs/TROUBLESHOOTING.md

---

**Print ou salve esta página para referência rápida! 📌**

*Última atualização: 13 de janeiro de 2026*
