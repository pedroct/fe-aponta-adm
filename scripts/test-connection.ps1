# Script de diagnóstico para testar conexão Windows -> WSL
# Execute no PowerShell do Windows

Write-Host "=== Teste de Conexão Windows -> WSL ===" -ForegroundColor Cyan
Write-Host ""

# 1. Testar localhost
Write-Host "1. Testando localhost:3000..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "   ✓ localhost:3000 - OK (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ localhost:3000 - FALHOU" -ForegroundColor Red
    Write-Host "     Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 2. Testar IP do WSL
Write-Host "2. Testando 172.26.70.147:3000..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://172.26.70.147:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "   ✓ 172.26.70.147:3000 - OK (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ 172.26.70.147:3000 - FALHOU" -ForegroundColor Red
    Write-Host "     Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 3. Verificar port proxy
Write-Host "3. Verificando configuração de port proxy..." -ForegroundColor Yellow
$proxy = netsh interface portproxy show v4tov4
if ($proxy -match "3000") {
    Write-Host "   ✓ Port proxy configurado para porta 3000" -ForegroundColor Green
    Write-Host $proxy
} else {
    Write-Host "   ⚠ Port proxy não configurado" -ForegroundColor Yellow
}

Write-Host ""

# 4. Testar conectividade de rede
Write-Host "4. Testando conectividade de rede (ping)..." -ForegroundColor Yellow
$ping = Test-Connection -ComputerName 172.26.70.147 -Count 2 -Quiet
if ($ping) {
    Write-Host "   ✓ WSL está acessível via rede" -ForegroundColor Green
} else {
    Write-Host "   ✗ WSL não está acessível via rede" -ForegroundColor Red
}

Write-Host ""

# 5. Verificar firewall
Write-Host "5. Verificando regras de firewall para porta 3000..." -ForegroundColor Yellow
$firewallRules = Get-NetFirewallRule | Where-Object {
    $_.DisplayName -like "*3000*" -or $_.DisplayName -like "*http-server*"
}
if ($firewallRules) {
    Write-Host "   Regras de firewall encontradas:" -ForegroundColor Yellow
    $firewallRules | ForEach-Object { Write-Host "   - $($_.DisplayName)" }
} else {
    Write-Host "   ⚠ Nenhuma regra de firewall encontrada para porta 3000" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Diagnóstico Completo ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Se localhost:3000 funcionar, acesse http://localhost:3000 no navegador"
Write-Host "2. Se 172.26.70.147:3000 funcionar, acesse http://172.26.70.147:3000 no navegador"
Write-Host "3. Se nenhum funcionar, execute como Administrador:"
Write-Host "   New-NetFirewallRule -DisplayName 'WSL HTTP Server' -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow"
