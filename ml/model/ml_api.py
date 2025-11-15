from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from predict import predict   # folosim direct funcția ta
import os
from uuid import uuid4

# ne asigurăm că există folderul uploads (pentru a păstra pozele)
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="Recovision ML API",
    description="API pentru clasificarea cicatricilor",
    version="1.0.0"
)

# CORS - ca să poți apela din frontend (React / altceva)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # pentru dev, poți restrânge pentru producție
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Recovision ML API este pornit 🚀"}


@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    # generăm un nume unic pentru fișier
    ext = os.path.splitext(file.filename)[1] or ".png"
    unique_name = f"{uuid4().hex}{ext}"
    save_path = os.path.join(UPLOAD_DIR, unique_name)

    # salvăm imaginea pe disc (ca să o „păstrăm undeva”)
    with open(save_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # apelăm funcția ta de ML
    result = predict(save_path, model_path="model_efficientnet.pth")

    # poți returna și path-ul dacă vrei să știi ulterior unde e imaginea
    return {
        "prediction": result,
        "image_path": save_path
    }
