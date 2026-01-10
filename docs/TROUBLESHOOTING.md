# Guia de Solução de Problemas

## Servidor está rodando mas página não carrega

### Situação
O servidor http-server está rodando no WSL (porta 3000), mas ao acessar http://localhost:3000 no navegador do Windows, a página não carrega.

### Soluções

#### Opção 1: Acessar via IP do WSL (Recomendado)

1. No terminal WSL, descubra o IP da interface WSL:
```bash
hostname -I
```

Você verá algo como: `172.26.70.147` (ou outro IP)

2. No navegador do Windows, acesse usando esse IP:
```
http://172.26.70.147:3000
```

Exemplo: Se o IP for `172.26.70.147`, acesse `http://172.26.70.147:3000`

#### Opção 2: Configurar Port Forwarding no WSL2

Se estiver usando WSL2, pode ser necessário configurar port forwarding:

1. Abra o PowerShell como Administrador no Windows

2. Execute:
```powershell
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=172.26.70.147
```

Substitua `172.26.70.147` pelo IP do seu WSL (obtido com `hostname -I`)

3. Agora acesse `http://localhost:3000` no navegador

#### Opção 3: Usar WSLg/WSL com X Server

Se você tem o WSL configurado com GUI, o `-o` flag do http-server deve abrir automaticamente o navegador.

#### Opção 4: Verificar Firewall

O firewall do Windows pode estar bloqueando. Tente desabilitar temporariamente ou adicionar exceção para a porta 3000.

### Como saber qual IP usar?

Execute no WSL:
```bash
ip addr show eth0 | grep "inet " | awk '{print $2}' | cut -d/ -f1
```

Ou simplesmente:
```bash
hostname -I | awk '{print $1}'
```

### Teste de conectividade

No WSL, teste se o servidor está respondendo localmente:
```bash
curl http://localhost:3000
```

Se funcionar, o problema é de rede entre Windows e WSL.

---

## Erro: "Permission denied" ao executar npm

**Solução**: Dê permissão aos binários:
```bash
chmod +x node_modules/.bin/*
```

---

## Página carrega mas interface não aparece

### Verifique o Console do Navegador

1. Pressione F12 no navegador
2. Vá na aba "Console"
3. Procure por erros em vermelho

### Erros comuns:

#### Erro: "React is not defined"
- O React não carregou do CDN
- Verifique sua conexão com internet
- Os scripts devem carregar de `https://unpkg.com/`

#### Erro: "Cannot read property of undefined"
- Erro no código JavaScript
- Verifique o arquivo `src/components/AtividadesCadastro.tsx`

---

## Como reiniciar o servidor

```bash
# Matar o servidor atual
pkill -f http-server

# Iniciar novamente
npm start
```

---

## Comando completo para debug

```bash
# 1. Verificar se node está correto
which node
node --version

# 2. Recompilar
npm run build:dev

# 3. Verificar arquivos
ls -la dist/

# 4. Iniciar servidor com logs
npx http-server dist -p 3000
```

---

## Ainda não funciona?

Tente executar tudo manualmente:

```bash
# 1. Carregar NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 2. Usar Node correto
nvm use default

# 3. Limpar e recompilar
rm -rf dist
npm run build:dev

# 4. Iniciar servidor
npx http-server dist -p 3000

# 5. Em outro terminal, pegar o IP
hostname -I

# 6. Acessar no navegador: http://[SEU_IP]:3000
```
