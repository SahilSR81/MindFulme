from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import user, mood, content, notifications
from app.database import engine, Base

app = FastAPI(title="Wellness App API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(user.router)
app.include_router(mood.router)
app.include_router(content.router)
app.include_router(notifications.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Wellness App API"}