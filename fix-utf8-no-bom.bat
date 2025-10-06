@echo off
chcp 65001 > nul
echo 🔹 Convirtiendo archivos a UTF-8 sin BOM...

:: Carpeta raíz
set ROOT_DIR=%~dp0

:: Extensiones críticas
set EXT_LIST=*.ts *.tsx *.js *.css *.json *.py Dockerfile *.yml *.yaml *.md

:: Carpetas a excluir
set EXCLUDE=node_modules .git .next __pycache__

:: Loop para cada extensión
for %%E in (%EXT_LIST%) do (
    for /R "%ROOT_DIR%" %%F in (%%E) do (
        set FILEPATH=%%F
        set SKIP=false
        for %%D in (%EXCLUDE%) do (
            echo %%F | findstr /I "\\%%D\\" >nul && set SKIP=true
        )
        if /I "%SKIP%"=="false" (
            powershell -Command ^
            "$c=[System.IO.File]::ReadAllText('%FILEPATH%'); [System.IO.File]::WriteAllText('%FILEPATH%', $c, (New-Object System.Text.UTF8Encoding($false)))"
            echo ✅ Convertido: %%F
        )
    )
)

echo 🎯 Conversión completada.
echo ⚠️ Ahora debes hacer Git commit/push manualmente:
echo git add .
echo git commit -m "fix utf8 encoding"
echo git push
pause
