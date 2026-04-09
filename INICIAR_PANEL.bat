@echo off
title Lanzador de Panel Administrativo SLADE
setlocal

:: Asegurar que el script se ejecute en su propia carpeta
cd /d "%~dp0"

echo ======================================================
echo    LANZADOR AUTOMATICO - PANEL ADMINISTRATIVO
echo ======================================================
echo.

:: 1. Verificar si Node.js existe
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js NO esta instalado. 
    echo [!] Intentando instalar Node.js automaticamente con winget...
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] No se pudo instalar Node.js automaticamente.
        echo Por favor, ve a https://nodejs.org/ y descarga la version "LTS".
        echo Despues de instalarlo, vuelve a ejecutar este archivo.
        pause
        exit /b
    )
    echo.
    echo [+] Node.js se ha instalado. 
    echo [!] POR FAVOR, CIERRA ESTA VENTANA Y VUELVE A ABRIRLA para aplicar los cambios.
    pause
    exit /b
)

echo [+] Node.js detectado.

:: 2. Instalar dependencias si no existen
if not exist "node_modules\" (
    echo [+] Descargando librerias necesarias... esto puede tardar...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Hubo un problema instalando las librerias.
        echo Revisa tu conexion a internet.
        pause
        exit /b
    )
)

:: 3. Configurar archivo .env si no existe
if not exist ".env.local" (
    if exist ".env.example" (
        echo [+] Creando archivo de configuracion inicial...
        copy .env.example .env.local
        echo [!] Se ha creado .env.local. Asegurate de que tenga tus claves.
    )
)

:: 4. Iniciar aplicacion
echo.
echo ======================================================
echo    TODO LISTO. Presiona una tecla para abrir el panel.
echo ======================================================
echo.
pause

start http://localhost:3000
npm run dev

echo.
echo [!] El servidor se ha detenido.
pause
