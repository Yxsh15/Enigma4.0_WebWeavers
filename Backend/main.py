from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from utils.database import connect_to_mongo, close_mongo_connection
from utils.config import settings
from routes.auth import router as auth_router
from routes.donations import router as donations_router
from routes.projects import router as projects_router
from routes.admin import router as admin_router
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    logger.info("Application started")
    yield
    # Shutdown
    await close_mongo_connection()
    logger.info("Application stopped")

# Create FastAPI app
app = FastAPI(
    title="Authentication API",
    description="FastAPI backend with MongoDB for authentication",
    version="1.0.0",
    lifespan=lifespan
)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(donations_router)
app.include_router(projects_router)
app.include_router(admin_router)

@app.get("/")
async def root():
    return {"message": "Authentication API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running properly"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)