# Guia de Contribuição

Obrigado por considerar contribuir com o projeto Apontamentos - Extensão Azure DevOps! Este documento fornece diretrizes para contribuir com o projeto.

## Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)

## Código de Conduta

Este projeto e todos os participantes estão comprometidos em manter um ambiente respeitoso e inclusivo. Esperamos que todos:

- Usem linguagem acolhedora e inclusiva
- Respeitem diferentes pontos de vista e experiências
- Aceitem críticas construtivas com elegância
- Foquem no que é melhor para a comunidade
- Demonstrem empatia com outros membros da comunidade

## Como Contribuir

Existem várias formas de contribuir com o projeto:

### 1. Reportar Bugs
- Verifique se o bug já não foi reportado nas Issues
- Crie uma nova issue descrevendo o problema detalhadamente
- Inclua passos para reproduzir o bug
- Informe a versão do projeto e ambiente (navegador, SO, etc.)

### 2. Sugerir Melhorias
- Abra uma issue descrevendo sua sugestão
- Explique o problema que a melhoria resolve
- Forneça exemplos de uso, se possível

### 3. Contribuir com Código
- Escolha uma issue para trabalhar (ou crie uma nova)
- Faça um fork do repositório
- Crie uma branch para sua feature/correção
- Implemente sua mudança
- Escreva ou atualize testes
- Envie um Pull Request

### 4. Melhorar Documentação
- Corrija erros de digitação
- Melhore explicações
- Adicione exemplos
- Traduza documentação

## Configuração do Ambiente

### Pré-requisitos

- Node.js 14+ e npm
- Git
- Editor de código (recomendado: VS Code)

### Setup Inicial

1. **Fork e Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/fe-aponta-adm.git
cd fe-aponta-adm
```

2. **Instalar Dependências**
```bash
npm install
```

3. **Configurar Variáveis de Ambiente**
```bash
# Crie um arquivo .env na raiz
cp .env.example .env

# Edite o .env com suas configurações
API_BASE_URL=http://localhost:8000
AZURE_DEVOPS_PAT=seu-token-aqui
DEV_MODE=true
```

4. **Executar Testes**
```bash
npm test
```

5. **Iniciar Desenvolvimento**
```bash
npm start
```

### Estrutura de Branches

- `main` - branch principal, sempre estável
- `develop` - branch de desenvolvimento
- `feature/nome-da-feature` - novas funcionalidades
- `fix/nome-do-bug` - correções de bugs
- `docs/descricao` - atualizações de documentação

## Padrões de Código

### TypeScript

#### Nomenclatura

```typescript
// Interfaces e Types - PascalCase
interface Atividade {
  nome: string;
}

// Variáveis e Funções - camelCase
const minhaVariavel = 'valor';
function minhaFuncao() {}

// Constantes - UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8000';

// Componentes React - PascalCase
export function AtividadesCadastro() {}
```

#### Tipos Explícitos

```typescript
// ✅ Bom - tipos explícitos
function calcular(a: number, b: number): number {
  return a + b;
}

// ❌ Evitar - tipos implícitos
function calcular(a, b) {
  return a + b;
}
```

#### Async/Await

```typescript
// ✅ Bom - usar async/await
async function carregarDados() {
  try {
    const dados = await apiService.listar();
    return dados;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// ❌ Evitar - callbacks aninhados
function carregarDados(callback) {
  apiService.listar().then(dados => {
    callback(null, dados);
  }).catch(error => {
    callback(error);
  });
}
```

### React

#### Hooks

```typescript
// ✅ Bom - hooks no topo do componente
function MeuComponente() {
  const [estado, setEstado] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  // ... resto do componente
}
```

#### Props e State

```typescript
// Definir interface para props
interface AtividadeProps {
  nome: string;
  onSalvar: (atividade: Atividade) => void;
}

function AtividadeItem({ nome, onSalvar }: AtividadeProps) {
  // ...
}
```

### Comentários

```typescript
// ✅ Bom - comentários úteis
/**
 * Cria uma nova atividade no sistema
 * @param atividade - Dados da atividade
 * @returns Atividade criada com ID
 */
export async function criarAtividade(atividade: Atividade): Promise<AtividadeResponse> {
  // ...
}

// ❌ Evitar - comentários óbvios
// Define a variável nome
const nome = 'teste';
```

### Tratamento de Erros

```typescript
// ✅ Bom - tratamento apropriado
try {
  await criarAtividade(dados);
  mostrarMensagemSucesso('Atividade criada!');
} catch (error) {
  if (error instanceof Error) {
    mostrarMensagemErro(error.message);
  }
  console.error('Erro ao criar atividade:', error);
}

// ❌ Evitar - ignorar erros
try {
  await criarAtividade(dados);
} catch (error) {
  // nada
}
```

## Processo de Pull Request

### Antes de Submeter

1. **Atualize sua branch com a main**
```bash
git checkout main
git pull origin main
git checkout sua-branch
git rebase main
```

2. **Execute os testes**
```bash
npm test
npm run test:coverage
```

3. **Verifique a cobertura de testes**
- Mantenha ou melhore a cobertura existente
- Adicione testes para novo código
- Verifique que todos os testes passam

4. **Execute o linter (se configurado)**
```bash
npm run lint
```

### Template de Pull Request

Ao criar seu PR, inclua:

```markdown
## Descrição
[Descreva suas mudanças aqui]

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Atualização de documentação

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Comentários adicionados onde necessário
- [ ] Documentação atualizada
- [ ] Testes adicionados/atualizados
- [ ] Todos os testes passam
- [ ] Cobertura de testes mantida/melhorada

## Issue Relacionada
Fixes #[número da issue]

## Screenshots (se aplicável)
[Adicione screenshots aqui]

## Testes Realizados
[Descreva como testou as mudanças]
```

### Revisão de Código

Seu PR será revisado considerando:

- **Funcionalidade**: O código faz o que deveria?
- **Qualidade**: O código é limpo e bem estruturado?
- **Testes**: Há testes adequados?
- **Documentação**: A documentação está atualizada?
- **Performance**: Há impactos de performance?
- **Segurança**: Há vulnerabilidades de segurança?

### Após Aprovação

1. Aguarde aprovação de pelo menos um mantenedor
2. Resolva todos os comentários
3. O PR será mesclado pelo mantenedor

## Reportando Bugs

### Antes de Reportar

- Pesquise nas issues existentes
- Verifique se está usando a versão mais recente
- Tente reproduzir o problema em um ambiente limpo

### Template de Bug Report

```markdown
## Descrição do Bug
[Descrição clara e concisa do bug]

## Como Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado
[O que deveria acontecer]

## Comportamento Atual
[O que realmente acontece]

## Screenshots
[Adicione screenshots se aplicável]

## Ambiente
- OS: [ex: Windows 10]
- Navegador: [ex: Chrome 95]
- Versão do Projeto: [ex: 1.0.0]

## Contexto Adicional
[Qualquer informação adicional]

## Possível Solução
[Se você tem ideia de como corrigir]
```

## Sugerindo Melhorias

### Template de Feature Request

```markdown
## Problema a Resolver
[Descreva o problema que sua sugestão resolve]

## Solução Proposta
[Descreva como você imagina a solução]

## Alternativas Consideradas
[Outras soluções que você considerou]

## Contexto Adicional
[Screenshots, links, exemplos, etc.]

## Impacto
- Usuários afetados: [todos/alguns]
- Prioridade sugerida: [baixa/média/alta]
```

## Escrevendo Testes

### Teste de Unidade

```typescript
describe('criarAtividade', () => {
  it('deve criar uma atividade com sucesso', async () => {
    // Arrange
    const mockAtividade = {
      nome: 'Teste',
      descricao: 'Desc',
      ativo: true,
      id_projeto: 'proj-1'
    };

    // Act
    const resultado = await criarAtividade(mockAtividade);

    // Assert
    expect(resultado).toHaveProperty('id');
    expect(resultado.nome).toBe('Teste');
  });
});
```

### Teste de Componente

```typescript
describe('AtividadesCadastro', () => {
  it('deve renderizar corretamente', async () => {
    render(<AtividadesCadastro />);

    await waitFor(() => {
      expect(screen.getByText('Cadastro de Atividades')).toBeInTheDocument();
    });
  });
});
```

## Questões e Suporte

- **Issues**: Para bugs e sugestões
- **Discussões**: Para perguntas e ideias
- **Email**: [adicione email de contato]

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.

## Agradecimentos

Obrigado por contribuir para tornar este projeto melhor! Sua ajuda é muito apreciada.

---

**Dúvidas?** Não hesite em perguntar! Estamos aqui para ajudar novos contribuidores.
