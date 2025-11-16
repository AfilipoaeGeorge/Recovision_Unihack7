from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import tempfile
import os

from predict import predict  # folosim predict(image_path, model_path)

app = FastAPI(
    title="Recovision ML API",
    description="API pentru clasificarea cicatricilor",
    version="1.0.0",
)

MODEL_PATH = "model_efficientnet.pth"

@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    try:
        suffix = os.path.splitext(file.filename)[1]  # ex: .jpg, .png
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            temp_path = tmp.name
            content = await file.read()
            tmp.write(content)

        label = predict(temp_path, MODEL_PATH)

        os.remove(temp_path)

        return {"label": label}

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )