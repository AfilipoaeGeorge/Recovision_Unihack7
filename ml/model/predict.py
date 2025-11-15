import torch
from torchvision import transforms
from PIL import Image
from models import get_efficientnet_b0


IMG_SIZE = 224
CLASS_NAMES = ["dehiscence", "fully_healed" , "infected","inflammation", "normal_healing"]


transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    ])


def predict(image_path, model_path="model_efficientnet.pth"):
    model = get_efficientnet_b0(len(CLASS_NAMES))
    model.load_state_dict(torch.load(model_path, map_location="cpu"))
    model.eval()


    img = Image.open(image_path).convert("RGB")
    img = transform(img).unsqueeze(0)


    with torch.no_grad():
        output = model(img)
        pred = output.argmax(1).item()
        return CLASS_NAMES[pred]