import httpx
from typing import List, Dict, Optional
import json
import os
from datetime import datetime
from pydantic import BaseModel

class NutritionQuery(BaseModel):
    query: str
    context: str = ""

class NutritionResponse(BaseModel):
    response: str
    sources: List[Dict] = []

class NutritionService:
    def __init__(self):
        self.ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.llm_model = "mixtral"  # Using Mixtral as our main LLM
        self.embedding_model = "nomic-embed-text"  # Using nomic-embed-text for embeddings
        
    async def _generate_response(self, prompt: str, system_message: str, temperature: float = 0.7) -> Dict:
        """
        Helper method to generate responses using Mixtral.
        """
        try:
            async with httpx.AsyncClient() as client:
                # First, create the chat completion
                response = await client.post(
                    f"{self.ollama_url}/api/chat",
                    json={
                        "model": self.llm_model,
                        "messages": [
                            {"role": "system", "content": system_message},
                            {"role": "user", "content": prompt}
                        ],
                        "options": {
                            "temperature": temperature,
                            "num_ctx": 4096,
                            "top_p": 0.9
                        },
                        "stream": False
                    },
                    timeout=30.0  # Increased timeout for longer responses
                )
                response.raise_for_status()
                result = response.json()
                return {"response": result["message"]["content"]}
        except Exception as e:
            print(f"Error generating response: {str(e)}")  # Add debug logging
            raise Exception(f"Error generating response: {str(e)}")
        
    async def get_nutrition_advice(self, query: NutritionQuery) -> NutritionResponse:
        """
        Get nutrition advice using Ollama's RAG capabilities with Mixtral.
        """
        system_message = """You are a knowledgeable nutritionist AI assistant helping underserved communities 
        in Andover, Massachusetts. Your goal is to provide practical, actionable nutrition advice that takes 
        into account budget constraints and local food availability. Always provide evidence-based recommendations 
        and consider cultural preferences."""
        
        result = await self._generate_response(
            prompt=f"Context: {query.context}\n\nQuestion: {query.query}",
            system_message=system_message,
            temperature=0.7
        )
        
        return NutritionResponse(
            response=result["response"],
            sources=[]  # In a real implementation, you would include relevant sources
        )
    
    async def get_meal_plan(self, preferences: Dict) -> Dict:
        """
        Generate a personalized meal plan based on user preferences and constraints using Mixtral.
        """
        system_message = """Create a weekly meal plan that is nutritious, affordable, and easy to prepare. 
        Consider local food availability in Andover, Massachusetts, and focus on budget-friendly options 
        while maintaining high nutritional value. Structure the response as a JSON object with days of the week 
        and meals for each day."""
        
        result = await self._generate_response(
            prompt=f"Generate a meal plan based on these preferences: {json.dumps(preferences)}",
            system_message=system_message,
            temperature=0.8  # Slightly higher temperature for more creative meal plans
        )
        
        try:
            # Attempt to parse the response as JSON for structured meal plans
            meal_plan = json.loads(result["response"])
        except json.JSONDecodeError:
            # Fallback to raw text if JSON parsing fails
            meal_plan = result["response"]
        
        return {
            "meal_plan": meal_plan,
            "metadata": {
                "generated_at": datetime.utcnow().isoformat(),
                "model_used": self.llm_model,
                "model_version": "latest"
            }
        } 