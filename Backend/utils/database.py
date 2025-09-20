from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection
from .config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

# --- Define collection variables here, initially as None ---
db_connection = Database()
user_collection: AsyncIOMotorCollection = None
project_collection: AsyncIOMotorCollection = None
donation_collection: AsyncIOMotorCollection = None

async def get_database():
    return db_connection.db

async def connect_to_mongo():
    """Create database connection and initialize collections"""
    global user_collection, project_collection, donation_collection
    try:
        db_connection.client = AsyncIOMotorClient(settings.MONGODB_URL)
        db_connection.db = db_connection.client[settings.DATABASE_NAME]
        
        # --- Initialize the collection variables after connecting ---
        user_collection = db_connection.db.get_collection("users")
        project_collection = db_connection.db.get_collection("projects")
        donation_collection = db_connection.db.get_collection("donations")

        await create_indexes()
        
        logger.info("Connected to MongoDB and collections initialized")
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    if db_connection.client:
        db_connection.client.close()
        logger.info("Disconnected from MongoDB")

async def create_indexes():
    """Create database indexes"""
    if user_collection is not None:
        await user_collection.create_index("email", unique=True)
        await user_collection.create_index("google_id", sparse=True)