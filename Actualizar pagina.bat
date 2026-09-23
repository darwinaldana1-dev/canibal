@echo off
REM Doble clic aqui para publicar la pagina con las fotos que haya en Imagenes\
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo   Actualizando Canibal Xpress...
echo.
call npm run actualizar canibal-xpress
echo.
pause
