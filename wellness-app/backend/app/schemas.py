from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    gender: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    interests: Optional[str] = None
    occupation: Optional[str] = None
    language: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class MoodCreate(BaseModel):
    score: int

class Mood(MoodCreate):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        orm_mode = True

class ContentBase(BaseModel):
    type: str
    content: str
    source: str

class ContentCreate(ContentBase):
    pass

class Content(ContentBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None