from datetime import datetime
from typing import Optional
from bson import ObjectId
from pydantic import BaseModel, Field

class DonationOrder(BaseModel):
    amount: float
    project_id: str
    name: Optional[str] = None
    email: Optional[str] = None
    message: Optional[str] = None

class Donation(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    project_id: str
    amount: float
    currency: str = "INR"
    transaction_id: Optional[str] = None
    status: str = "pending"  # e.g., pending, completed, failed
    donated_by: Optional[str] = None  # User ID or name
    donated_at: datetime = Field(default_factory=datetime.utcnow)
    name: Optional[str] = None
    email: Optional[str] = None
    message: Optional[str] = None

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "project_id": "60d0fe4f5311236168a109ca",
                "amount": 100.00,
                "currency": "INR",
                "transaction_id": "txn_123abc",
                "status": "completed",
                "donated_by": "user123",
                "donated_at": "2023-10-27T10:00:00Z"
            }
        }
