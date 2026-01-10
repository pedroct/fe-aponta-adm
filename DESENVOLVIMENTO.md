# Guia de Desenvolvimento - Ambiente WSL

## Problema Identificado

O Node.js está instalado no Windows mas não no WSL (Windows Subsystem for Linux). Isso causa conflitos de caminho ao executar comandos npm.

## Solução 1: Executar no Terminal do Windows (Recomendado)

### Passos:

1. Abra o **PowerShell** ou **CMD** no Windows (não use o terminal WSL)

2. Navegue até a pasta do projeto:
```cmd
cd \\wsl.localhost\Ubuntu-24.04\home\pedroctdev\apps\fe-aponta-adm
```

Ou se estiver acessando via caminho mapeado:
```cmd
cd \\wsl$\Ubuntu-24.04\home\pedroctdev\apps\fe-aponta-adm
```

3. Instale as dependências (se ainda não instalou):
```cmd
npm install
```

4. Execute o servidor de desenvolvimento:
```cmd
npm start
```

Isso abrirá automaticamente o navegador em `http://localhost:3000` com a interface funcionando!

---

## Solução 2: Instalar Node.js no WSL

Se preferir rodar tudo no WSL, instale o Node.js:

### Usando NVM (recomendado):

```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recarregar o shell
source ~/.bashrc

# Instalar Node.js LTS
nvm install --lts

# Verificar instalação
node --version
npm --version
```

### Ou usando apt:

```bash
# Atualizar repositórios
sudo apt update

# Instalar Node.js e npm
sudo apt install nodejs npm -y

# Verificar instalação
node --version
npm --version
```

Depois de instalar o Node.js no WSL, execute:

```bash
cd /home/pedroctdev/apps/fe-aponta-adm
npm install
npm start
```

---

## Comandos Disponíveis

- `npm start` - Compila e abre no navegador (porta 3000)
- `npm run build:dev` - Apenas compila em modo desenvolvimento
- `npm run build` - Build de produção para extensão
- `npm run dev` - Build com watch (para extensão)
- `npm run package` - Empacota a extensão (.vsix)

---

## Testando a Interface

Após executar `npm start`, acesse:
- **URL**: http://localhost:3000
- A interface será exibida com todos os componentes funcionando
- Você pode testar:
  - Adicionar atividades
  - Selecionar projetos
  - Editar atividades
  - Remover atividades
  - Ver a tabela de atividades cadastradas

---

## Arquivos Importantes

- [src/components/AtividadesCadastro.tsx](src/components/AtividadesCadastro.tsx) - Componente principal
- [src/index-dev.tsx](src/index-dev.tsx) - Entrada para desenvolvimento local
- [public/dev.html](public/dev.html) - HTML para desenvolvimento
- [webpack.config.js](webpack.config.js) - Configuração do webpack

---

## Dúvidas?

Se tiver problemas, verifique:
1. Node.js está instalado? (`node --version`)
2. As dependências foram instaladas? (pasta `node_modules` existe?)
3. A porta 3000 está disponível?
