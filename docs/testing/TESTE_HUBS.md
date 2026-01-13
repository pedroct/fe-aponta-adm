# 🧪 Guia de Testes - Collection Hub vs Project Hub

**Data:** 13 de janeiro de 2026  
**Arquivo VSIX:** `sefaz-ceara.aponta-gestao-1.0.0.vsix`  
**Status:** Pronto para testes

---

## 📦 Pré-Requisitos

1. **Acesso ao Azure DevOps**: Conta com permissões de Organização Admin (para Collection Hub) e Project Admin (para Project Hub)
2. **Arquivo VSIX**: `sefaz-ceara.aponta-gestao-1.0.0.vsix` gerado em `npm run package`
3. **API Rodando**: Backend da API deve estar acessível em `https://api-aponta.pedroct.com.br`

---

## 🔧 Instalação da Extensão

### Opção 1: Instalação Local (Desenvolvimento)

1. Abra Azure DevOps
2. Vá para **Organização → Admin** (ícone de engrenagem)
3. Clique em **Extensions**
4. Clique em **Upload new extension**
5. Selecione o arquivo: `sefaz-ceara.aponta-gestao-1.0.0.vsix`
6. Confirme
7. A extensão será instalada em sua organização

### Opção 2: Instalação via Marketplace (Produção)

_Não abordado neste guia - consulte documentação oficial do Azure DevOps_

---

## 🎯 Teste 1: Collection Admin Hub

### Objetivo
Validar que o hub funciona em nível de **Organização/Coleção** com:
- ✅ Dropdown de projetos visível
- ✅ Pode gerenciar atividades de **qualquer projeto**
- ✅ Vê atividades de **todos os projetos**

### Passos

#### 1️⃣ Acessar Collection Hub

1. Abra Azure DevOps
2. Navegue para **Organização → Admin**
3. No menu esquerdo, procure por **Aponta: Gerir Atividades (Organização)**
4. Clique nela

**Esperado:**
```
[✓] Página carrega sem erros
[✓] Título: "Gestão de Atividades"
[✓] Dropdown com label "Projeto *" visível
[✓] Console mostra: "[AtividadesCadastro] Detectado: Collection Admin Hub"
```

#### 2️⃣ Validar Lista de Projetos

1. Verifique o **Dropdown de Projetos**
2. Clique para expandir

**Esperado:**
```
[✓] Dropdown NÃO está desabilitado
[✓] Lista contém todos os projetos da organização
[✓] Exemplo: "Projeto A", "Projeto B", "Projeto C"
```

#### 3️⃣ Selecionar um Projeto e Criar Atividade

1. Selecione um projeto no dropdown: **"Projeto A"**
2. Preencha os campos:
   - Nome: `Teste Collection Hub - Projeto A`
   - Descrição: `Atividade criada para validação do Collection Hub`
3. Clique em **"Adicionar"**

**Esperado:**
```
[✓] Mensagem de sucesso: "Atividade criada com sucesso! 🎉"
[✓] Console mostra projeto selecionado
[✓] Atividade aparece na tabela com projeto correto
```

#### 4️⃣ Criar Atividade em Outro Projeto

1. Selecione diferente projeto: **"Projeto B"**
2. Preencha:
   - Nome: `Teste Collection Hub - Projeto B`
   - Descrição: `Atividade em projeto diferente`
3. Clique em **"Adicionar"**

**Esperado:**
```
[✓] Nova atividade criada em "Projeto B"
[✓] Tabela mostra ambas atividades:
    - "Teste Collection Hub - Projeto A" (Projeto A)
    - "Teste Collection Hub - Projeto B" (Projeto B)
```

#### 5️⃣ Verificar Dados na Tabela

**Colunas esperadas:**
- Atividade
- Projeto
- Descrição
- Criado por
- Ativo (checkbox)
- Ações (Editar, Deletar)

**Esperado:**
```
[✓] Ambas atividades listadas
[✓] Nomes de projetos corretos (Projeto A, Projeto B)
[✓] Descrição completa visível
[✓] Botões de editar/deletar funcionando
```

---

## 🎯 Teste 2: Project Admin Hub

### Objetivo
Validar que o hub funciona em nível de **Projeto** com:
- ✅ Campo de projeto **read-only** (não editável)
- ✅ Mostra apenas o projeto atual
- ✅ Pode gerenciar atividades apenas **deste projeto**
- ✅ Vê apenas atividades **deste projeto**

### Passos

#### 1️⃣ Acessar Project Hub - Projeto A

1. Abra Azure DevOps
2. Navegue para **Projeto A → Settings**
3. No menu esquerdo, procure por **Aponta: Gerir Atividades (Projeto)**
4. Clique nela

**Esperado:**
```
[✓] Página carrega sem erros
[✓] Título: "Gestão de Atividades"
[✓] Campo "Projeto" é um TextField READ-ONLY (não dropdown)
[✓] Contém: "Projeto A"
[✓] Mensagem: "ℹ️ Você pode gerenciar atividades apenas para este projeto."
[✓] Console mostra: "[AtividadesCadastro] Detectado: Project Admin Hub"
[✓] Console mostra: "[AtividadesCadastro] Projeto: Projeto A"
```

#### 2️⃣ Validar Campo Read-Only

1. Tente clicar no campo de Projeto
2. Tente editar o valor

**Esperado:**
```
[✓] Campo NÃO é editável
[✓] Mostrar apenas "Projeto A"
[✓] Sem dropdown, sem seleção
```

#### 3️⃣ Verificar Atividades Filtradas

1. Verifique a tabela de atividades

**Esperado:**
```
[✓] Mostra APENAS atividades do "Projeto A"
[✓] "Teste Collection Hub - Projeto A" PRESENTE ✓
[✓] "Teste Collection Hub - Projeto B" AUSENTE ✗
[✓] Somente atividades criadas para este projeto aparecem
```

#### 4️⃣ Criar Atividade no Project Hub

1. Preencha os campos:
   - Nome: `Teste Project Hub - Projeto A`
   - Descrição: `Atividade criada via Project Hub`
2. Clique em **"Adicionar"**

**Esperado:**
```
[✓] Mensagem de sucesso: "Atividade criada com sucesso! 🎉"
[✓] Console NÃO mostra seleção de dropdown
[✓] Console mostra: "[AtividadesCadastro] Project Hub - Usando projeto do contexto"
[✓] Atividade criada automaticamente com projeto do contexto
[✓] Nova atividade aparece na tabela
```

#### 5️⃣ Tentar Acessar Projeto B

1. Navegue para **Projeto B → Settings**
2. Clique em **Aponta: Gerir Atividades (Projeto)**

**Esperado:**
```
[✓] Página mostra "Projeto B" no campo read-only
[✓] Console mostra: "[AtividadesCadastro] Projeto: Projeto B"
[✓] Tabela mostra APENAS atividades do "Projeto B":
    - "Teste Collection Hub - Projeto B" PRESENTE ✓
    - "Teste Collection Hub - Projeto A" AUSENTE ✗
    - "Teste Project Hub - Projeto A" AUSENTE ✗
```

#### 6️⃣ Criar Atividade no Project B Hub

1. Preencha:
   - Nome: `Teste Project Hub - Projeto B`
   - Descrição: `Atividade no Project Hub do Projeto B`
2. Clique em **"Adicionar"**

**Esperado:**
```
[✓] Atividade criada no "Projeto B"
[✓] Tabela mostra nova atividade
[✓] Voltar para "Projeto A → Aponta" e validar que NÃO aparece aqui
```

---

## 🔐 Teste 3: Validações de Segurança

### Objetivo
Garantir que a separação entre hubs é segura.

### Teste 3.1: Collection Hub - Acesso a Todos Projetos

**Passos:**
1. No Collection Hub, crie atividade em cada projeto:
   - Projeto A
   - Projeto B
   - Projeto C (se existir)

**Validar:**
```
[✓] Todos os projetos acessíveis via dropdown
[✓] Pode criar atividades em qualquer um
[✓] Tabela final mostra:
    - Todas atividades de todos os projetos
    - Totalizando ~6 atividades (3 projects × 2 atividades cada)
```

### Teste 3.2: Project Hub - Acesso Restrito

**Passos:**
1. Acesse Project A Hub
2. Verifique dados visíveis
3. Mude para Project B Hub
4. Verifique dados visíveis

**Validar:**
```
[✓] Project A Hub vê APENAS atividades do Projeto A
[✓] Project B Hub vê APENAS atividades do Projeto B
[✓] Dados isolados corretamente por projeto
[✓] Nenhuma "vazamento" de dados entre projetos
```

### Teste 3.3: Autenticação

**Passos:**
1. Abra DevTools Console (F12)
2. Procure por logs com "token" ou "Authorization"
3. Verifique que requisições incluem token

**Validar:**
```
[✓] Logs mostram "[AtividadesCadastro]" com mensagens de SDK pronto
[✓] Requisições contêm Authorization header
[✓] Token válido para operações (criar, listar, deletar)
```

---

## 📊 Matriz de Testes

| Teste | Collection Hub | Project Hub |
|-------|:---------------:|:------------:|
| Dropdown de projetos | ✅ Visível | ❌ Oculto |
| Campo projeto editável | ✅ Sim | ❌ Não |
| Vê atividades de múltiplos projetos | ✅ Sim | ❌ Não |
| Pode criar em qualquer projeto | ✅ Sim | ❌ Não |
| Isolamento de dados | ❌ Não | ✅ Sim |
| Filtragem automática | ❌ Não | ✅ Sim |

---

## 🐛 Troubleshooting

### Problema: "Nenhum projeto disponível"
**Causa:** API retornou lista vazia  
**Solução:**
1. Verificar se API está rodando: `curl https://api-aponta.pedroct.com.br/api/v1/projetos`
2. Verificar token de autenticação
3. Verificar conectividade de rede

### Problema: Atividades não aparecem
**Causa:** Erro ao carregar da API  
**Solução:**
1. Abra DevTools (F12)
2. Console → Procure por `[AtividadesCadastro] Erro`
3. Verifique o erro específico
4. Verifique se backend está respondendo

### Problema: Campo projeto não é read-only em Project Hub
**Causa:** Hub mode não foi detectado corretamente  
**Solução:**
1. Recarregue a página
2. Verifique Console: `[AtividadesCadastro] Detectado: Project Admin Hub`
3. Se não aparecer, há problema com SDK.getPageContext()

### Problema: Atividade criada não filtra por projeto
**Causa:** Função loadAtividadesForProject não chamada  
**Solução:**
1. Verifique Console: `[AtividadesCadastro] Project Hub - Usando projeto do contexto`
2. Se não aparecer, há problema em detectHubMode()

---

## ✅ Checklist Final

### Collection Hub
- [ ] Dropdown de projetos visível e funcional
- [ ] Pode criar atividades em múltiplos projetos
- [ ] Tabela mostra todas atividades
- [ ] Nomes de projetos corretos na tabela
- [ ] Editar/deletar funcionando

### Project Hub
- [ ] Campo projeto read-only mostra projeto atual
- [ ] Mensagem informativa visível
- [ ] Tabela mostra APENAS atividades do projeto
- [ ] Criar atividade usa automaticamente projeto do contexto
- [ ] Dados isolados por projeto (não vaza entre hubs)

### Geral
- [ ] Sem erros no Console
- [ ] Sem erros de rede
- [ ] Logs esperados aparecem
- [ ] Performance aceitável
- [ ] UI responsiva

---

## 📝 Logs Esperados no Console

### Collection Hub (Inicialização)
```
[AtividadesCadastro] Component montado
[AtividadesCadastro] SDK pronto
[AtividadesCadastro] Detectando hub mode...
[AtividadesCadastro] Detectado: Collection Admin Hub
Carregando atividades da API...
[AtividadesCadastro] Inicialização completa
```

### Project Hub (Inicialização)
```
[AtividadesCadastro] Component montado
[AtividadesCadastro] SDK pronto
[AtividadesCadastro] Detectando hub mode...
[AtividadesCadastro] Detectado: Project Admin Hub
[AtividadesCadastro] Projeto: Projeto A
[AtividadesCadastro] Carregando atividades do projeto: proj-id-123
[AtividadesCadastro] Inicialização completa
```

### Criar Atividade
```
[AtividadesCadastro] Project Hub - Usando projeto do contexto: proj-id-123
[AtividadesCadastro] Criando atividade...
[AtividadesCadastro] Atividade criada com sucesso
```

---

## 📞 Contato / Suporte

Caso encontre issues:
1. Capture screenshot
2. Copie logs do console (F12)
3. Informe qual hub foi testado
4. Descreva exatamente o comportamento inesperado

---

**Boa sorte nos testes! 🚀**
