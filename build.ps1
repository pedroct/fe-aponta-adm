# Build script para evitar travamento do terminal
# Roda npm run build de forma simples

Write-Host "Iniciando build..." -ForegroundColor Cyan
Write-Host ""

# Rodar build direto - mais confiável que pipes
& npm run build

Write-Host ""
Write-Host "Build finalizado!" -ForegroundColor Green
