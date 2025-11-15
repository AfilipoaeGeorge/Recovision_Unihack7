#!/bin/bash


cd "$(dirname "$0")"

echo "Rulez scriptul de augmentare..."
echo ""

if [ ! -d "venv" ]; then
    echo "[EROARE] Virtual environment nu exista!"
    echo ""
    echo "Te rugam sa rulezi mai intai:"
    echo "  bash install_dependencies.sh"
    echo ""
    exit 1
fi

echo "Activez virtual environment..."
source venv/bin/activate


echo "Rulez augmented.py..."
python augmented.py

