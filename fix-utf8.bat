@echo off
powershell -ExecutionPolicy Bypass -File "%~dp0fix-utf8-no-bom.ps1" -All
pause
