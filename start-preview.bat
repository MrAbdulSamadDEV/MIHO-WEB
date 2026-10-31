@echo off
title MIHO Landing Page Server
cd /d "%~dp0"
echo ========================================================
echo   MIHO — THE FUTURE HAS A VOICE
echo   Starting local preview server on http://localhost:5173
echo ========================================================
echo.
npm run preview
pause
