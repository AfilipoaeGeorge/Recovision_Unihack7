import os
from PIL import Image
import torchvision.transforms as T
import torch
import random


input_root = "scars_images"        
output_root = "dataset_augmented"      

num_aug_per_image = 6

augmentations = T.Compose([
    T.RandomRotation(degrees=15),
    T.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.1, hue=0.02),
    T.RandomResizedCrop(size=(224, 224), scale=(0.85, 1.0)),
    T.RandomHorizontalFlip(p=0.5),
    T.GaussianBlur(kernel_size=3, sigma=(0.1, 1.0)),
    T.ToTensor(),
])

to_pil = T.ToPILImage()

os.makedirs(output_root, exist_ok=True)

for class_name in os.listdir(input_root):
    class_in = os.path.join(input_root, class_name)
    class_out = os.path.join(output_root, class_name)

    if not os.path.isdir(class_in):
        continue

    os.makedirs(class_out, exist_ok=True)

    images = [f for f in os.listdir(class_in) if f.lower().endswith((".jpg", ".png", ".jpeg"))]

    print(f"[+] Procesez clasa: {class_name} | {len(images)} imagini")

    for img_name in images:
        img_path = os.path.join(class_in, img_name)
        img = Image.open(img_path).convert("RGB")

        for i in range(num_aug_per_image):
            augmented = augmentations(img)          
            augmented_img = to_pil(augmented)       

            save_name = f"{img_name.split('.')[0]}_aug{i}.jpg"
            save_path = os.path.join(class_out, save_name)

            augmented_img.save(save_path)

print("\n Augmentarea s-a terminat cu succes!")
