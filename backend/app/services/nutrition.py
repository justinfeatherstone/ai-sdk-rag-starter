import httpx
from typing import List, Dict
import json
import os
from pydantic import BaseModel

class NutritionQuery(BaseModel):
    query: str
    context: str = ""

class NutritionResponse(BaseModel):
    response: str
    sources: List[Dict] = []

class NutritionService:
    def __init__(self):
        self.ollama_url = "http://localhost:11434"
        self.model = "mistral"  # You can change this to any model you have in Ollama
        
    async def get_nutrition_advice(self, query: NutritionQuery) -> NutritionResponse:
        """
        Get nutrition advice using Ollama's RAG capabilities.
        """
        # Construct the prompt with context
        system_prompt = """You are a knowledgeable nutritionist AI assistant helping underserved communities 
        in Andover, Massachusetts. Your goal is to provide practical, actionable nutrition advice that takes 
        into account budget constraints and local food availability. Always provide evidence-based recommendations 
        and consider cultural preferences."""
        
        full_prompt = f"{system_prompt}\n\nContext: {query.context}\n\nQuestion: {query.query}"
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": full_prompt,
                        "stream": False
                    }
                )
                response.raise_for_status()
                result = response.json()
                
                return NutritionResponse(
                    response=result["response"],
                    sources=[]  # In a real implementation, you would include relevant sources
                )
                
        except Exception as e:
            raise Exception(f"Error getting nutrition advice: {str(e)}")
    
    async def get_meal_plan(self, preferences: Dict) -> Dict:
        """
        Generate a personalized meal plan based on user preferences and constraints.
        """
        system_prompt = """Create a weekly meal plan that is nutritious, affordable, and easy to prepare. 
        Consider local food availability in Andover, Massachusetts, and focus on budget-friendly options 
        while maintaining high nutritional value."""
        
        prompt = f"{system_prompt}\n\nPreferences: {json.dumps(preferences)}"
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False
                    }
                )
                response.raise_for_status()
                result = response.json()
                
                # Parse the response into a structured meal plan
                # In a real implementation, you would parse this into a proper structure
                return {
                    "meal_plan": result["response"],
                    "metadata": {
                        "generated_at": "timestamp",
                        "model_used": self.model
                    }
                }
                
        except Exception as e:
            raise Exception(f"Error generating meal plan: {str(e)}") 