# 🔧 Scripts - Automação do Projeto

Scripts de automação, inicialização e testes do projeto fe-aponta-adm.

## 📋 Scripts Disponíveis

### `start.bat`
Script de inicialização rápida para Windows.

```bash
scripts/start.bat
```

**O que faz:**
- Instala dependências (npm install)
- Inicia servidor de desenvolvimento
- Abre a aplicação no navegador

### `test-connection.ps1`
Script PowerShell para testar conexão com Azure DevOps.

```powershell
powershell -ExecutionPolicy Bypass -File scripts/test-connection.ps1
```

**O que faz:**
- Valida conectividade com API
- Verifica autenticação
- Testa endpoints principais

### `reorganize-project.ps1`
Script para reorganizar estrutura do projeto.

```powershell
powershell -ExecutionPolicy Bypass -File scripts/reorganize-project.ps1 -Confirm
```

## 📚 Ver Também

- [Guia de Início Rápido](../guides/INICIAR-WINDOWS.md)
- [Desenvolvimento](../guides/DESENVOLVIMENTO.md)
- [Testes](../testing/TESTING.md)
