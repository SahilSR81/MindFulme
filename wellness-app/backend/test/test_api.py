import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.auth import create_access_token

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture
def test_user():
    user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword",
        "full_name": "Test User",
        "gender": "Other",
        "date_of_birth": "1990-01-01",
        "interests": "health,wellness",
        "occupation": "Tester",
        "language": "en"
    }
    response = client.post("/users/", json=user_data)
    assert response.status_code == 200
    return response.json()

@pytest.fixture
def test_token(test_user):
    return create_access_token(data={"sub": test_user["username"]})

def test_create_user():
    response = client.post(
        "/users/",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpassword",
            "full_name": "New User",
            "gender": "Female",
            "date_of_birth": "1995-05-05",
            "interests": "yoga,meditation",
            "occupation": "Developer",
            "language": "en"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "id" in data

def test_login(test_user):
    response = client.post(
        "/token",
        data={
            "username": test_user["username"],
            "password": "testpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_read_users_me(test_token):
    response = client.get(
        "/users/me/",
        headers={"Authorization": f"Bearer {test_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"

def test_create_mood(test_token):
    response = client.post(
        "/moods/",
        headers={"Authorization": f"Bearer {test_token}"},
        json={"score": 4}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 4
    assert "id" in data
    assert "user_id" in data
    assert "timestamp" in data

def test_predict_mood(test_token):
    response = client.get(
        "/moods/predict?feeling_sick=false&exercised=true&ate_well=true&missed_event=false&other=Had a great day",
        headers={"Authorization": f"Bearer {test_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "predicted_mood" in data
    assert isinstance(data["predicted_mood"], int)

def test_get_content(test_token):
    content_types = ["quote", "joke", "game", "yoga", "story"]
    for content_type in content_types:
        response = client.get(
            f"/content/{content_type}",
            headers={"Authorization": f"Bearer {test_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == content_type
        assert "content" in data
        assert "source" in data

def test_create_notification(test_token):
    response = client.post(
        "/notifications/send",
        headers={"Authorization": f"Bearer {test_token}"},
        json={"message": "Test notification"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Notification scheduled"

def test_invalid_token():
    response = client.get(
        "/users/me/",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"

def test_missing_token():
    response = client.get("/users/me/")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

# Add more test cases as needed for edge cases and error handling