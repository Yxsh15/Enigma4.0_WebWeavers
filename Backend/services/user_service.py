from typing import Optional
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from models.user import User, UserResponse
from utils.database import get_database
from utils.auth import get_password_hash
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class UserService:
    @staticmethod
    async def create_user(user_data: dict) -> Optional[UserResponse]:
        """Create a new user"""
        try:
            db = await get_database()
            
            # Hash password if provided
            if user_data.get("password"):
                user_data["password_hash"] = get_password_hash(user_data.pop("password"))
            
            user_data["created_at"] = datetime.utcnow()
            user_data["updated_at"] = datetime.utcnow()
            user_data["is_active"] = True
            user_data["role"] = "user"
            
            result = await db.users.insert_one(user_data)
            
            if result.inserted_id:
                user = await db.users.find_one({"_id": result.inserted_id})
                user["id"] = str(user["_id"])
                del user["_id"]
                if "password_hash" in user:
                    del user["password_hash"]
                return UserResponse(**user)
            
            return None
            
        except DuplicateKeyError:
            logger.warning(f"User with email {user_data.get('email')} already exists")
            return None
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return None
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[dict]:
        """Get user by email"""
        try:
            db = await get_database()
            user = await db.users.find_one({"email": email})
            if user:
                user["id"] = str(user["_id"])
            return user
        except Exception as e:
            logger.error(f"Error getting user by email: {e}")
            return None
    
    @staticmethod
    async def get_user_by_google_id(google_id: str) -> Optional[dict]:
        """Get user by Google ID"""
        try:
            db = await get_database()
            user = await db.users.find_one({"google_id": google_id})
            if user:
                user["id"] = str(user["_id"])
            return user
        except Exception as e:
            logger.error(f"Error getting user by Google ID: {e}")
            return None
    
    @staticmethod
    async def get_user_stats(email: str) -> dict:
        """Get user donation stats"""
        try:
            db = await get_database()
            donations = await db.donations.find({"email": email}).to_list(length=None)

            total_donated = sum(d['amount'] for d in donations)
            projects_supported = len(set(d['project_id'] for d in donations))

            impact_points = 0
            project_ids = [d['project_id'] for d in donations]
            if project_ids:
                projects = await db.projects.find({"_id": {"$in": [ObjectId(pid) for pid in project_ids]}}).to_list(length=None)
                impact_points = sum(p.get('impactScore', 0) for p in projects)

            return {
                "totalDonated": total_donated,
                "projectsSupported": projects_supported,
                "impactPoints": impact_points
            }
        except Exception as e:
            logger.error(f"Error getting user stats: {e}")
            return {
                "totalDonated": 0,
                "projectsSupported": 0,
                "impactPoints": 0
            }