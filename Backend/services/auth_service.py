from fastapi import HTTPException, status
from datetime import timedelta
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from utils.config import settings
from services.user_service import UserService
from schemas.auth import Token
from utils.auth import create_access_token, verify_password
import logging
import requests

logger = logging.getLogger(__name__)

class AuthService:
    @staticmethod
    async def authenticate_user(email: str, password: str) -> dict | None:
        """Authenticate user with email and password"""
        user = await UserService.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.get("password_hash", "")):
            return None
        return user
    
    @staticmethod
    async def login_user(email: str, password: str) -> Token:
        """Login user and return token"""
        user = await AuthService.authenticate_user(email, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["email"], "role": user.get("role", "user")}, expires_delta=access_token_expires
        )
        
        # Remove sensitive data from user object
        user_data = {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "profile_picture": user.get("profile_picture"),
            "is_active": user["is_active"],
            "role": user.get("role", "user"),
            "created_at": user["created_at"]
        }
        
        return Token(access_token=access_token, token_type="bearer", user=user_data)
    
    @staticmethod
    async def register_user(name: str, email: str, password: str) -> Token:
        """Register new user and return token"""
        # Check if user already exists
        existing_user = await UserService.get_user_by_email(email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        user_data = {
            "name": name,
            "email": email,
            "password": password
        }
        
        user = await UserService.create_user(user_data)
        user_data = {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "profile_picture": user.profile_picture,
            "is_active": user.is_active,
            "role": user.role,
            "created_at": user.created_at
        }

        return Token(access_token=access_token, token_type="bearer", user=user_data)
    
    @staticmethod
    async def google_login(code: str) -> Token:
        """Handle Google OAuth login"""
        try:
            # Exchange authorization code for tokens
            token_url = "https://oauth2.googleapis.com/token"
            token_data = {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            }
            
            token_response = requests.post(token_url, data=token_data)
            token_response.raise_for_status()
            token_json = token_response.json()
            
            # Verify the ID token
            id_info = id_token.verify_oauth2_token(
                token_json["id_token"], 
                google_requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )
            
            google_id = id_info["sub"]
            email = id_info["email"]
            name = id_info["name"]
            picture = id_info.get("picture")
            
            # Check if user exists with Google ID
            user = await UserService.get_user_by_google_id(google_id)
            
            if not user:
                # Check if user exists with email
                user = await UserService.get_user_by_email(email)
                
                if user:
                    # Update existing user with Google ID
                    await UserService.update_user(email, {
                        "google_id": google_id,
                        "profile_picture": picture
                    })
                    user = await UserService.get_user_by_email(email)
                else:
                    # Create new user
                    user_data = {
                        "name": name,
                        "email": email,
                        "google_id": google_id,
                        "profile_picture": picture
                    }
                    user_response = await UserService.create_user(user_data)
                    if not user_response:
                        raise HTTPException(
                            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Failed to create user"
                        )
                    user = await UserService.get_user_by_email(email)
            
            # Generate token
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user["email"], "role": user.get("role", "user")}, expires_delta=access_token_expires
            )            
            # Remove sensitive data from user object
            user_data = {
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user["name"],
                "profile_picture": user.get("profile_picture"),
                "is_active": user["is_active"],
                "role": user.get("role", "user"),
                "created_at": user["created_at"]
            }
            
            return Token(access_token=access_token, token_type="bearer", user=user_data)
            
        except Exception as e:
            logger.error(f"Google login error: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Google login failed: {str(e)}"
            )
    
    @staticmethod
    def get_google_oauth_url() -> str:
        """Generate Google OAuth URL"""
        base_url = "https://accounts.google.com/o/oauth2/auth"
        params = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "scope": "openid email profile",
            "response_type": "code",
            "access_type": "offline",
            "prompt": "consent"
        }
        
        param_string = "&".join([f"{key}={value}" for key, value in params.items()])
        return f"{base_url}?{param_string}"