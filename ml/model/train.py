import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from torch.optim import Adam
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from utils import EarlyStopping
from models import get_efficientnet_b0, get_vit_b16

DATA_ROOT = "dataset_augmented"
BATCH_SIZE = 16
LR = 1e-4
EPOCHS = 20
IMG_SIZE = 224
NUM_CLASSES = 5
MODEL_TYPE = "efficientnet" # or "vit"


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)


train_transforms = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
])


val_transforms = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
])


dataset = datasets.ImageFolder(DATA_ROOT, transform=train_transforms)
train_idx, val_idx = train_test_split(list(range(len(dataset))), test_size=0.2, random_state=42)


train_ds = torch.utils.data.Subset(dataset, train_idx)
val_ds = torch.utils.data.Subset(datasets.ImageFolder(DATA_ROOT, transform=val_transforms), val_idx)


train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False)


class_names = dataset.classes
print("Classes:", class_names)


if MODEL_TYPE == "efficientnet":
    model = get_efficientnet_b0(NUM_CLASSES)
elif MODEL_TYPE == "vit":
    model = get_vit_b16(NUM_CLASSES)


model = model.to(device)
criterion = nn.CrossEntropyLoss()
optimizer = Adam(model.parameters(), lr=LR)
early_stopping = EarlyStopping(patience=5, min_delta=0.001)


train_losses, val_losses = [], []


for epoch in range(EPOCHS):
    model.train()
    total_loss = 0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    train_loss = total_loss / len(train_loader)
    train_losses.append(train_loss)

    model.eval()
    total_loss = 0


    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            total_loss += loss.item()

    val_loss = total_loss / len(val_loader)
    val_losses.append(val_loss)

    print(f"Epoch {epoch+1}/{EPOCHS} | Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f}")


    if early_stopping(val_loss):
        print("Early stopping triggered.")
        break

plt.plot(train_losses, label="Train Loss")
plt.plot(val_losses, label="Val Loss")
plt.legend()
plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.savefig("training_curve.png")


save_name = f"model_{MODEL_TYPE}.pth"
torch.save(model.state_dict(), save_name)
print(f"Saved {save_name}")