@echo off
cd /d "%~dp0"
echo Instalare dependente pentru augmented.py...
echo.

REM Incearca sa gaseasca Python si pip
where py >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo Am gasit Python launcher (py)
    py -m pip install -r requirements.txt
    if %ERRORLEVEL% == 0 (
        echo.
        echo Dependentele au fost instalate cu succes!
        echo Acum poti rula: run_augmented.bat
    ) else (
        echo.
        echo [EROARE] Instalarea dependintelor a esuat!
    )
    goto :end
)

where python3 >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo Am gasit python3
    python3 -m pip install -r requirements.txt
    if %ERRORLEVEL% == 0 (
        echo.
        echo Dependentele au fost instalate cu succes!
        echo Acum poti rula: run_augmented.bat
    ) else (
        echo.
        echo [EROARE] Instalarea dependintelor a esuat!
    )
    goto :end
)

where python >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo Am gasit python
    python -m pip install -r requirements.txt
    if %ERRORLEVEL% == 0 (
        echo.
        echo Dependentele au fost instalate cu succes!
        echo Acum poti rula: run_augmented.bat
    ) else (
        echo.
        echo [EROARE] Instalarea dependintelor a esuat!
    )
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

