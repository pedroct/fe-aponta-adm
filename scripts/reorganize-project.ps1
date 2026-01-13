# Script de Reorganizacao do Projeto fe-aponta-adm
# Este script organiza a estrutura de pastas de forma profissional

param(
    [switch]$Confirm = $false
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

Write-Host "`n===== REORGANIZACAO DO PROJETO FE-APONTA-ADM =====" -ForegroundColor Cyan
Write-Host "Reorganizando estrutura para padrao profissional..." -ForegroundColor Cyan

# Array de operacoes a executar
$fileMovements = @(
    @{ From = "webpack.config.js"; To = "config/webpack.config.js"; Type = "file" },
    @{ From = "webpack.dev.config.js"; To = "config/webpack.dev.config.js"; Type = "file" },
    @{ From = ".env.example"; To = "config/.env.example"; Type = "file" },
    @{ From = "start.bat"; To = "scripts/start.bat"; Type = "file" },
    @{ From = "test-connection.ps1"; To = "scripts/test-connection.ps1"; Type = "file" },
    # Documentação: guides
    @{ From = "docs/INICIAR-WINDOWS.md"; To = "docs/guides/INICIAR-WINDOWS.md"; Type = "file" },
    @{ From = "docs/DESENVOLVIMENTO.md"; To = "docs/guides/DESENVOLVIMENTO.md"; Type = "file" },
    @{ From = "docs/CONTRIBUTING.md"; To = "docs/guides/CONTRIBUTING.md"; Type = "file" },
    @{ From = "QUICK_REFERENCE.md"; To = "docs/guides/QUICK_REFERENCE.md"; Type = "file" },
    # Documentação: architecture
    @{ From = "CONTEXT.md"; To = "docs/architecture/CONTEXT.md"; Type = "file" },
    @{ From = "SCAFFOLD_PLAN.md"; To = "docs/architecture/SCAFFOLD_PLAN.md"; Type = "file" },
    @{ From = "IMPLEMENTATION_SUMMARY.md"; To = "docs/architecture/IMPLEMENTATION_SUMMARY.md"; Type = "file" },
    @{ From = "CODE_SNIPPETS.md"; To = "docs/architecture/CODE_SNIPPETS.md"; Type = "file" },
    # Documentação: api
    @{ From = "docs/API.md"; To = "docs/api/API.md"; Type = "file" },
    @{ From = "docs/ACESSO-RAPIDO.md"; To = "docs/api/ACESSO-RAPIDO.md"; Type = "file" },
    # Documentação: testing
    @{ From = "docs/TESTING.md"; To = "docs/testing/TESTING.md"; Type = "file" },
    @{ From = "TESTE_HUBS.md"; To = "docs/testing/TESTE_HUBS.md"; Type = "file" },
    @{ From = "PRONTO_PARA_TESTES.md"; To = "docs/testing/PRONTO_PARA_TESTES.md"; Type = "file" },
    @{ From = "TECHNICAL_VALIDATION.md"; To = "docs/testing/TECHNICAL_VALIDATION.md"; Type = "file" },
    # Documentação: troubleshooting
    @{ From = "docs/TROUBLESHOOTING.md"; To = "docs/troubleshooting/TROUBLESHOOTING.md"; Type = "file" },
    @{ From = "BUILD_STATUS.md"; To = "docs/troubleshooting/BUILD_STATUS.md"; Type = "file" }
)

# Arquivos a deletar (redundantes)
$filesToDelete = @(
    "DOCUMENTATION_INDEX.md",
    "DOCUMENTATION_STRUCTURE.md",
    "DELIVERY_SUMMARY.md",
    "COMPLETION_SUMMARY.md",
    ".mcp.json"
)

# Exibir plano
Write-Host "`n📋 OPERAÇÕES A EXECUTAR:`n" -ForegroundColor Yellow

Write-Host "1️⃣  Mover Arquivos de Configuração:" -ForegroundColor Green
foreach ($move in $fileMovements | Where-Object { $_.To -like "config/*" }) {
    Write-Host "   ├─ $($move.From) → $($move.To)" -ForegroundColor Gray
}

Write-Host "`n2️⃣  Mover Scripts:" -ForegroundColor Green
foreach ($move in $fileMovements | Where-Object { $_.To -like "scripts/*" }) {
    Write-Host "   ├─ $($move.From) → $($move.To)" -ForegroundColor Gray
}

Write-Host "`n3️⃣  Mover Documentação:" -ForegroundColor Green
foreach ($move in $fileMovements | Where-Object { $_.To -like "docs/*" }) {
    Write-Host "   ├─ $($move.From) → $($move.To)" -ForegroundColor Gray
}

Write-Host "`n4️⃣  Remover Arquivos Redundantes:" -ForegroundColor Red
foreach ($file in $filesToDelete) {
    Write-Host "   ├─ $file" -ForegroundColor Gray
}

# Confirmação
if (-not $Confirm) {
    Write-Host "`n⚠️  ATENÇÃO: Esta operação é IRREVERSÍVEL!" -ForegroundColor Yellow
    Write-Host "   Backup será criado em: backups/$timestamp/" -ForegroundColor Yellow
    $response = Read-Host "`n❓ Deseja continuar? (s/n)"
    if ($response -ne "s") {
        Write-Host "`n❌ Operação cancelada pelo usuário" -ForegroundColor Red
        exit 1
    }
}

# Criar backup
Write-Host "`n💾 Criando backup..." -ForegroundColor Cyan
$backupDir = "$projectRoot/backups/$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Backup de arquivos que serão movidos
foreach ($move in $fileMovements) {
    $sourcePath = Join-Path $projectRoot $move.From
    if (Test-Path $sourcePath) {
        $relPath = $move.From -replace '/', '\'
        $backupPath = Join-Path $backupDir $relPath
        New-Item -ItemType Directory -Path (Split-Path $backupPath) -Force | Out-Null
        Copy-Item -Path $sourcePath -Destination $backupPath -Force | Out-Null
    }
}

Write-Host "✅ Backup criado em: $backupDir" -ForegroundColor Green

# EXECUTAR MUDANÇAS
Write-Host "`n🔄 Executando reorganização...`n" -ForegroundColor Cyan

$movedCount = 0
$failedCount = 0

# Mover arquivos
foreach ($move in $fileMovements) {
    $sourcePath = Join-Path $projectRoot $move.From
    $destPath = Join-Path $projectRoot $move.To
    $destDir = Split-Path $destPath

    if (Test-Path $sourcePath) {
        try {
            # Criar diretório destino se não existir
            if (-not (Test-Path $destDir)) {
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            }
            
            # Mover arquivo
            Move-Item -Path $sourcePath -Destination $destPath -Force
            Write-Host "✅ Movido: $($move.From) → $($move.To)" -ForegroundColor Green
            $movedCount++
        }
        catch {
            Write-Host "❌ ERRO ao mover $($move.From): $_" -ForegroundColor Red
            $failedCount++
        }
    }
}

# Deletar arquivos redundantes
$deletedCount = 0
foreach ($file in $filesToDelete) {
    $filePath = Join-Path $projectRoot $file
    if (Test-Path $filePath) {
        try {
            Remove-Item -Path $filePath -Force
            Write-Host "🗑️  Removido: $file" -ForegroundColor Magenta
            $deletedCount++
        }
        catch {
            Write-Host "❌ ERRO ao remover $file`: $_" -ForegroundColor Red
        }
    }
}

# Resultado Final
Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ✅ REORGANIZAÇÃO CONCLUÍDA                                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n📊 RESULTADO:" -ForegroundColor Yellow
Write-Host "   ✅ Arquivos movidos: $movedCount" -ForegroundColor Green
Write-Host "   🗑️  Arquivos removidos: $deletedCount" -ForegroundColor Green
Write-Host "   ❌ Erros: $failedCount" -ForegroundColor $(if ($failedCount -eq 0) { "Green" } else { "Red" })

Write-Host "`n📁 NOVA ESTRUTURA:" -ForegroundColor Yellow
Write-Host "   ├── config/             (webpack, .env)" -ForegroundColor Gray
Write-Host "   ├── scripts/            (start.bat, test-connection.ps1)" -ForegroundColor Gray
Write-Host "   ├── docs/" -ForegroundColor Gray
Write-Host "   │   ├── guides/         (INICIAR, DESENVOLVIMENTO, CONTRIBUTING)" -ForegroundColor Gray
Write-Host "   │   ├── architecture/   (CONTEXT, SCAFFOLD, IMPLEMENTATION, SNIPPETS)" -ForegroundColor Gray
Write-Host "   │   ├── api/            (API, ACESSO-RAPIDO)" -ForegroundColor Gray
Write-Host "   │   ├── testing/        (TESTING, TESTE_HUBS, PRONTO, TECHNICAL)" -ForegroundColor Gray
Write-Host "   │   └── troubleshooting/(TROUBLESHOOTING, BUILD_STATUS)" -ForegroundColor Gray
Write-Host "   └── src/                (componentes, serviços, contexto)" -ForegroundColor Gray

Write-Host "`n💡 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "   1. Atualizar imports em package.json se necessário" -ForegroundColor Gray
Write-Host "   2. Verificar webpack configs" -ForegroundColor Gray
Write-Host "   3. Atualizar scripts de CI/CD se existirem" -ForegroundColor Gray
Write-Host "   4. Rodar 'npm run build' para validar" -ForegroundColor Gray
Write-Host "   5. Rodar 'npm run test' para validar testes" -ForegroundColor Gray

Write-Host "`n💾 Backup disponível em: $backupDir" -ForegroundColor Cyan
Write-Host "`n"
