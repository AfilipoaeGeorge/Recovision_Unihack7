from predict import predict

# image_path = "C:\\Users\\Andreea\\Desktop\\unihack\\Recovision_Unihack7\\model\\scars_images\\inflammation\\EarlyHealing4.png"
# image_path ="C:\\Users\\Andreea\\Desktop\\unihack\\Recovision_Unihack7\\model\\scars_images\\infected\\Screenshot 2025-11-14 184006.png"
# image_path="C:\\Users\\Andreea\\Desktop\\unihack\\Recovision_Unihack7\\model\\scars_images\\fully healed\\fully_healed7.png"
# image_path="C:\\Users\\Andreea\\Desktop\\unihack\\Recovision_Unihack7\\model\\scars_images\\normal_healing\\Screenshot 2025-11-14 194519.png"
image_path="C:\\Users\\Andreea\\Pictures\\Screenshots\\Screenshot 2025-11-15 165642.png"
model_path = "model_efficientnet.pth"

result = predict(image_path, model_path)

print(f"Predicție pentru {image_path}: {result}")
