from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routers import auth, analyze, recipes, nutrition

app = FastAPI(title="ZeroWaste-Chef API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(analyze.router)
app.include_router(recipes.router)
app.include_router(nutrition.router)

@app.get("/")
async def root():
    return {"message": "Welcome to ZeroWaste-Chef API"}
