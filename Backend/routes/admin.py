from fastapi import APIRouter, Depends, HTTPException, status
from schemas.auth import UserLogin
from services.auth_service import AuthService
from services.project_service import ProjectService
from utils.auth import get_current_admin_user, create_access_token

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/login")
async def admin_login(user_credentials: UserLogin):
    user = await AuthService.authenticate_user(user_credentials.email, user_credentials.password)
    if not user or user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials or not an admin",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["email"], "role": user.get("role")})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/projects/pending")
async def get_pending_projects(current_user: dict = Depends(get_current_admin_user)):
    projects = await ProjectService.get_pending_projects()
    return projects

@router.put("/projects/{project_id}/approve")
async def approve_project(project_id: str, current_user: dict = Depends(get_current_admin_user)):
    await ProjectService.approve_project(project_id)
    return {"status": "success"}
