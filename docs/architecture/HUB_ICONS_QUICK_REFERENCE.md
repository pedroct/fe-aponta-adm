# ⚡ Quick Reference - Hub Icons

Implementação de ícones para os hubs da extensão Azure DevOps.

## 📍 Localização dos Ícones

```
public/
└── icons/
    └── hub-icon.png              # Ícone multi-color (17.43 KB)
```

## 🔧 Arquivo de Configuração

**Arquivo:** `vss-extension.json`

### Collection Hub Icon
```json
{
  "id": "aponta-adm-collection-hub",
  "type": "ms.vss-web.hub",
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

### Project Hub Icon
```json
{
  "id": "aponta-adm-project-hub",
  "type": "ms.vss-web.hub",
  "properties": {
    "name": "Gestão do Aponta PROJ",
    "iconAsset": "sefaz-ceara.aponta-gestao/public/icons/hub-icon.png",
    "includesData": {
      "assets": [
        "sefaz-ceara.aponta-gestao/public/icons/hub-icon.png"
      ]
    }
  }
}
```

### File Declaration
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

## 📦 Build Output

Ao compilar, o ícone é automaticamente copiado:

```
dist/
└── icons/
    └── hub-icon.png              # Copiado pelo webpack
```

**Log do build:**
```
asset icons/hub-icon.png 17.4 KiB [emitted] [from: public/icons/hub-icon.png] [copied]
```

## 🎨 Ícone Atual

- **Nome:** `calendar_checkmark_16_regular_multi-color.png`
- **Tamanho:** 17.43 KB
- **Tipo:** PNG com suporte multi-color
- **Uso:** Collection e Project Admin Hubs

## 📚 Documentação Relacionada

- **Implementação Completa:** [HUB_ICONS_IMPLEMENTATION.md](HUB_ICONS_IMPLEMENTATION.md)
- **Conformidade Microsoft:** [MICROSOFT_COMPLIANCE.md](MICROSOFT_COMPLIANCE.md)
- **Docs Oficiais:** [Azure DevOps Web Navigation - Hub Icon](https://learn.microsoft.com/en-us/azure/devops/extend/develop/web-navigation?view=azure-devops#hub-icon)

## ✅ Checklist de Produção

Antes de instalar em produção:

- [x] Ícone criado e organizado em `public/icons/`
- [x] vss-extension.json atualizado com `iconAsset`
- [x] vss-extension.json atualizado com `includesData`
- [x] Arquivo registrado em `files` com `addressable: true`
- [x] Build executado com sucesso (0 erros)
- [x] Testes passando (18/18)
- [x] VSIX gerado com ícone incluído
- [x] Documentação atualizada

## 🚀 Instalação em Azure DevOps

1. Baixe o arquivo VSIX mais recente:
   ```
   sefaz-ceara.aponta-gestao-1.0.0.vsix
   ```

2. Acesse sua organização Azure DevOps

3. Vá para: **Organization → Admin → Extensions**

4. Clique em **Upload new extension**

5. Selecione o arquivo `.vsix`

6. Após instalação, os ícones aparecerão nos hubs:
   - Collection Admin Hub (Organization level)
   - Project Admin Hub (Project level)

## 💡 Dicas

- Ícones aparecem apenas em **navegação vertical** (novo Azure DevOps)
- Ícones **não aparecem** em navegação horizontal (modo legado)
- Para diferentes temas (light/dark), use a propriedade `icon` com valores `light` e `dark`
- Para diferentes ícones por hub, especifique `iconAsset` diferentes

## 📝 Mudanças Relacionadas

| Arquivo | Mudança |
|---------|---------|
| `vss-extension.json` | Adicionado `iconAsset` e `includesData` em ambos hubs |
| `vss-extension.json` | Adicionado arquivo `public/icons/hub-icon.png` em `files` |
| `public/icons/` | Diretório criado |
| `public/icons/hub-icon.png` | Ícone copiado |
| `config/webpack.config.js` | Paths corrigidos para `../dist` |
| `config/webpack.dev.config.js` | Paths corrigidos para `../dist` |
| `package.json` | Scripts atualizados com `--config config/webpack.config.js` |

## 🔗 Links Rápidos

- [Hub Icons Implementation](HUB_ICONS_IMPLEMENTATION.md) - Detalhes técnicos
- [Microsoft Compliance](MICROSOFT_COMPLIANCE.md) - Validação com docs Microsoft
- [vss-extension.json](../../vss-extension.json) - Arquivo de configuração
- [public/icons/](../../public/icons/) - Diretório de ícones

---

**Status:** ✅ Implementado e Testado  
**Versão:** 1.0.0  
**Data:** 13 de janeiro de 2026

