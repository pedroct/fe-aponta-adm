# GitFlow - Fluxo de Trabalho

Este projeto segue o modelo **GitFlow** para gerenciamento de branches e versionamento.

## Estrutura de Branches

### 🌳 Branch Principal: `main`
- **Propósito**: Código em produção
- **Estabilidade**: Sempre estável e pronto para deploy
- **Proteção**: Branch protegida, apenas merges via Pull Request
- **Origem dos merges**: Apenas de `release/*` ou `hotfix/*`

### 🔨 Branch de Desenvolvimento: `develop`
- **Propósito**: Integração contínua de features
- **Estabilidade**: Código testado mas não necessariamente em produção
- **Base para**: Criação de `feature/*` e `release/*`
- **Proteção**: Branch protegida, merges via Pull Request

### ✨ Branches de Feature: `feature/*`
- **Propósito**: Desenvolvimento de novas funcionalidades
- **Nomenclatura**: `feature/nome-da-feature`
- **Base**: Sempre criada a partir de `develop`
- **Merge para**: `develop` via Pull Request
- **Ciclo de vida**: Deletada após merge

**Exemplos**:
- `feature/cadastro-usuarios`
- `feature/relatorio-mensal`
- `feature/autenticacao-oauth`

### 🚀 Branches de Release: `release/*`
- **Propósito**: Preparação para lançamento de versão
- **Nomenclatura**: `release/X.Y.Z` (seguindo [Semantic Versioning](https://semver.org/))
- **Base**: Criada a partir de `develop`
- **Merge para**: `main` E `develop`
- **Atividades**: Bug fixes, ajustes finais, atualização de versão
- **Ciclo de vida**: Deletada após merge

**Exemplos**:
- `release/1.0.0` - Primeiro lançamento
- `release/1.1.0` - Nova feature
- `release/2.0.0` - Breaking changes

### 🔥 Branches de Hotfix: `hotfix/*`
- **Propósito**: Correções urgentes em produção
- **Nomenclatura**: `hotfix/X.Y.Z` ou `hotfix/descricao`
- **Base**: Criada a partir de `main`
- **Merge para**: `main` E `develop`
- **Ciclo de vida**: Deletada após merge

**Exemplos**:
- `hotfix/1.0.1` - Correção de bug crítico
- `hotfix/seguranca-autenticacao`

## Fluxo de Trabalho

### 1️⃣ Nova Feature

```bash
# 1. Atualizar develop
git checkout develop
git pull origin develop

# 2. Criar branch de feature
git checkout -b feature/minha-nova-feature

# 3. Desenvolver e commitar
git add .
git commit -m "feat: implementar nova feature"

# 4. Push para o repositório
git push -u origin feature/minha-nova-feature

# 5. Criar Pull Request no GitLab
# feature/minha-nova-feature → develop

# 6. Após aprovação e merge, deletar branch local
git checkout develop
git pull origin develop
git branch -d feature/minha-nova-feature
```

### 2️⃣ Preparar Release

```bash
# 1. Criar branch de release a partir de develop
git checkout develop
git pull origin develop
git checkout -b release/1.1.0

# 2. Atualizar versão no package.json
# 3. Atualizar CHANGELOG.md
# 4. Fazer ajustes finais e correções

git add .
git commit -m "chore: preparar release v1.1.0"

# 5. Push da branch de release
git push -u origin release/1.1.0

# 6. Criar Pull Requests:
# - release/1.1.0 → main
# - release/1.1.0 → develop

# 7. Após merge, criar tag
git checkout main
git pull origin main
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0

# 8. Deletar branch de release
git branch -d release/1.1.0
git push origin --delete release/1.1.0
```

### 3️⃣ Hotfix de Emergência

```bash
# 1. Criar branch de hotfix a partir de main
git checkout main
git pull origin main
git checkout -b hotfix/1.0.1

# 2. Corrigir o bug
git add .
git commit -m "fix: corrigir bug crítico em produção"

# 3. Push da branch de hotfix
git push -u origin hotfix/1.0.1

# 4. Criar Pull Requests:
# - hotfix/1.0.1 → main
# - hotfix/1.0.1 → develop

# 5. Após merge, criar tag
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Hotfix v1.0.1"
git push origin v1.0.1

# 6. Deletar branch de hotfix
git branch -d hotfix/1.0.1
git push origin --delete hotfix/1.0.1
```

## Convenções de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

### Tipos de Commit

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alteração em documentação
- **style**: Formatação, ponto e vírgula, etc (sem mudança de código)
- **refactor**: Refatoração de código
- **test**: Adição ou correção de testes
- **chore**: Tarefas de manutenção, configs, etc
- **perf**: Melhorias de performance
- **ci**: Mudanças em CI/CD
- **build**: Mudanças no sistema de build
- **revert**: Reverter commit anterior

### Formato

```
<tipo>(<escopo>): <descrição curta>

<corpo opcional>

<rodapé opcional>
```

### Exemplos

```bash
# Feature
git commit -m "feat(atividades): adicionar campo de prioridade"

# Bug fix
git commit -m "fix(api): corrigir erro ao listar projetos vazios"

# Documentação
git commit -m "docs: atualizar README com instruções de deploy"

# Breaking change
git commit -m "feat(auth)!: migrar para OAuth 2.0

BREAKING CHANGE: autenticação básica foi removida"
```

## Versionamento Semântico

Seguimos [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH):

- **MAJOR** (X.0.0): Mudanças incompatíveis na API (breaking changes)
- **MINOR** (0.X.0): Novas funcionalidades compatíveis
- **PATCH** (0.0.X): Correções de bugs compatíveis

### Exemplos

- `1.0.0` → `1.0.1`: Correção de bug
- `1.0.1` → `1.1.0`: Nova feature
- `1.1.0` → `2.0.0`: Breaking change

## Pull Requests

### Checklist

Antes de criar um Pull Request, verifique:

- [ ] Código está funcionando localmente
- [ ] Testes estão passando (`npm test`)
- [ ] Cobertura de testes mantida ou melhorada
- [ ] Código segue os padrões do projeto
- [ ] Documentação atualizada (se necessário)
- [ ] Commit messages seguem convenções
- [ ] Branch está atualizada com a base

### Template de PR

```markdown
## Descrição
[Descreva as mudanças realizadas]

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Issues Relacionadas
Closes #[número da issue]

## Checklist
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Código revisado
- [ ] Build está passando
```

## Proteção de Branches

### `main`
- ✅ Requer Pull Request
- ✅ Requer aprovação de pelo menos 1 revisor
- ✅ Requer CI passando
- ❌ Push direto bloqueado
- ❌ Force push bloqueado

### `develop`
- ✅ Requer Pull Request
- ✅ Requer CI passando
- ❌ Push direto bloqueado (exceto emergências)

## Links Úteis

- [Documentação GitFlow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Flow vs GitFlow](https://lucamezzalira.com/2014/03/10/git-flow-vs-github-flow/)

## Dúvidas Frequentes

### Quando usar feature vs hotfix?
- **Feature**: Novas funcionalidades, melhorias planejadas
- **Hotfix**: Bugs críticos em produção que precisam correção imediata

### Posso commitar direto em develop?
Não. Sempre use branches de feature e Pull Requests.

### Como atualizar minha feature com mudanças do develop?
```bash
git checkout feature/minha-feature
git fetch origin
git rebase origin/develop
# Resolver conflitos se necessário
git push --force-with-lease
```

### Quando deletar branches?
- Features e hotfixes: após merge
- Releases: após merge e tag criada
- Nunca: `main` e `develop`

---

**Versão**: 1.0.0
**Última atualização**: 2026-01-10
