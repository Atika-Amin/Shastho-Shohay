from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from bot import load_conditions, Engine, SymptomBot 


# Reuse the CSV‑driven logic from bot.py (place app.py next to bot.py)
# If your file is named differently, adjust the import below.


CSV_PATH = Path("conditions.csv")  # change if you keep it elsewhere

app = FastAPI(title="Symptom Chatbot API")

# Allow your React dev server (Vite default: http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global, single bot instance (simple demo session). For multi‑user, you’d
# track sessions (e.g., per cookie/user) and hold a SymptomBot per session.
engine = Engine(load_conditions(CSV_PATH))            # ⟵ and this line
bot = SymptomBot(engine)

class ChatIn(BaseModel):
    message: str

class ChatOut(BaseModel):
    reply: str

@app.get("/")
def root():
    return {"ok": True, "message": bot.greet()}

@app.post("/chat", response_model=ChatOut)
def chat(body: ChatIn):
    text = body.message or ""
    # If first turn or after reset, give greeting if user says nothing useful
    reply = bot.handle(text)
    return ChatOut(reply=reply)

# Optional endpoints to control the session
@app.post("/reset")
def reset():
    bot.reset()
    return {"ok": True}

# To run:  uvicorn app:app --reload --host 127.0.0.1 --port 8000
