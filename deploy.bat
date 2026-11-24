@echo off
cd /d "%~dp0"
echo === 1/4 TypeScript provera ===
call npx.cmd tsc --noEmit
if errorlevel 1 (
  echo.
  echo GRESKA u tsc. Zaustavljeno, nista nije commitovano ni poslato.
  pause
  exit /b 1
)
echo === 2/4 git add ===
git add .
if errorlevel 1 goto fail
echo === 3/4 git commit ===
set /p MSG=<deploy-message.txt
git commit -m "%MSG%"
if errorlevel 1 goto fail
echo === 4/4 git push ===
git push origin master
if errorlevel 1 goto fail
echo.
echo GOTOVO. Push uspesan.
pause
exit /b 0
:fail
echo.
echo GRESKA. Zaustavljeno, vidi poruku iznad.
pause
exit /b 1
