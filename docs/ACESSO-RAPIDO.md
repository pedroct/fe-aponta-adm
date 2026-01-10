# Acesso Rápido à Interface

## 🚀 Solução Mais Simples

### Opção 1: Copiar arquivos para Windows

1. No WSL, execute:
```bash
cp -r dist /mnt/c/Users/pedro/Desktop/fe-aponta-adm-dev
```

2. Abra o **Explorador de Arquivos do Windows**

3. Navegue até `C:\Users\pedro\Desktop\fe-aponta-adm-dev`

4. Clique duas vezes no arquivo `index.html`

A interface abrirá no navegador do Windows! ✨

---

### Opção 2: Executar script de diagnóstico

1. Copie o script para o Windows:
```bash
cp test-connection.ps1 /mnt/c/Users/pedro/Desktop/
```

2. Abra **PowerShell como Administrador** no Windows

3. Navegue até o Desktop:
```powershell
cd C:\Users\pedro\Desktop
```

4. Execute o script:
```powershell
.\test-connection.ps1
```

Isso vai mostrar qual URL está funcionando.

---

### Opção 3: Acessar via arquivo (sem servidor)

Execute no WSL:

```bash
# Copiar dist para área compartilhada
cp -r dist/* /mnt/c/temp-fe-aponta/

# Windows: Abrir no navegador
explorer.exe /mnt/c/temp-fe-aponta/index.html
```

Ou simplesmente:

```bash
# Abrir direto do WSL (se tiver GUI configurado)
xdg-open dist/index.html 2>/dev/null || explorer.exe dist/index.html 2>/dev/null
```

---

## 🔍 Debug: Por que localhost não funciona?

O WSL2 usa uma rede virtualizada (NAT). O `localhost` do Windows ≠ `localhost` do WSL.

### Testar no Windows PowerShell:

```powershell
# Teste 1: localhost
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing

# Teste 2: IP do WSL
Invoke-WebRequest -Uri "http://172.26.70.147:3000" -UseBasicParsing
```

Se **ambos falharem**, o problema é firewall ou rede.

---

## 🔥 Solução Definitiva: Criar regra de Firewall

Abra **PowerShell como Administrador** e execute:

```powershell
# Permitir entrada na porta 3000
New-NetFirewallRule -DisplayName "WSL HTTP Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Verificar se foi criado
Get-NetFirewallRule -DisplayName "WSL HTTP Server"
```

Depois tente acessar novamente:
- `http://localhost:3000`
- `http://172.26.70.147:3000`

---

## ✅ Verificação Rápida

Execute no WSL:

```bash
# Ver se servidor está rodando
curl http://localhost:3000 | head -20

# Se mostrar HTML, servidor está OK!
```

Se mostrar HTML → Servidor está funcionando, problema é no acesso do Windows.

---

## 📞 URL Atual do Servidor

O servidor está rodando em:

- ✅ `http://127.0.0.1:3000` (WSL local)
- ✅ `http://172.26.70.147:3000` (Rede WSL)
- ❓ `http://localhost:3000` (Windows - depende de port proxy)

---

## 🎯 Recomendação Final

**Método mais confiável:**

1. Copie os arquivos para o Windows:
```bash
mkdir -p /mnt/c/fe-aponta-dev
cp -r dist/* /mnt/c/fe-aponta-dev/
```

2. Abra `C:\fe-aponta-dev\index.html` no navegador

Funciona 100% das vezes sem configuração adicional! 🎉
