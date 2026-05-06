import os
import httpx

USDA_API_KEY = os.getenv("USDA_API_KEY", "")

async def get_ingredient_nutrition(ingredient_name: str) -> dict:
    url = f"https://fdc.nal.usda.gov/fdc-v1/foods/search?query={ingredient_name}&api_key={USDA_API_KEY}&pageSize=1"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            if data.get("foods") and len(data["foods"]) > 0:
                food = data["foods"][0]
                nutrients = food.get("foodNutrients", [])
                
                nutrition = {
                    "calories": 0.0,
                    "protein": 0.0,
                    "carbs": 0.0,
                    "fat": 0.0,
                    "fiber": 0.0
                }
                
                for nutrient in nutrients:
                    name = nutrient.get("nutrientName", "").lower()
                    value = nutrient.get("value", 0.0)
                    
                    if "energy" in name and "kcal" in nutrient.get("unitName", "").lower():
                        nutrition["calories"] = value
                    elif "protein" in name:
                        nutrition["protein"] = value
                    elif "carbohydrate" in name:
                        nutrition["carbs"] = value
                    elif "total lipid (fat)" in name or "fat" in name:
                        nutrition["fat"] = value
                    elif "fiber" in name:
                        nutrition["fiber"] = value
                        
                return nutrition
        except Exception:
            pass
            
    return {
        "calories": 0.0,
        "protein": 0.0,
        "carbs": 0.0,
        "fat": 0.0,
        "fiber": 0.0
    }
