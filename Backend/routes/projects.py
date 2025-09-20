from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from models.project import Project
from services.project_service import ProjectService
from services.gemini_service import GeminiService
from utils.auth import get_current_user
from typing import List, Optional
import os
import shutil
import json

router = APIRouter(prefix="/projects", tags=["projects"])

# Create a directory to store uploaded files
UPLOAD_DIRECTORY = "static/uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@router.post("/")
async def submit_project(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    goalAmount: float = Form(...),
    location: str = Form(...),
    needsVolunteers: bool = Form(...),
    volunteerFormUrl: Optional[str] = Form(None),
    volunteerDescription: Optional[str] = Form(None),
    images: List[UploadFile] = File([]),
    pdfDescription: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user)
):
    image_urls = []
    for image in images:
        file_location = os.path.join(UPLOAD_DIRECTORY, image.filename)
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(image.file, file_object)
        image_urls.append(f"/{UPLOAD_DIRECTORY}/{image.filename}")

    pdf_url = None
    if pdfDescription:
        file_location = os.path.join(UPLOAD_DIRECTORY, pdfDescription.filename)
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(pdfDescription.file, file_object)
        pdf_url = f"/{UPLOAD_DIRECTORY}/{pdfDescription.filename}"

    project_data = Project(
        title=title,
        description=description,
        category=category,
        goalAmount=goalAmount,
        location=location,
        needsVolunteers=needsVolunteers,
        volunteerFormUrl=volunteerFormUrl,
        volunteerDescription=volunteerDescription,
        owner_email=current_user["email"],
        images=image_urls,
        pdfDescription=pdf_url
    )
    
    project = await ProjectService.create_project(project_data)

    # Get societal impact analysis from Gemini API
    impact_analysis_response = GeminiService.get_societal_impact_analysis(project.title, project.description)
    if impact_analysis_response:
        try:
            # Clean the response to extract only the JSON part
            json_string = impact_analysis_response.strip("```json\n").strip("\n```")
            impact_analysis_json = json.loads(json_string)
            impact_score = impact_analysis_json.get('impact_score', 0)
            await ProjectService.update_project_impact_score(project.id, impact_score)
            project.impactScore = impact_score
        except (json.JSONDecodeError, AttributeError) as e:
            print(f"Error parsing impact analysis response: {e}")

    return project

@router.get("/")
async def get_projects():
    projects = await ProjectService.get_approved_projects()
    return projects

@router.get("/{project_id}/donor-count")
async def get_donor_count(project_id: str):
    donor_count = await ProjectService.get_donor_count_for_project(project_id)
    return {"donor_count": donor_count}
