from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uuid
import os
import shutil

from model.predict import predict
MODEL_PATH = "model/model_efficientnet.pth"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[""],
    allow_methods=[""],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    temp_file = f"/tmp/{uuid.uuid4()}.jpg"
    with open(temp_file, "wb") as f:
        shutil.copyfileobj(file.file, f)

    result = predict(temp_file, MODEL_PATH)

    os.remove(temp_file)

    return {"prediction": result}