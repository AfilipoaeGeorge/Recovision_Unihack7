import tensorflow as tf
import numpy as np
import os

MODEL_PATH = "cicatrici_model_70_30.keras"
DATA_DIR = "dataset_augmented"
IMAGE_SIZE = (224, 224)

# Verific ordinea claselor din directoare
print("[INFO] Verific ordinea claselor din directoarele de date...")
class_names_from_dir = sorted([d for d in os.listdir(DATA_DIR) if os.path.isdir(os.path.join(DATA_DIR, d))])
print(f"Ordinea din directoare: {class_names_from_dir}")

# Verific ordinea claselor din dataset
print("\n[INFO] Verific ordinea din TensorFlow dataset...")
dataset = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    image_size=IMAGE_SIZE,
    batch_size=1,
    label_mode='int'
)
print(f"Ordinea din dataset: {dataset.class_names}")

# Verific modelul
print("\n[INFO] Incarc modelul...")
model = tf.keras.models.load_model(MODEL_PATH)

# Verific config-ul modelului
print(f"Input shape: {model.input_shape}")
print(f"Output shape: {model.output_shape}")

# Preiau o imagine de test si verific predictia
test_image_path = "scars_images/dehiscence/Dehiscence2.png"
if os.path.exists(test_image_path):
    print(f"\n[INFO] Testez cu imaginea: {test_image_path}")
    
    img = tf.keras.utils.load_img(test_image_path, target_size=IMAGE_SIZE)
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)
    preprocessed_img = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    
    prediction = model.predict(preprocessed_img, verbose=0)
    print(f"Predictie bruta: {prediction}")
    print(f"Probabilitati: {prediction[0]}")
    
    predicted_index = np.argmax(prediction)
    print(f"\nIndex pricetat: {predicted_index}")
    print(f"Clasa (din dataset.class_names): {dataset.class_names[predicted_index]}")
    print(f"Confidență: {np.max(prediction) * 100:.2f}%")
    
    print(f"\nDistributia predictiilor:")
    for i, prob in enumerate(prediction[0]):
        print(f"  {i}: {dataset.class_names[i]:20} = {prob:.4f} ({prob*100:.2f}%)")
