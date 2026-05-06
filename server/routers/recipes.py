from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from models.schemas import RecipeMatch
from services.mealdb import get_recipes_by_ingredients
from routers.auth import oauth2_scheme

router = APIRouter(prefix="/recipes", tags=["recipes"])

@router.get("", response_model=List[RecipeMatch])
async def get_recipes(ingredients: List[str] = Query(...), token: str = Depends(oauth2_scheme)):
    try:
        recipes = await get_recipes_by_ingredients(ingredients)
        return recipes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
