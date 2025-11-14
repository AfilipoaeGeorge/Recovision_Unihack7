import os
import glob
import cv2
import albumentations as A
from tqdm import tqdm
import random
INPUT_DIR = "scars_images"

OUTPUT_DIR = "dataset_augmented"

AUGS_PER_IMAGE = 5

random.seed(42)
base_transform = A.Compose(
    [
        A.Rotate(limit=20, p=0.5, border_mode=cv2.BORDER_REFLECT_101, value=0),

        A.HorizontalFlip(p=0.5),

        A.RandomBrightnessContrast(
            brightness_limit=0.2,
            contrast_limit=0.15,
            p=0.5
        ),

        A.GaussNoise(var_limit=(10.0, 30.0), p=0.3),

        A.MotionBlur(blur_limit=3, p=0.2),

        A.RandomShadow(p=0.2),
    ]
)

CLASS_TRANSFORMS = {}


def get_transform_for_class(class_name: str):
    """Returneaza transform-ul potrivit pentru clasa.
       Deocamdata toti folosesc acelasi transform."""
    return CLASS_TRANSFORMS.get(class_name, base_transform)

def augment_image(image, transform, n_aug=AUGS_PER_IMAGE):
    """Genereaza n_aug imagini augmentate dintr-o imagine."""
    augmented_images = []
    for _ in range(n_aug):
        augmented = transform(image=image)["image"]
        augmented_images.append(augmented)
    return augmented_images

def main():
    # Verifica daca directorul de input exista
    if not os.path.exists(INPUT_DIR):
        print(f"[EROARE] Directorul {INPUT_DIR} nu exista!")
        return
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    class_names = [
        d for d in os.listdir(INPUT_DIR)
        if os.path.isdir(os.path.join(INPUT_DIR, d))
    ]
    
    if not class_names:
        print(f"[EROARE] Nu s-au gasit clase in {INPUT_DIR}!")
        return

    for class_name in class_names:
        input_class_dir = os.path.join(INPUT_DIR, class_name)
        output_class_dir = os.path.join(OUTPUT_DIR, class_name)
        os.makedirs(output_class_dir, exist_ok=True)

        print(f"\n[INFO] Procesez clasa: {class_name}")

        image_paths = []
        image_paths.extend(glob.glob(os.path.join(input_class_dir, "*.jpg")))
        image_paths.extend(glob.glob(os.path.join(input_class_dir, "*.jpeg")))
        image_paths.extend(glob.glob(os.path.join(input_class_dir, "*.png")))

        transform = get_transform_for_class(class_name)

        if not image_paths:
            print(f"[WARN] Nu s-au gasit imagini in {input_class_dir}")
            continue
            
        for img_path in tqdm(image_paths, desc=f"Procesez {class_name}"):
            img = cv2.imread(img_path)
            if img is None:
                print(f"[WARN] Nu pot citi {img_path}, sar peste.")
                continue

            base_name = os.path.splitext(os.path.basename(img_path))[0]

            original_out_path = os.path.join(
                output_class_dir, f"{base_name}.jpg"
            )
            cv2.imwrite(original_out_path, img)

            aug_images = augment_image(img, transform, AUGS_PER_IMAGE)

            for i, aug_img in enumerate(aug_images):
                out_name = f"{base_name}_aug_{i+1}.jpg"
                out_path = os.path.join(output_class_dir, out_name)
                cv2.imwrite(out_path, aug_img)

    print("\n[INFO] Gata! Imaginile augmentate sunt in:", OUTPUT_DIR)


if __name__ == "__main__":
    main()
