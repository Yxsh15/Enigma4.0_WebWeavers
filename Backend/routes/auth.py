from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import RedirectResponse
from schemas.auth import UserLogin, UserRegister, GoogleLogin, Token
from services.auth_service import AuthService
from services.user_service import UserService
from utils.auth import get_current_user
from utils.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister):
    """Register a new user"""
    return await AuthService.register_user(
        name=user_data.name,
        email=user_data.email,
        password=user_data.password
    )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login user with email and password"""
    return await AuthService.login_user(
        email=user_data.email,
        password=user_data.password
    )

@router.get("/google")
async def google_auth():
    """Redirect to Google OAuth"""
    google_url = AuthService.get_google_oauth_url()
    return {"auth_url": google_url}

@router.get("/google/callback")
async def google_callback(code: str = None, error: str = None):
    """Handle Google OAuth callback"""
    if error:
        logger.error(f"Google OAuth error: {error}")
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=google_oauth_failed"
        )
    
    if not code:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=no_authorization_code"
        )
    
    try:
        token = await AuthService.google_login(code)
        # In a real app, you might want to redirect with the token as a query parameter
        # or store it in a secure way. For now, we'll redirect to frontend with success
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/?google_auth=success&token={token.access_token}"
        )
    except HTTPException as e:
        logger.error(f"Google login failed: {e.detail}")
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=google_login_failed"
        )

@router.post("/google", response_model=Token)
async def google_login(google_data: GoogleLogin):
    """Login with Google authorization code"""
    return await AuthService.google_login(google_data.code)

@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user["name"],
        "profile_picture": current_user.get("profile_picture"),
        "is_active": current_user["is_active"],
        "created_at": current_user["created_at"]
    }

@router.get("/me/stats")
async def get_user_stats(current_user: dict = Depends(get_current_user)):
    """Get current user donation stats"""
    return await UserService.get_user_stats(current_user["email"])

@router.post("/verify-token")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Verify if token is valid"""
    return {"valid": True, "user_id": current_user["id"]}