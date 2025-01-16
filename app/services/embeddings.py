from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from ..models.nutrition_data import NutritionDocument, NutritionQuery
from ollama import OllamaClient

class EmbeddingService:
    def __init__(self):
        self.client = OllamaClient(
            base_url='http://localhost:11434/v1',
            api_key='ollama'
        )
        self.model = "nomic-embed-text"
        

    async def get_embedding(self, text: str) -> List[float]:
        """Get embeddings for a text using Ollama."""
        try:
            response = self.client.embeddings.create(
                model=self.model,
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            raise Exception(f"Error getting embedding: {str(e)}")

    async def add_document(self, db: AsyncSession, title: str, content: str, source: str) -> NutritionDocument:
        """Add a new document with its embedding to the database."""
        try:
            embedding = await self.get_embedding(content)
            doc = NutritionDocument(
                title=title,
                content=content,
                source=source,
                embedding=embedding
            )
            db.add(doc)
            await db.commit()
            await db.refresh(doc)
            return doc
        except Exception as e:
            await db.rollback()
            raise Exception(f"Error adding document: {str(e)}")

    async def search_similar(
        self, 
        db: AsyncSession, 
        query: str, 
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Search for similar documents using vector similarity."""
        try:
            query_embedding = await self.get_embedding(query)
            
            # Convert the query embedding to a PostgreSQL array
            embedding_str = '{' + ','.join(map(str, query_embedding)) + '}'
            
            # Perform vector similarity search using cosine similarity
            query = text("""
                SELECT 
                    id,
                    title,
                    content,
                    source,
                    1 - (embedding <=> :embedding) as similarity
                FROM nutrition_documents
                ORDER BY embedding <=> :embedding
                LIMIT :limit
            """)
            
            result = await db.execute(
                query,
                {"embedding": embedding_str, "limit": limit}
            )
            
            similar_docs = []
            async for row in result:
                similar_docs.append({
                    "id": row.id,
                    "title": row.title,
                    "content": row.content,
                    "source": row.source,
                    "similarity": float(row.similarity)
                })
            
            return similar_docs
        except Exception as e:
            raise Exception(f"Error searching similar documents: {str(e)}")

    async def store_query(
        self, 
        db: AsyncSession, 
        user_id: int, 
        query: str
    ) -> NutritionQuery:
        """Store a user's query with its embedding."""
        try:
            embedding = await self.get_embedding(query)
            query_obj = NutritionQuery(
                user_id=user_id,
                query=query,
                embedding=embedding
            )
            db.add(query_obj)
            await db.commit()
            await db.refresh(query_obj)
            return query_obj
        except Exception as e:
            await db.rollback()
            raise Exception(f"Error storing query: {str(e)}") 