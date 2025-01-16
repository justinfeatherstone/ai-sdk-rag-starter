from fastapi import APIRouter, Depends, HTTPException
from typing import Dict
from ..services.nutrition import NutritionService, NutritionQuery, NutritionResponse
from .auth import oauth2_scheme

router = APIRouter()
nutrition_service = NutritionService()

@router.post("/advice", response_model=NutritionResponse)
async def get_nutrition_advice(
    query: NutritionQuery,
    token: str = Depends(oauth2_scheme)
):
    """
    Get personalized nutrition advice based on the query and context.
    """
    try:
        return await nutrition_service.get_nutrition_advice(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/meal-plan")
async def generate_meal_plan(
    preferences: Dict,
    token: str = Depends(oauth2_scheme)
):
    """
    Generate a personalized meal plan based on preferences and constraints.
    """
    try:
        return await nutrition_service.get_meal_plan(preferences)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 