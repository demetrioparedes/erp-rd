param(
    [string]$Path = ".",
    [switch]$All,
    [switch]$GitPush
)

# Extensiones a convertir
$extensions = @("*.js","*.ts","*.tsx","*.json","*.css","*.py","*.sh","Dockerfile","*.yml","*.yaml","*.md")

# Carpetas a excluir
$excludedFolders = @("node_modules",".git",".next","__pycache__")

$searchOption = if ($All) { [System.IO.SearchOption]::AllDirectories } else { [System.IO.SearchOption]::TopDirectoryOnly }

Write-Host "🔍 Buscando archivos en $Path (excluyendo $($excludedFolders -join ', ')) ..."

foreach ($ext in $extensions) {
    $files = Get-ChildItem -Path $Path -Filter $ext -File -Recurse |
             Where-Object { $excludedFolders -notcontains $_.Directory.Name }

    foreach ($file in $files) {
        try {
            $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
            if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
                Write-Host "⚠️ Tiene BOM: $($file.FullName)"
            }
            $content = Get-Content -Raw -Path $file.FullName
            [System.IO.File]::WriteAllText($file.FullName, $content, (New-Object System.Text.UTF8Encoding($false)))
            Write-Host "✅ Convertido: $($file.FullName)"
        }
        catch {
            Write-Host "❌ Error al procesar: $($file.FullName) - $_"
        }
    }
}

Write-Host "🎯 Conversión terminada."

if ($GitPush) {
    Write-Host "🚀 Ejecutando git add/commit/push ..."
    git add .
    git commit -m "fix utf8 encoding" | Out-Null
    git push
}
