#!/bin/bash

# Script pentru rularea augmentarii in WSL

cd "$(dirname "$0")"

echo "Rulez scriptul de augmentare..."
echo ""

# Verifica daca virtual environment exista
if [ ! -d "venv" ]; then
    echo "[EROARE] Virtual environment nu exista!"
    echo ""
    echo "Te rugam sa rulezi mai intai:"
    echo "  bash install_dependencies.sh"
    echo ""
    exit 1
fi

# Activeaza virtual environment
echo "Activez virtual environment..."
source venv/bin/activate

# Ruleaza scriptul
echo "Rulez augmented.py..."
python augmented.py

