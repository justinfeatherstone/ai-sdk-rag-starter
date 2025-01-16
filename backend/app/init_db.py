import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import init_db, SessionLocal
from services.embeddings import EmbeddingService
from models.nutrition_data import NutritionDocument

# Sample nutrition documents
SAMPLE_DOCUMENTS = [
    {
        "title": "Healthy Eating in Andover",
        "content": """Local markets in Andover offer a variety of fresh produce at affordable prices. 
        Market Basket on North Main Street provides budget-friendly organic options, while Stop & Shop 
        offers weekly deals on fresh fruits and vegetables. The Andover Farmers Market, open from June 
        to October, is an excellent source for local, seasonal produce.""",
        "source": "Andover Health Department Guide"
    },
    {
        "title": "Budget-Friendly Protein Sources",
        "content": """For protein-rich meals on a budget in Andover, consider these options:
        1. Legumes from Market Basket's bulk section
        2. Eggs from local farms
        3. Chicken when on sale at Shaw's
        4. Canned fish at Stop & Shop
        These options provide excellent nutrition while being cost-effective.""",
        "source": "Community Nutrition Program"
    },
    {
        "title": "Seasonal Eating Guide",
        "content": """Massachusetts seasonal produce guide for Andover residents:
        Spring: Asparagus, spinach, lettuce
        Summer: Tomatoes, corn, zucchini
        Fall: Apples, pumpkins, squash
        Winter: Root vegetables, greenhouse lettuce
        Buy in season at local markets for best prices and nutrition.""",
        "source": "Massachusetts Agricultural Extension"
    }
]

async def init_sample_data():
    try:
        # Initialize database and create tables
        await init_db()
        
        # Create embedding service
        embedding_service = EmbeddingService()
        
        # Get database session
        async with SessionLocal() as db:
            # Add sample documents
            for doc in SAMPLE_DOCUMENTS:
                await embedding_service.add_document(
                    db=db,
                    title=doc["title"],
                    content=doc["content"],
                    source=doc["source"]
                )
            
            print("Sample data initialized successfully!")
    
    except Exception as e:
        print(f"Error initializing sample data: {str(e)}")

if __name__ == "__main__":
    asyncio.run(init_sample_data()) 