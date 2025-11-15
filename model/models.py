import torch.nn as nn
from torchvision import models


def get_efficientnet_b0(num_classes):
    model = models.efficientnet_b0(weights="IMAGENET1K_V1")
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    return model


def get_vit_b16(num_classes):
    model = models.vit_b_16(weights="IMAGENET1K_V1")
    model.heads.head = nn.Linear(model.heads.head.in_features, num_classes)
    return model