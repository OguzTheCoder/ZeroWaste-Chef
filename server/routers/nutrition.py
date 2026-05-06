from fastapi import APIRouter, Depends, HTTPException
from models.schemas import NutritionResponse
from services.mealdb import get_recipe_details
from services.usda import get_ingredient_nutrition
from routers.auth import oauth2_scheme

router = APIRouter(prefix="/nutrition", tags=["nutrition"])

@router.get("/{recipe_id}", response_model=NutritionResponse)
async def get_nutrition(recipe_id: str, token: str = Depends(oauth2_scheme)):
    try:
        recipe = await get_recipe_details(recipe_id)
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
            
        recipe_ingredients = []
        for i in range(1, 21):
            ing = recipe.get(f"strIngredient{i}")
            if ing and ing.strip():
                recipe_ingredients.append(ing)
                
        total_nutrition = {
            "calories": 0.0,
            "protein": 0.0,
            "carbs": 0.0,
            "fat": 0.0,
            "fiber": 0.0
        }
        
        for ing in recipe_ingredients:
            nut = await get_ingredient_nutrition(ing)
            for key in total_nutrition:
                total_nutrition[key] += nut.get(key, 0.0)
                
        return NutritionResponse(**total_nutrition)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
