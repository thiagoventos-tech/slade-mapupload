@echo off
title Lanzador de Panel Administrativo SLADE
setlocal enabledelayedexpansion

echo ======================================================
echo    LANZADOR AUTOMATICO - PANEL ADMINISTRATIVO
echo ======================================================
echo.

:: 1. Verificar Node.js
node -v >node_version.txt 2>&1
if %errorlevel% neq 0 (
    echo [!] Node.js no detectado. Intentando instalar...
    echo     Esto puede tardar un minuto y requerir permisos.
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    if %errorlevel% neq 0 (
        echo [ERROR] No se pudo instalar Node.js automaticamente.
        echo Por favor instala Node.js manualmente desde https://nodejs.org/
        pause
        exit /b
    )
    echo [+] Node.js instalado correctamente.
    :: Recargar path para reconocer node recien instalado
    set "PATH=%PATH%;%ProgramFiles%\nodejs"
) else (
    echo [+] Node.js detectado.
)

:: 2. Verificar dependencias
if not exist "node_modules" (
    echo [+] Instalando dependencias necesarias (solo la primera vez)...
    call npm install --quiet
)

:: 3. Verificar variables de entorno
if not exist ".env.local" (
    if exist ".env.example" (
        echo [+] Configurando variables iniciales...
        copy .env.example .env.local
        echo [!] RECUERDA: Edita .env.local con las credenciales correctas.
    )
)

:: 4. Iniciar la aplicacion
echo.
echo ======================================================
echo    EL PANEL SE ESTA INICIANDO... 
echo    Se abrira en tu navegador en breve.
echo    NO CIERRES ESTA VENTANA MIENTRAS LO USES.
echo ======================================================
echo.

:: Abrir el navegador despues de unos segundos
start "" "http://localhost:3000"

:: Correr la app
call npm run dev

pause
