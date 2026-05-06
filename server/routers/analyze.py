import base64
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from models.schemas import AnalyzeResponse
from services.claude import analyze_image
from routers.auth import oauth2_scheme

router = APIRouter(prefix="/analyze", tags=["analyze"])

@router.post("", response_model=AnalyzeResponse)
async def analyze_fridge(file: UploadFile = File(...), token: str = Depends(oauth2_scheme)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
            
        contents = await file.read()
        base64_image = base64.b64encode(contents).decode("utf-8")
        
        ingredients = await analyze_image(base64_image)
        return AnalyzeResponse(ingredients=ingredients)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
