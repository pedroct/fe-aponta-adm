# 📖 Referência: Implementação vs Documentação Microsoft

Comparação entre nossa implementação e a documentação oficial do Azure DevOps.

## 🔗 Fonte Oficial

**Microsoft Learn - Azure DevOps Extension Development**  
📚 [Web Navigation - Hub Icon](https://learn.microsoft.com/en-us/azure/devops/extend/develop/web-navigation?view=azure-devops#hub-icon)

## 📋 Padrão Microsoft (Exemplo #1)

```json
{
  "id": "my-extension",
  "publisherId": "my-publisher",
  ...
  "contributions": [
    {
      "id": "example-hub",
      "type": "ms.vss-web.hub",
      "targets": [
        "ms.vss-code-web.code-hub-group"
      ],
      "properties": {
        "name": "My Hub",
        "iconAsset": "my-publisher.my-extension/images/fabrikam-logo.png",
        "includesData": {
          "assets": [
            "my-publisher.my-extension/images/fabrikam-logo.png"
          ]
        }
      }
    }
  ],
  "files": [
    {
      "path": "images/fabrikam-logo.png",
      "addressable": true
    }
  ]
}
```

## ✅ Nossa Implementação

### 1. Estrutura de Arquivos

| Microsoft | Nossa Implementação |
|-----------|-------------------|
| `images/fabrikam-logo.png` | `public/icons/hub-icon.png` |

**Justificativa:** Usamos `public/icons/` para centralizar todos os ícones da extensão, seguindo padrão de projetos web.

### 2. Padrão de iconAsset

**Microsoft:**
```
{publisher-id}.{extension-id}/{asset-path}
my-publisher.my-extension/images/fabrikam-logo.png
```

**Nossa Implementação:**
```
{publisher-id}.{extension-id}/{asset-path}
sefaz-ceara.aponta-gestao/public/icons/hub-icon.png
```

**Mapeamento:**
- `{publisher-id}`: `sefaz-ceara` ✓
- `{extension-id}`: `aponta-gestao` ✓
- `{asset-path}`: `public/icons/hub-icon.png` ✓

### 3. Configuração vss-extension.json

**Nossa Collection Hub:**
```json
{
  "id": "aponta-adm-collection-hub",
  "type": "ms.vss-web.hub",
  "targets": ["ms.vss-web.collection-admin-hub-group"],
  "properties": {
    "name": "Gestão do Aponta ORG",
    "iconAsset": "sefaz-ceara.aponta-gestao/public/icons/hub-icon.png",
    "includesData": {
      "assets": [
        "sefaz-ceara.aponta-gestao/public/icons/hub-icon.png"
      ]
    }
  }
}
```

**Checklist de Conformidade:**
- ✓ `iconAsset` definido com padrão correto
- ✓ `includesData` com lista de assets
- ✓ Arquivo referenciado em `files` com `addressable: true`
- ✓ Tipo de contribution é `ms.vss-web.hub`
- ✓ Target é hub group válido

### 4. Declaração de Arquivo

**Microsoft:**
```json
"files": [
  {
    "path": "images/fabrikam-logo.png",
    "addressable": true
  }
]
```

**Nossa Implementação:**
```json
"files": [
  {
    "path": "dist",
    "target": "/",
    "addressable": true
  },
  {
    "path": "public/icons/hub-icon.png",
    "addressable": true
  }
]
```

**Justificativa:** Mantemos ambas as entradas:
- `dist/` para o build da aplicação
- `public/icons/hub-icon.png` para os ícones

## 📊 Validação Completa

| Critério | Padrão Microsoft | Nossa Implementação | Status |
|----------|-----------------|-------------------|--------|
| Tipo de contribution | `ms.vss-web.hub` | `ms.vss-web.hub` | ✅ |
| Propriedade `iconAsset` | Presente | Presente | ✅ |
| Propriedade `includesData` | Presente | Presente | ✅ |
| Padrão iconAsset | `publisher.extension/path` | `sefaz-ceara.aponta-gestao/public/icons/hub-icon.png` | ✅ |
| Arquivo em `files` | Sim | Sim | ✅ |
| Propriedade `addressable` | `true` | `true` | ✅ |
| Múltiplos hubs | Não documentado | 2 hubs (Collection + Project) | ✅ |
| Ícone copiado em build | N/A | Sim (17.4 KiB) | ✅ |

## 🎨 Opções Alternativas (Documentadas)

### Opção #2: Ícones Diferentes por Tema

**Microsoft documenta:**
```json
{
  "icon": {
    "light": "img/hub-light.png",
    "dark": "img/hub-dark.png"
  }
}
```

**Nossa Escolha:**
- Usamos ícone único que funciona em ambos os temas
- Ícone `calendar_checkmark_16_regular_multi-color.png` é otimizado para ambas as cores
- Se necessário, pode ser expandido para suportar light/dark

## 📝 Próximas Otimizações (Opcional)

Se quiser melhorias futuras:

### 1. Suporte a Diferentes Ícones por Hub
```json
{
  "id": "aponta-adm-collection-hub",
  "properties": {
    "iconAsset": "sefaz-ceara.aponta-gestao/public/icons/hub-icon-collection.png"
  }
}
```

### 2. Suporte a Light/Dark Theme
```json
{
  "id": "aponta-adm-collection-hub",
  "properties": {
    "icon": {
      "light": "sefaz-ceara.aponta-gestao/public/icons/hub-icon-light.png",
      "dark": "sefaz-ceara.aponta-gestao/public/icons/hub-icon-dark.png"
    }
  }
}
```

### 3. Ícones SVG (Escalável)
```json
{
  "iconAsset": "sefaz-ceara.aponta-gestao/public/icons/hub-icon.svg"
}
```

## ✨ Resumo de Conformidade

**Documentação Seguida:** ✅ 100% Conforme  
**Padrão Implementado:** Microsoft Example #1  
**Status de Produção:** ✅ Pronto  

Nossa implementação segue rigorosamente a documentação oficial da Microsoft, com boas práticas adicionais:

- ✅ Estrutura clara de diretórios (`public/icons/`)
- ✅ Padrão correto de `iconAsset`
- ✅ Múltiplos hubs suportados
- ✅ Ícone incluído no pacote VSIX
- ✅ Escalável para futuras melhorias

---

**Referência:** Microsoft Learn - Azure DevOps Web Navigation  
**Acessado em:** 13 de janeiro de 2026  
**Versão da Extensão:** 1.0.0  

