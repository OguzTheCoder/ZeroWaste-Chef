# Beceri Ajanı: Claude Vision API entegrasyonu — AI yardımıyla oluşturuldu
import os
import httpx
from typing import List

CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY", "")

async def analyze_image(base64_image: str) -> List[str]:
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    
    system_prompt = (
        "Sen bir yemek malzemesi tanıma asistanısın. Gönderilen fotoğraftaki yiyecek ve "
        "malzemeleri tespit et. SADECE yiyecek isimlerini, aralarında virgül olacak şekilde "
        "döndür (Örn: elma, süt, yumurta). Asla başka bir metin, noktalama işareti veya "
        "açıklama ekleme."
    )
    
    payload = {
        "model": "claude-3-sonnet-20240229",
        "max_tokens": 1024,
        "system": system_prompt,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": base64_image
                        }
                    }
                ]
            }
        ]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            text_content = data["content"][0]["text"].strip()
            
            # Gelen yanıtı virgülle ayırıp temiz bir liste oluşturuyoruz
            if text_content:
                ingredients = [item.strip() for item in text_content.split(",") if item.strip()]
                return ingredients
            return []
        except Exception as e:
            print(f"Claude API Error: {e}")
            return []
