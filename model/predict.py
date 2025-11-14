import tensorflow as tf
import numpy as np
import sys
import os

MODEL_PATH = "cicatrici_model_70_30.keras"
IMAGE_SIZE = (224, 224)


CLASS_NAMES = [
    'dehiscence', 
    'fully healed', 
    'infected', 
    'inflammation', 
    'normal_healing'
]

def load_and_prep_image(image_path):
    """
    Incarca o imagine, o redimensioneaza si o pregateste 
    pentru modelul MobileNetV2.
    """
    try:
        img = tf.keras.utils.load_img(
            image_path, 
            target_size=IMAGE_SIZE
        )
        
        img_array = tf.keras.utils.img_to_array(img)
        
       
        img_array = tf.expand_dims(img_array, 0) 

        
        preprocessed_img = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
        
        return preprocessed_img

    except Exception as e:
        print(f"[EROARE] Nu pot citi imaginea {image_path}: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Te rog specifica calea catre imagine.")
        print("Exemplu: python predict.py \"poza_mea_test.jpg\"")
        sys.exit(1)
        
    image_path = sys.argv[1]

    if not os.path.exists(MODEL_PATH):
        print(f"[EROARE] Modelul '{MODEL_PATH}' nu a fost gasit!")
        print("Ruleaza mai intai scriptul de antrenare.")
        sys.exit(1)
        
    if not os.path.exists(image_path):
        print(f"[EROARE] Imaginea '{image_path}' nu a fost gasita!")
        sys.exit(1)

    print(f"[INFO] Incarc modelul din {MODEL_PATH}...")
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
    except Exception as e:
        print(f"[EROARE] Nu pot incarca modelul. Asigura-te ca ai TensorFlow instalat corect. {e}")
        sys.exit(1)
        
    print("[INFO] Model incarcat. Procesez imaginea...")
    
    prepped_image = load_and_prep_image(image_path)
    
    if prepped_image is not None:
        # Daca exista fisierul cu numele claselor scris in timpul antrenarii, incarcam ordinea reala
        if os.path.exists("class_names.txt"):
            try:
                with open("class_names.txt", "r") as f:
                    lines = [l.strip() for l in f.readlines() if l.strip()]
                    loaded = []
                    for line in lines:
                        # fiecare linie are forma "index: class_name"
                        parts = line.split(':', 1)
                        if len(parts) == 2:
                            loaded.append(parts[1].strip())
                    if len(loaded) == len(CLASS_NAMES):
                        CLASS_NAMES = loaded
                        print(f"[INFO] Am incarcat clasele din 'class_names.txt': {CLASS_NAMES}")
            except Exception as e:
                print(f"[WARN] Nu am putut citi 'class_names.txt': {e}")

        prediction = model.predict(prepped_image)
        probs = prediction[0]
        predicted_index = int(np.argmax(probs))
        predicted_class = CLASS_NAMES[predicted_index] if predicted_index < len(CLASS_NAMES) else str(predicted_index)
        confidence = float(np.max(probs)) * 100

        print("\n--- REZULTAT PREDICTIE ---")
        print(f"   Imagine: {image_path}")
        print(f"   Clasa:   **{predicted_class}**")
        print(f"   Incredere: {confidence:.2f}%")
        print("\n[DEBUG] Probabilitati brute (index:prob):")
        for i, p in enumerate(probs):
            name = CLASS_NAMES[i] if i < len(CLASS_NAMES) else str(i)
            print(f"     {i}: {name:15} -> {p:.6f} ({p*100:.2f}%)")
        print("----------------------------")