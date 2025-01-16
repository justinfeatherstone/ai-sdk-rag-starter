from fastapi import APIRouter, Depends, HTTPException
from typing import Dict
from app.services.nutrition import NutritionService, NutritionQuery, NutritionResponse
from app.routers.auth import get_current_user
from app.models.user import User

router = APIRouter()
nutrition_service = NutritionService()

@router.post("/advice", response_model=NutritionResponse)
async def get_nutrition_advice(
    query: NutritionQuery,
    current_user: User = Depends(get_current_user)
) -> NutritionResponse:
    """
    Get personalized nutrition advice based on the query and user context.
    """
    try:
        return await nutrition_service.get_nutrition_advice(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/meal-plan")
async def generate_meal_plan(
    preferences: Dict,
    current_user: User = Depends(get_current_user)
) -> Dict:
    """
    Generate a personalized meal plan based on user preferences and dietary requirements.
    """
    try:
        # Add user's dietary preferences from their profile if available
        if hasattr(current_user, "dietary_preferences"):
            preferences.update({"user_preferences": current_user.dietary_preferences})
            
        return await nutrition_service.get_meal_plan(preferences)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 