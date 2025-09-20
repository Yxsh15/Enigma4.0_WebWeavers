from decouple import config

class Settings:
    MONGODB_URL: str = config("MONGODB_URL", default="mongodb://localhost:27017")
    DATABASE_NAME: str = config("DATABASE_NAME", default="myapp")
    
    SECRET_KEY: str = config("SECRET_KEY", default="your-super-secret-key-here")
    ALGORITHM: str = config("ALGORITHM", default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30, cast=int)
    
    GOOGLE_CLIENT_ID: str = config("GOOGLE_CLIENT_ID", default="")
    GOOGLE_CLIENT_SECRET: str = config("GOOGLE_CLIENT_SECRET", default="")
    GOOGLE_REDIRECT_URI: str = config("GOOGLE_REDIRECT_URI", default="http://localhost:8000/auth/google/callback")
    
    FRONTEND_URL: str = config("FRONTEND_URL", default="http://localhost:3000")

    RAZORPAY_KEY_ID: str = config("RAZORPAY_KEY_ID", default="")
    RAZORPAY_KEY_SECRET: str = config("RAZORPAY_KEY_SECRET", default="")
    GEMINI_KEY: str = config("GEMINI_KEY", default="")

settings = Settings()