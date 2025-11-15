@echo off
cd /d "%~dp0"
echo Rulez scriptul de augmentare...
echo.

REM 
where py >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo Am gasit Python launcher (py)
    py augmented.py
    goto :end
)

where python3 >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo Am gasit python3
    python3 augmented.py
    goto :end
)

where python >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo Am gasit python
    python augmented.py
    goto :end
)

echo.
echo [EROARE] Python nu a fost gasit!
echo.
echo Te rugam sa instalezi Python de pe https://www.python.org/downloads/
echo SAU daca ai Python instalat, asigura-te ca este adaugat la PATH.
echo.
echo Dupa instalare, ruleaza din nou acest script.
echo.

:end
pause

