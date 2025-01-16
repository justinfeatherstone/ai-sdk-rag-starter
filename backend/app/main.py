from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import nutrition, auth
from app.db.database import init_db

app = FastAPI(
    title="Nutrition AI API",
    description="AI-powered nutrition advice and meal planning API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(nutrition.router, prefix="/api/nutrition", tags=["Nutrition"])

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Service is running"} 