# models/project.py

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema): # Changed method name
        field_schema.update(type="string", format="objectid") # Modified implementation

class Project(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    owner_email: str
    images: Optional[List[str]] = []
    pdfDescription: Optional[str] = None
    status: str = "pending"
    category: str
    goalAmount: float
    raisedAmount: float = 0.0
    impactScore: int = 0
    supportersCount: int = 0
    location: str
    needsVolunteers: bool = False
    volunteerFormUrl: Optional[str] = None # Pydantic v2 would use HttpUrl here
    volunteerDescription: Optional[str] = None

    class Config:
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True