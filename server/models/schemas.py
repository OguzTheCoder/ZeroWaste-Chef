from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class AnalyzeRequest(BaseModel):
    image_base64: str

class AnalyzeResponse(BaseModel):
    ingredients: List[str]

class RecipeMatch(BaseModel):
    idMeal: str
    strMeal: str
    strMealThumb: str
    missing_ingredients: List[str]
    match_score: int

class NutritionResponse(BaseModel):
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
