from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List

class ProjectCreate(BaseModel):
    title: str
    description: str
    owner_email: str
    images: Optional[List[str]] = []
    pdfDescription: Optional[str] = None
    category: str
    goalAmount: float
    location: str
    needsVolunteers: bool = False
    volunteerFormUrl: Optional[str] = None
    volunteerDescription: Optional[str] = None