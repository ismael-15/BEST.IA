from fastapi import FastAPI
from pydantic import BaseModel
from pysentimiento import create_analyzer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = create_analyzer(task="sentiment", lang="es")

class TextRequest(BaseModel):
    text: str

@app.get("/")
def root():
    return {"status": "ok", "service": "pysentimiento"}

@app.post("/analyze")
async def analyze_emotion(payload: TextRequest):
    result = analyzer.predict(payload.text)
    return {
        "emotion": result.output,
        "scores": result.probas
    }