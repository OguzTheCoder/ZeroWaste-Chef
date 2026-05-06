import httpx
from typing import List, Dict, Any

async def get_recipes_by_ingredients(ingredients: List[str]) -> List[Dict[str, Any]]:
    if not ingredients:
        return []
        
    main_ingredient = ingredients[0]
    url = f"https://www.themealdb.com/api/json/v1/1/filter.php?i={main_ingredient}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
        meals = data.get("meals") or []
        
        results = []
        for meal in meals[:10]:
            recipe_id = meal["idMeal"]
            detail_url = f"https://www.themealdb.com/api/json/v1/1/lookup.php?i={recipe_id}"
            detail_response = await client.get(detail_url)
            detail_data = detail_response.json()
            if detail_data.get("meals"):
                full_meal = detail_data["meals"][0]
                
                recipe_ingredients = []
                for i in range(1, 21):
                    ing = full_meal.get(f"strIngredient{i}")
                    if ing and ing.strip():
                        recipe_ingredients.append(ing.lower())
                
                missing = [ing for ing in recipe_ingredients if ing not in [i.lower() for i in ingredients]]
                match_score = len(recipe_ingredients) - len(missing)
                
                results.append({
                    "idMeal": recipe_id,
                    "strMeal": meal["strMeal"],
                    "strMealThumb": meal["strMealThumb"],
                    "missing_ingredients": missing,
                    "match_score": match_score
                })
                
        results.sort(key=lambda x: x["match_score"], reverse=True)
        return results

async def get_recipe_details(recipe_id: str) -> Dict[str, Any]:
    url = f"https://www.themealdb.com/api/json/v1/1/lookup.php?i={recipe_id}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
        if data.get("meals"):
            return data["meals"][0]
        return {}
