# 📚 Organização da Documentação

## 🎯 Visão Geral

A documentação está organizada em 5 categorias principais para facilitar a navegação e manutenção.

---

## 📂 Estrutura de Pastas

### 📍 **docs/guides/** - GUIAS DE USO
Documentação **prática** para usuários e desenvolvedores. Como fazer as coisas.

```
guides/
├── INICIAR-WINDOWS.md          # Setup inicial (Windows)
├── DESENVOLVIMENTO.md          # Desenvolvimento local
├── CONTRIBUTING.md             # Como contribuir
├── QUICK_REFERENCE.md          # Comandos úteis
├── PROJECT_STRUCTURE.md        # Visualização da estrutura
├── VALIDATION_CHECKLIST.md     # Validação pós-reorganização
└── README.md                   # Índice de guias
```

**Quando usar:** Você quer saber **como fazer algo**.

---

### 📍 **docs/architecture/** - DOCUMENTAÇÃO TÉCNICA
Documentação **conceitual** sobre design, arquitetura e implementação.

```
architecture/
├── CONTEXT.md                     # Contexto e background
├── SCAFFOLD_PLAN.md               # Plano de estrutura
├── CODE_SNIPPETS.md               # Exemplos de código
├── IMPLEMENTATION_SUMMARY.md      # Sumário de implementações
├── REORGANIZATION_MAP.md          # Mapa de reorganização
├── REORGANIZATION_SUMMARY.md      # Histórico de reorganização
├── HUB_ICONS_IMPLEMENTATION.md    # Implementação de icons
├── HUB_ICONS_QUICK_REFERENCE.md   # Referência de icons
├── MICROSOFT_COMPLIANCE.md        # Conformidade Microsoft
└── README.md                      # Índice de arquitetura
```

**Quando usar:** Você quer **entender por quê** as coisas funcionam assim.

---

### 📍 **docs/api/** - DOCUMENTAÇÃO DE APIs
Documentação de **integração** com APIs externas.

```
api/
├── API.md         # Endpoints e documentação de API
└── README.md      # Índice de APIs
```

**Quando usar:** Você precisa **integrar com uma API**.

---

### 📍 **docs/testing/** - GUIAS DE TESTES
Documentação sobre **testes** (unitários, integração, manuais).

```
testing/
├── TESTING.md           # Guia de testes unitários
├── TESTE_HUBS.md        # Testes manuais em hubs
├── PRONTO_PARA_TESTES.md # Checklist de qualidade
└── README.md            # Índice de testes
```

**Quando usar:** Você quer **testar** a aplicação.

---

### 📍 **docs/troubleshooting/** - RESOLUÇÃO DE PROBLEMAS
Documentação para **diagnosticar e resolver** erros.

```
troubleshooting/
├── TROUBLESHOOTING.md   # Problemas comuns e soluções
└── README.md            # Índice de troubleshooting
```

**Quando usar:** Algo não está funcionando e você quer **achar a solução**.

---

## 🚀 Fluxo de Leitura Recomendado

### 👤 **Novo Usuário**
1. [QUICK_NAVIGATION.md](../QUICK_NAVIGATION.md) ← **COMECE AQUI**
2. [docs/README.md](README.md)
3. [guides/INICIAR-WINDOWS.md](guides/INICIAR-WINDOWS.md)
4. [guides/QUICK_REFERENCE.md](guides/QUICK_REFERENCE.md)

### 👨‍💻 **Desenvolvedor**
1. [guides/DESENVOLVIMENTO.md](guides/DESENVOLVIMENTO.md)
2. [architecture/CONTEXT.md](architecture/CONTEXT.md)
3. [architecture/CODE_SNIPPETS.md](architecture/CODE_SNIPPETS.md)
4. [src/](../../src/) - Código-fonte

### 🧪 **QA/Tester**
1. [testing/TESTING.md](testing/TESTING.md)
2. [testing/TESTE_HUBS.md](testing/TESTE_HUBS.md)
3. [testing/PRONTO_PARA_TESTES.md](testing/PRONTO_PARA_TESTES.md)

### 🔧 **Técnico/DevOps**
1. [architecture/IMPLEMENTATION_SUMMARY.md](architecture/IMPLEMENTATION_SUMMARY.md)
2. [architecture/SCAFFOLD_PLAN.md](architecture/SCAFFOLD_PLAN.md)
3. [guides/CONTRIBUTING.md](guides/CONTRIBUTING.md)

---

## 📌 Convenções de Documentação

### Nomeação de Arquivos
- **MAIUSCULA**: Documentação importante ou índices
- **minuscula**: Documentação secundária
- `README.md`: Sempre em cada pasta como índice

### Estrutura de Arquivo
Cada arquivo deve ter:
1. **Título** (# ... )
2. **Sumário** (opcional)
3. **Conteúdo** organizado em seções
4. **Referências** (links para outros arquivos)

### Links Internos
Use caminhos relativos:
```markdown
[Guia de Desenvolvimento](guides/DESENVOLVIMENTO.md)
[Código de Exemplo](architecture/CODE_SNIPPETS.md)
```

---

## 🔄 Mantendo a Documentação Atualizada

### Quando Adicionar Novo Arquivo
1. Escolha a pasta correta (guides, architecture, etc.)
2. Use nome DESCRITIVO.md
3. Adicione o arquivo ao README.md da pasta
4. Atualize [QUICK_NAVIGATION.md](../QUICK_NAVIGATION.md) se necessário

### Quando Remover Arquivo
1. Verifique referências em outros documentos
2. Atualize ou remova os links
3. Atualize o README.md da pasta

### Quando Mover Arquivo
1. Use `guides/` ou `architecture/` como primeiro nível
2. Atualize TODOS os links
3. Mantenha coerência com outros arquivos da categoria

---

## 📊 Estatísticas da Documentação

| Categoria | Arquivos | Linhas | Propósito |
|-----------|----------|--------|-----------|
| guides/ | 7 | ~1.200 | Como usar |
| architecture/ | 10 | ~2.500 | Entender design |
| api/ | 1 | ~300 | APIs |
| testing/ | 4 | ~800 | Testes |
| troubleshooting/ | 1 | ~200 | Problemas |

**Total:** ~5.000 linhas de documentação

---

## 💡 Dicas

- ✅ Use [QUICK_NAVIGATION.md](../QUICK_NAVIGATION.md) como seu índice principal
- ✅ Mantenha os README.md em cada pasta atualizados
- ✅ Use links relativos para facilitar navegação
- ✅ Organize novo conteúdo em categorias existentes quando possível
- ✅ Revise documentação quando código muda

---

**Última atualização:** 13 de janeiro de 2026
