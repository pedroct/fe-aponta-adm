# ⚙️ Configuração - Arquivos de Build e Ambiente

Arquivos de configuração para webpack, variáveis de ambiente e comportamento de build.

## 📄 Arquivos

### `webpack.config.js`
Configuração principal do webpack para produção e desenvolvimento.

**Configurações:**
- Entry points: `src/index.tsx` (prod) e `src/index-dev.tsx` (dev)
- Output: `dist/index.js` minificado
- Loaders: TypeScript (ts-loader), CSS, HTML
- Plugins: CopyWebpackPlugin, HtmlWebpackPlugin, Dotenv
- Modo: Alternado via `DEV_MODE` environment variable

### `webpack.dev.config.js`
Configuração específica para desenvolvimento local.

**Diferenças:**
- Modo: `development`
- Source maps habilitados
- Watch mode para recompilação automática

### `.env.example`
Template de variáveis de ambiente.

**Uso:**
```bash
cp config/.env.example .env
# Editar .env com seus valores
```

**Variáveis Principais:**
- `AZURE_DEVOPS_URL` - URL da organização
- `PROJECT_NAME` - Nome do projeto
- `EXTENSION_ID` - ID da extensão

## 🚀 Uso

```bash
# Compilar para produção
npm run build

# Compilar para desenvolvimento
npm run build:dev

# Desenvolvimento com watch
npm run dev
```

## 📚 Ver Também

- [README Principal](../../README.md)
- [Guia de Desenvolvimento](../guides/DESENVOLVIMENTO.md)
