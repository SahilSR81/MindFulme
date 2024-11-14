from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import dependencies
from app.auth import get_current_user

router = APIRouter()

@router.get("/content/{content_type}", response_model=schemas.Content)
def get_content(
    content_type: str,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(get_current_user)
):
    content = crud.get_content(db, content_type)
    if content is None:
        raise HTTPException(status_code=404, detail="Content not found")
    return content