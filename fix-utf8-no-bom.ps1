param(
    [string]$Path = ".",
    [switch]$All,
    [switch]$GitPush
)

# Extensiones a convertir
$extensions = @("*.js","*.ts","*.tsx","*.json","*.py","*.sh","Dockerfile","*.yml","*.yaml","*.md")

# Carpetas a excluir
$excludedFolders = @("node_modules",".git",".next","__pycache__")

$searchOption = if ($All) { "-Recurse" } else { "" }

Write-Host "🔍 Buscando archivos en $Path (excluyendo $($excludedFolders -join ', ')) ..."

foreach ($ext in $extensions) {
    $files = Get-ChildItem -Path $Path -Filter $ext $searchOption -File -ErrorAction SilentlyContinue | 
             Where-Object { $excludedFolders -notcontains $_.Directory.Name }

    foreach ($file in $files) {
        try {
            $content = Get-Content -Raw -Path $file.FullName
            [System.IO.File]::WriteAllText($file.FullName, $content, (New-Object System.Text.UTF8Encoding($false)))
            Write-Host "✅ Convertido: $($file.FullName)"
        }
        catch {
            Write-Host "⚠️ Error al procesar: $($file.FullName)"
        }
    }
}

Write-Host "🎯 Conversión terminada."

# Git add / commit / push opcional
if ($GitPush) {
    Write-Host "🚀 Ejecutando git add/commit/push ..."
    git add .
    git commit -m "fix utf8 encoding" | Out-Null
    git push
}
