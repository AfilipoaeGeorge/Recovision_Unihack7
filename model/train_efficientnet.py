import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from torch.optim import Adam
from sklearn.model_selection import train_test_split

# -----------------------------------------------
# CONFIG
# -----------------------------------------------
DATA_ROOT = "dataset_augmented"
BATCH_SIZE = 16
LR = 1e-4
EPOCHS = 20
IMG_SIZE = 224
NUM_CLASSES = 5

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

# -----------------------------------------------
# TRANSFORMS (augmentări doar în training)
# -----------------------------------------------
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

# -----------------------------------------------
# LOAD DATASET
# -----------------------------------------------
dataset = datasets.ImageFolder(DATA_ROOT, transform=train_transforms)

# Train/Val split
train_idx, val_idx = train_test_split(
    list(range(len(dataset))),
    test_size=0.2,
    random_state=42,
    shuffle=True
)

train_ds = torch.utils.data.Subset(dataset, train_idx)
val_ds   = torch.utils.data.Subset(
    datasets.ImageFolder(DATA_ROOT, transform=val_transforms),
    val_idx
)

train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
val_loader   = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False)

class_names = dataset.classes
print("Classes:", class_names)

# -----------------------------------------------
# MODEL — EfficientNet-B0 (pretrained ImageNet)
# -----------------------------------------------
model = models.efficientnet_b0(weights="IMAGENET1K_V1")
model.classifier[1] = nn.Linear(model.classifier[1].in_features, NUM_CLASSES)
model = model.to(device)

# -----------------------------------------------
# LOSS + OPTIMIZER
# -----------------------------------------------
criterion = nn.CrossEntropyLoss()
optimizer = Adam(model.parameters(), lr=LR)

# -----------------------------------------------
# TRAINING LOOP
# -----------------------------------------------
def train_one_epoch():
    model.train()
    total_loss = 0
    correct = 0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)

        loss.backward()
        optimizer.step()

        total_loss += loss.item()
        correct += (outputs.argmax(1) == labels).sum().item()

    acc = correct / len(train_ds)
    return total_loss / len(train_loader), acc


def validate():
    model.eval()
    total_loss = 0
    correct = 0

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)

            total_loss += loss.item()
            correct += (outputs.argmax(1) == labels).sum().item()

    acc = correct / len(val_ds)
    return total_loss / len(val_loader), acc


# -----------------------------------------------
# TRAIN
# -----------------------------------------------
for epoch in range(EPOCHS):
    train_loss, train_acc = train_one_epoch()
    val_loss, val_acc = validate()

    print(
        f"Epoch {epoch+1}/{EPOCHS} | "
        f"Train Loss: {train_loss:.4f} Acc: {train_acc:.4f} | "
        f"Val Loss: {val_loss:.4f} Acc: {val_acc:.4f}"
    )

# -----------------------------------------------
# SAVE MODEL
# -----------------------------------------------
torch.save(model.state_dict(), "wound_classifier_effnet_b0.pth")
print("Model saved as wound_classifier_effnet_b0.pth")
