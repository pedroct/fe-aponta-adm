# 🔧 Guia de Resolução - Problemas Encontrados e Soluções

**Data:** 13 de janeiro de 2026  
**Versão da Extensão:** 1.0.0

---

## ❌ Problemas Relatados

### 1. Ícone não está aparecendo no Hub "Gestão do Aponta ORG"

**Status:** ⏳ Requer validação após reinstalação

**Possíveis Causas:**
- Cache do navegador/Azure DevOps
- Extensão anterior ainda em memória
- Arquivo de ícone não incluído corretamente no VSIX

**Solução - Passo a Passo:**

1. **Limpar Cache do Azure DevOps:**
   ```
   DevTools (F12) → Application → Clear Site Data
   Ou: Ctrl+Shift+Delete para limpar cache do navegador
   ```

2. **Desinstalar Extensão Antiga:**
   - Azure DevOps → Organization Settings → Extensions
   - Procure por "Gestão do Aponta" ou "aponta-gestao"
   - Clique em "Disable" ou "Uninstall"
   - Aguarde confirma ção

3. **Reinstalar Nova Versão:**
   - Aguarde 2-3 minutos
   - Upload do novo VSIX: `sefaz-ceara.aponta-gestao-1.0.0.vsix`
   - Clique "Install"

4. **Validar no Console:**
   - Abra DevTools (F12) → Console
   - Procure por erros como:
     - `Failed to load resource: 404`
     - `CORS error`
     - `Icon not found`
   - Se houver erro, reporte a mensagem específica

**Informações Técnicas:**
- **Arquivo do Ícone:** `public/icons/hub-icon.png`
- **Caminho no VSIX:** `sefaz-ceara.aponta-gestao/public/icons/hub-icon.png`
- **Configuração:** Definida em `vss-extension.json` nas linhas 49 e 60

---

### 2. Layout preenchendo todo o espaço com visual ruim

**Status:** ✅ CORRIGIDO

**Mudanças Implementadas:**
- Arquivo CSS criado: `src/styles/atividades.css`
- Altura máxima definida para componentes
- Overflow configurado corretamente
- Responsividade adicionada

**Melhorias Visuais:**
- ✅ Tabela com scroll interno (max-height: 500px)
- ✅ Formulário com padding/margin apropriado
- ✅ Componente respeita viewport height
- ✅ Animação de loading suave
- ✅ Layout responsivo para mobile

---

## 📋 Checklist de Validação

Após reinstalar a extensão, valide:

### ✅ Visual
- [ ] Formulário tem padding adequado
- [ ] Tabela não preenche toda a tela
- [ ] Botões estão visíveis e clicáveis
- [ ] Mensagens de erro/sucesso aparecem
- [ ] Layout responsivo em diferentes tamanhos

### ✅ Funcionalidade
- [ ] Dropdown de projetos carrega corretamente
- [ ] Campos de entrada aceitam dados
- [ ] Botão "Adicionar" funciona
- [ ] Atividades aparecem na tabela
- [ ] Delete/Edit funcionam

### ✅ Ícone
- [ ] Ícone aparece no Hub (Collection Admin)
- [ ] Ícone aparece no Hub (Project Admin)
- [ ] Ícone visível em tema claro
- [ ] Ícone visível em tema escuro
- [ ] Console não mostra erros de ícone

---

## 🔍 Troubleshooting

### Se o ícone ainda não aparecer após reinstalação:

1. **Verifique o VSIX:**
   ```powershell
   # Extrair VSIX (é um arquivo ZIP)
   Expand-Archive sefaz-ceara.aponta-gestao-1.0.0.vsix -DestinationPath vsix-contents
   
   # Verificar estrutura
   ls -R vsix-contents
   ```

2. **Verificar vss-extension.json:**
   - O caminho `iconAsset` está correto?
   - O arquivo existe em `public/icons/hub-icon.png`?
   - A seção `includesData` está presente?

3. **Verificar Console do Azure DevOps:**
   - F12 → Console
   - Procure por mensagens de erro específicas
   - Copie a mensagem completa

4. **Contato para Suporte:**
   - Forneça: Screenshot do erro, URL do Azure DevOps, mensagem do console
   - Arquivo: `sefaz-ceara.aponta-gestao-1.0.0.vsix`

---

## 📦 Novos Arquivos Inclusos

```
src/styles/
└── atividades.css      # Estilos personalizados da extensão

Atualizações:
src/components/
└── AtividadesCadastro.tsx   # Import do novo CSS
```

---

## 🎯 Próximas Etapas Recomendadas

1. **Validar mudanças visuais** - Confirmar que layout melhorou
2. **Validar ícone** - Seguir Troubleshooting acima se necessário
3. **Testar funcionalidades completas** - CRUD de atividades
4. **Validar em diferentes navegadores** - Chrome, Edge, Firefox
5. **Validar em diferentes temas** - Light theme, Dark theme

---

## 📞 Suporte

Se encontrar problemas:
1. Limpar cache (Passo 1 da solução do ícone)
2. Desinstalar/reinstalar extensão
3. Verificar console (F12)
4. Consultar este documento
5. Reporte com detalhes técnicos

---

**Última Atualização:** 13 de janeiro de 2026  
**Versão do Documento:** 1.0

