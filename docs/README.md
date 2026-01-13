# 📚 Documentação - Índice Central

Documentação completa do projeto fe-aponta-adm, organizada por categorias temáticas.

## 📖 Categorias de Documentação

### 🚀 [Guias de Uso](./guides/)
Instruções práticas para usar e desenvolver o projeto.

- **[INICIAR-WINDOWS.md](./guides/INICIAR-WINDOWS.md)** - Primeiros passos no Windows
- **[DESENVOLVIMENTO.md](./guides/DESENVOLVIMENTO.md)** - Guia de desenvolvimento
- **[CONTRIBUTING.md](./guides/CONTRIBUTING.md)** - Como contribuir
- **[QUICK_REFERENCE.md](./guides/QUICK_REFERENCE.md)** - Referência rápida

### 🏗️ [Arquitetura e Design](./architecture/)
Documentação técnica sobre a arquitetura.

- **[CONTEXT.md](./architecture/CONTEXT.md)** - Análise e contexto
- **[SCAFFOLD_PLAN.md](./architecture/SCAFFOLD_PLAN.md)** - Plano de implementação
- **[IMPLEMENTATION_SUMMARY.md](./architecture/IMPLEMENTATION_SUMMARY.md)** - Resumo
- **[CODE_SNIPPETS.md](./architecture/CODE_SNIPPETS.md)** - Trechos importantes

### 🔌 [API e Integrações](./api/)
Documentação sobre APIs.

- **[API.md](./api/API.md)** - Referência completa de APIs
- **[ACESSO-RAPIDO.md](./api/ACESSO-RAPIDO.md)** - Acesso rápido

### ✅ [Testes](./testing/)
Guias e documentação de testes.
- Tipos e interfaces TypeScript
- Tratamento de erros
- Exemplos de requisições e respostas
- Boas práticas de uso da API

**Quando usar**: Para integrar com a API, entender os endpoints disponíveis ou implementar novas funcionalidades.

---

### 📙 [CONTRIBUTING.md](CONTRIBUTING.md)
**Guia de Contribuição**

Diretrizes para contribuir com o projeto:
- Código de conduta
- Como reportar bugs
- Como sugerir melhorias
- Como contribuir com código
- Configuração do ambiente de desenvolvimento
- Padrões de código (TypeScript, React, nomenclatura)
- Processo de Pull Request
- Escrevendo testes
- Templates de issues e PRs

**Quando usar**: Antes de contribuir com o projeto ou ao onboarding de novos desenvolvedores.

---

### 🔄 [GITFLOW.md](GITFLOW.md)
**Fluxo de Trabalho Git - Simplificado**

Guia do fluxo de trabalho Git adequado para extensões Azure DevOps:
- Estrutura de branches simplificada (main + branches temporárias)
- Fluxo de trabalho recomendado
- Versionamento e publicação de releases
- Convenções de commit (Conventional Commits)
- Tags e gerenciamento de versões
- Pull Requests e code review
- Comandos úteis e boas práticas

**Quando usar**: Para entender como trabalhar com Git no projeto.

---

### 💻 [DESENVOLVIMENTO.md](DESENVOLVIMENTO.md)
**Guia de Desenvolvimento**

Instruções para configurar e desenvolver no projeto:
- Configuração do ambiente
- Estrutura de arquivos e pastas
- Como executar em modo desenvolvimento
- Build e empacotamento
- Integração com Azure DevOps
- Dicas de desenvolvimento

**Quando usar**: Ao configurar o ambiente pela primeira vez ou para referência de comandos.

---

### 🪟 [INICIAR-WINDOWS.md](INICIAR-WINDOWS.md)
**Instruções para Windows**

Guia específico para desenvolvedores usando Windows:
- Pré-requisitos para Windows
- Instalação de dependências
- Configuração de variáveis de ambiente
- Scripts batch para Windows
- Troubleshooting específico do Windows

**Quando usar**: Se você está desenvolvendo em ambiente Windows.

---

### 🔗 [ACESSO-RAPIDO.md](ACESSO-RAPIDO.md)
**Links e Referências Rápidas**

Acesso rápido a recursos importantes:
- Links do projeto
- Documentação externa
- Ferramentas e utilitários
- Recursos do Azure DevOps
- Referências úteis

**Quando usar**: Para acesso rápido a links e recursos frequentemente utilizados.

---

### 🔧 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
**Solução de Problemas**

Guia para resolver problemas comuns:
- Problemas de instalação
- Erros de build
- Problemas com testes
- Questões de integração com Azure DevOps
- FAQ e soluções conhecidas

**Quando usar**: Quando encontrar erros ou problemas durante o desenvolvimento.

---

## Estrutura da Documentação

```
docs/
├── README.md                # Este arquivo (índice)
├── TESTING.md               # Guia de testes
├── API.md                   # Documentação da API
├── CONTRIBUTING.md          # Guia de contribuição
├── GITFLOW.md               # Fluxo de trabalho Git
├── DESENVOLVIMENTO.md       # Guia de desenvolvimento
├── INICIAR-WINDOWS.md       # Instruções para Windows
├── ACESSO-RAPIDO.md         # Links e referências rápidas
└── TROUBLESHOOTING.md       # Solução de problemas
```

## Documentação Principal

Para informações gerais sobre o projeto, instalação, desenvolvimento e uso, consulte o [README.md principal](../README.md).

## Links Rápidos

### Primeiros Passos
- [Instalação](../README.md#instalação)
- [Iniciar no Windows](INICIAR-WINDOWS.md)
- [Configurar Ambiente](DESENVOLVIMENTO.md#configuração-do-ambiente)
- [Acesso Rápido - Links Úteis](ACESSO-RAPIDO.md)

### Desenvolvimento
- [Guia de Desenvolvimento](DESENVOLVIMENTO.md)
- [Executar Testes](TESTING.md#executando-testes)
- [Build e Deploy](../README.md#build-e-deploy)
- [Solução de Problemas](TROUBLESHOOTING.md)

### Git e Versionamento
- [Fluxo de Trabalho](GITFLOW.md#fluxo-de-trabalho-recomendado)
- [Criar Branch](GITFLOW.md#opção-1-fluxo-simples-recomendado-para-equipe-pequena)
- [Versionamento](GITFLOW.md#versionamento-da-extensão)
- [Convenções de Commit](GITFLOW.md#convenções-de-commit)

### Testes
- [Executar Testes](TESTING.md#executando-testes)
- [Cobertura de Código](TESTING.md#cobertura-de-código)
- [Escrever Testes](TESTING.md#escrevendo-testes)
- [Melhores Práticas](TESTING.md#melhores-práticas)

### API
- [Endpoints](API.md#endpoints-de-atividades)
- [Autenticação](API.md#autenticação)
- [Interfaces TypeScript](API.md#tipos-e-interfaces)
- [Tratamento de Erros](API.md#tratamento-de-erros)

### Contribuição
- [Como Contribuir](CONTRIBUTING.md#como-contribuir)
- [Padrões de Código](CONTRIBUTING.md#padrões-de-código)
- [Pull Requests](CONTRIBUTING.md#processo-de-pull-request)
- [Reportar Bugs](CONTRIBUTING.md#reportando-bugs)

## Navegação

- **← Voltar**: [README Principal](../README.md)
- **↑ Topo**: [Índice de Documentação](#índice-de-documentação)

## Atualizações

Esta documentação é mantida atualizada com o projeto. Se encontrar alguma informação desatualizada ou incorreta, por favor [reporte um bug](CONTRIBUTING.md#reportando-bugs).

---

**Versão**: 1.0.0
**Última atualização**: 2026-01-10
