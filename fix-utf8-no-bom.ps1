param(
    [switch]$All,
    [switch]$GitPush
)

# Cambiar a la ruta del repositorio si es necesario
Set-Location "C:\CENSUS\QWEN\erp-rd\erp-rd"

# Opcional: procesar todos los archivos UTF-8 si se pasa -All
if ($All) {
    # Aquí iría tu lógica para normalizar UTF-8 sin BOM
    Write-Host "Procesando todos los archivos para UTF-8 sin BOM..."
}

# Git add y commit
& git add .
& git commit -m 'fix utf8 encoding'

# Git push si se pasó -GitPush
if ($GitPush) {
    & git push
}
