# Fluxo de Trabalho Git - Simplificado

Este projeto utiliza um **fluxo simplificado de Git** adequado para extensões do Azure DevOps sem deploy contínuo.

## Por que Simplificado?

Como este é um projeto de extensão do Azure DevOps:
- ✅ **Sem deploy automatizado** - Extensões são empacotadas manualmente (.vsix)
- ✅ **Versionamento simples** - Controle de versão no marketplace do Azure DevOps
- ✅ **Equipe pequena** - Não precisa de complexidade do GitFlow completo
- ✅ **Foco no código** - Prioridade em manter histórico organizado

## Estrutura de Branches

### 🌳 Branch Principal: `main`
- **Propósito**: Código estável e versionado
- **Conteúdo**: Todas as versões publicadas da extensão
- **Proteção**: Recomendado proteger para merges via Pull Request
- **Tags**: Cada versão publicada deve ter uma tag (v1.0.0, v1.1.0, etc.)

### 🔨 Branch de Desenvolvimento: `develop` (Opcional)
- **Propósito**: Integração de features antes de versionar
- **Uso**: Apenas se houver múltiplas pessoas trabalhando simultaneamente
- **Para equipes pequenas**: Trabalhar direto em `main` com feature branches é suficiente

## Fluxo de Trabalho Recomendado

### Opção 1: Fluxo Simples (Recomendado para equipe pequena)

```bash
# 1. Criar branch para nova funcionalidade/correção
git checkout main
git pull origin main
git checkout -b minha-alteracao

# 2. Desenvolver e commitar
git add .
git commit -m "feat: adicionar nova funcionalidade"

# 3. Push da branch
git push -u origin minha-alteracao

# 4. Criar Pull Request no GitLab
# minha-alteracao → main

# 5. Após aprovação e merge
git checkout main
git pull origin main
git branch -d minha-alteracao
```

### Opção 2: Com Branch Develop (Para equipe maior)

```bash
# 1. Criar branch a partir de develop
git checkout develop
git pull origin develop
git checkout -b minha-feature

# 2. Desenvolver e commitar
git add .
git commit -m "feat: nova feature"

# 3. Criar PR para develop
git push -u origin minha-feature

# 4. Quando pronto para nova versão
git checkout main
git merge develop
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main --tags
```

## Versionamento da Extensão

### Quando Criar Nova Versão

Atualize a versão no `vss-extension.json` quando:
- ✅ Adicionar nova funcionalidade
- ✅ Corrigir bugs importantes
- ✅ Fazer melhorias significativas

### Semantic Versioning

Seguir [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH):

- **MAJOR** (X.0.0): Mudanças incompatíveis (breaking changes)
- **MINOR** (0.X.0): Novas funcionalidades compatíveis
- **PATCH** (0.0.X): Correções de bugs

### Processo de Publicação

```bash
# 1. Atualizar versão no vss-extension.json
# "version": "1.1.0"

# 2. Atualizar package.json (manter sincronizado)
# "version": "1.1.0"

# 3. Commitar mudança de versão
git add vss-extension.json package.json
git commit -m "chore: bump version to 1.1.0"

# 4. Criar tag
git tag -a v1.1.0 -m "Release v1.1.0 - Descrição das mudanças"
git push origin main --tags

# 5. Empacotar extensão
npm run build
npm run package

# 6. Publicar manualmente no Azure DevOps Marketplace
# Upload do arquivo .vsix gerado
```

## Convenções de Commit

Seguir [Conventional Commits](https://www.conventionalcommits.org/) para histórico organizado:

### Tipos de Commit

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alteração em documentação
- **style**: Formatação (sem mudança de lógica)
- **refactor**: Refatoração de código
- **test**: Adição ou correção de testes
- **chore**: Tarefas de manutenção (configs, build, etc.)

### Formato

```
<tipo>: <descrição curta>

<corpo opcional - detalhes da mudança>
```

### Exemplos

```bash
# Nova funcionalidade
git commit -m "feat: adicionar filtro por projeto nas atividades"

# Correção de bug
git commit -m "fix: corrigir erro ao salvar atividade sem descrição"

# Documentação
git commit -m "docs: atualizar README com instruções de instalação"

# Manutenção
git commit -m "chore: atualizar dependências do projeto"

# Com descrição detalhada
git commit -m "feat: implementar paginação na lista de atividades

- Adicionar componente de paginação
- Atualizar API para suportar limit/offset
- Adicionar testes de paginação"
```

## Tags e Releases

### Criar Tag

```bash
# Tag anotada (recomendado)
git tag -a v1.0.0 -m "Release v1.0.0 - Primeira versão estável"

# Push da tag
git push origin v1.0.0

# Ou push de todas as tags
git push origin --tags
```

### Listar Tags

```bash
# Listar todas as tags
git tag

# Ver detalhes de uma tag
git show v1.0.0
```

### Deletar Tag (se necessário)

```bash
# Deletar local
git tag -d v1.0.0

# Deletar remota
git push origin --delete v1.0.0
```

## Pull Requests

### Checklist Antes de Criar PR

- [ ] Código está funcionando localmente
- [ ] Testes estão passando (`npm test`)
- [ ] Build está funcionando (`npm run build`)
- [ ] Código segue os padrões do projeto
- [ ] Commit messages seguem convenções
- [ ] Branch está atualizada com main/develop

### Template de PR

```markdown
## Descrição
[Descreva o que foi implementado/corrigido]

## Tipo de Mudança
- [ ] Nova funcionalidade
- [ ] Correção de bug
- [ ] Documentação
- [ ] Refatoração

## Como Testar
1. [Passo 1]
2. [Passo 2]
3. [Resultado esperado]

## Checklist
- [ ] Código testado localmente
- [ ] Testes passando
- [ ] Build funcionando
- [ ] Documentação atualizada (se necessário)
```

## Boas Práticas

### ✅ Fazer

- **Commits pequenos e frequentes** - Facilita revisão e rollback
- **Mensagens descritivas** - Explique o "porquê", não só o "o quê"
- **Pull Requests** - Sempre revisar código antes de mergear
- **Tags para versões** - Marcar cada versão publicada
- **Testar antes de commitar** - Garantir que não quebra nada
- **Atualizar documentação** - Manter docs sincronizadas com código

### ❌ Evitar

- **Commits gigantes** - Dificulta revisão e debugging
- **Mensagens vagas** - "fix", "update", "changes" não ajudam
- **Push direto em main** - Sempre usar branches e PR
- **Código não testado** - Testar localmente primeiro
- **Versões sem tag** - Toda publicação deve ter tag

## Comandos Úteis

### Atualizar Branch Local

```bash
# Atualizar main local
git checkout main
git pull origin main

# Atualizar sua branch com mudanças do main
git checkout minha-branch
git merge main
# Ou com rebase (histórico mais limpo)
git rebase main
```

### Ver Histórico

```bash
# Histórico resumido
git log --oneline --graph --all

# Últimos 10 commits
git log -10

# Histórico de um arquivo
git log -- caminho/arquivo.ts
```

### Desfazer Mudanças

```bash
# Desfazer mudanças não commitadas
git checkout -- arquivo.ts

# Desfazer último commit (mantém alterações)
git reset --soft HEAD~1

# Desfazer último commit (descarta alterações)
git reset --hard HEAD~1
```

## Proteção de Branches (GitLab)

### Configurar Branch Protegida

No GitLab: **Settings → Repository → Protected Branches**

**Para `main`**:
- ✅ Allowed to merge: Maintainers
- ✅ Allowed to push: No one
- ✅ Require approval before merging: Opcional

## Estrutura Recomendada para Este Projeto

```
Estrutura Simples:
main (branch principal)
  ├── feature-1 (branch temporária)
  ├── bugfix-login (branch temporária)
  └── atualizar-docs (branch temporária)

Após merge, deletar branches temporárias.
```

## FAQ

### Preciso usar branch develop?
**Não obrigatório.** Para equipes pequenas ou projetos simples, trabalhar direto com branches a partir de `main` é suficiente.

### Quando criar uma tag?
Sempre que publicar uma nova versão da extensão no Azure DevOps Marketplace.

### Posso commitar direto em main?
**Não recomendado.** Sempre use branches e Pull Requests para manter histórico organizado e permitir revisão.

### Como sincronizar vss-extension.json com package.json?
Sempre atualizar as duas versões juntas:
```json
// vss-extension.json
"version": "1.1.0"

// package.json
"version": "1.1.0"
```

### O que fazer se errei um commit?
```bash
# Se ainda não fez push
git commit --amend

# Se já fez push
git revert HEAD  # Cria novo commit desfazendo o anterior
```

## Conclusão

Este fluxo simplificado é ideal para:
- ✅ Extensões do Azure DevOps
- ✅ Projetos sem deploy automatizado
- ✅ Equipes pequenas ou médias
- ✅ Foco em versionamento e organização

**Mantenha simples, mas organizado!**

---

**Versão**: 2.0.0 (Simplificado)
**Última atualização**: 2026-01-10
