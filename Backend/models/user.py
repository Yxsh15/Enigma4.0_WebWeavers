from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from bson import ObjectId

class User(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    name: str
    password_hash: Optional[str] = None
    google_id: Optional[str] = None
    profile_picture: Optional[str] = None
    is_active: bool = True
    role: str = "user"
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()
    
    class Config:
        json_encoders = {ObjectId: str}

class UserInDB(User):
    password_hash: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    profile_picture: Optional[str] = None
    is_active: bool
    role: str
    created_at: datetime
    
    class Config:
        json_encoders = {ObjectId: str}