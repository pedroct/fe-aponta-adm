@echo off
echo ========================================
echo  Iniciando Servidor de Desenvolvimento
echo ========================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado:
node --version
echo.

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo [AVISO] node_modules nao encontrado.
    echo Instalando dependencias...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Falha ao instalar dependencias!
        pause
        exit /b 1
    )
    echo.
)

echo [OK] Dependencias OK
echo.
echo Iniciando servidor em http://localhost:3000
echo Aguarde alguns segundos...
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

call npm start
