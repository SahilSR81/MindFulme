from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import dependencies
from app.auth import get_current_user
from app.ml_model import mood_predictor

router = APIRouter()

@router.post("/moods/", response_model=schemas.Mood)
def create_mood(
    mood: schemas.MoodCreate,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_mood(db=db, mood=mood, user_id=current_user.id)

@router.get("/moods/predict")
def predict_mood(
    feeling_sick: bool,
    exercised: bool,
    ate_well: bool,
    missed_event: bool,
    other: str,
    current_user: models.User = Depends(get_current_user)
):
    features = [[int(feeling_sick), int(exercised), int(ate_well), int(missed_event), len(other)]]
    try:
        prediction = mood_predictor.predict(features)
        return {"predicted_mood": int(prediction[0])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))