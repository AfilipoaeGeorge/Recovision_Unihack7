# Script de Augmentare Imagini

Acest script creează imagini augmentate din imaginile existente în folderul `scars_images`.

## Instalare Python

Dacă primești eroarea "Python was not found", trebuie să instalezi Python:

1. **Descarcă Python** de pe: https://www.python.org/downloads/
2. **La instalare**, asigură-te că bifezi opțiunea **"Add Python to PATH"**
3. **Repornește terminalul** după instalare

## Utilizare

### Opțiunea 1: În WSL (Windows Subsystem for Linux) - Recomandat

1. **Deschide WSL:**
   ```bash
   wsl
   ```

2. **Navighează la folderul proiectului:**
   ```bash
   cd /mnt/d/Visual\ Studio\ Code/Facultate/Unihack/Recovision_Unihack7/model
   ```
   (sau folosește path-ul corect pentru locația ta)

3. **Instalează dependențele (creează virtual environment):**
   ```bash
   bash install_dependencies.sh
   ```
   SAU manual:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Rulează scriptul:**
   ```bash
   bash run_augmented.sh
   ```
   SAU manual (după activarea virtual environment):
   ```bash
   source venv/bin/activate
   python augmented.py
   ```

### Opțiunea 2: Folosind fișierele batch (Windows)

1. **Instalează dependențele:**
   - Dublu-click pe `install_dependencies.bat`
   - Așteaptă până se instalează toate pachetele

2. **Rulează scriptul:**
   - Dublu-click pe `run_augmented.bat`
   - Scriptul va procesa toate imaginile

### Opțiunea 3: Manual în terminal Windows

```powershell
# Instalează dependențele
pip install -r requirements.txt

# Rulează scriptul
python augmented.py
```

## Structura

- **Input:** `scars_images/` - folderul cu imaginile originale
  - `dehiscence/`
  - `fully healed/`
  - `infected/`
  - `inflammation/`
  - `normal_healing/`

- **Output:** `dataset_augmented/` - folderul cu imaginile augmentate
  - Fiecare clasă va avea:
    - Imaginile originale (copiate)
    - 5 imagini augmentate pentru fiecare imagine (cu sufix `_aug_1`, `_aug_2`, etc.)

## Transformări aplicate

- Rotire (până la 20 grade)
- Flip orizontal
- Ajustări de luminozitate și contrast
- Zgomot Gaussian
- Motion blur
- Umbre aleatoare

## Configurare

Poți modifica numărul de imagini augmentate per imagine în fișierul `augmented.py`:

```python
AUGS_PER_IMAGE = 5  # Schimbă acest număr
```

