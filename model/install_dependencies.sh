#!/bin/bash

# Script pentru instalarea dependentelor in WSL

cd "$(dirname "$0")"

echo "Instalare dependente pentru augmented.py..."
echo ""

# Verifica daca Python este instalat
if ! command -v python3 &> /dev/null; then
    echo "[EROARE] Python nu a fost gasit!"
    echo ""
    echo "Te rugam sa instalezi Python:"
    echo "  sudo apt update"
    echo "  sudo apt install python3 python3-venv python3-pip"
    echo ""
    exit 1
fi

echo "Am gasit python3"
echo ""

# Creeaza virtual environment daca nu exista
if [ ! -d "venv" ]; then
    echo "Creez virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "[EROARE] Nu pot crea virtual environment!"
        echo "Incearca: sudo apt install python3-venv"
        exit 1
    fi
    echo "Virtual environment creat cu succes!"
    echo ""
fi

# Activeaza virtual environment si instaleaza dependentele
echo "Activez virtual environment si instalez dependentele..."
source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "Dependentele au fost instalate cu succes!"
    echo "Acum poti rula: bash run_augmented.sh"
else
    echo ""
    echo "[EROARE] Instalarea dependintelor a esuat!"
    exit 1
fi

