import os
import uuid
from fastapi import (APIRouter,UploadFile,File,HTTPException,Depends)
from app.database import SessionLocal
from app.models import User, Feedback
from app.schemas import UserCreate, Login
from app.auth import (hash_password,verify_password,create_access_token,get_current_user,require_admin)
from app.ai import transcribe, analyze
from app.storage import upload_audio

router = APIRouter()

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/signup")
def signup(user: UserCreate):

    db = SessionLocal()

    try:
        existing = db.query(User).filter(
            User.username == user.username
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="User already exists"
            )

        new_user = User(
            username=user.username,
            password=hash_password(user.password),
            role="user"
        )

        db.add(new_user)
        db.commit()

        return {"message": "Signup successful"}

    finally:
        db.close()


@router.post("/login")
def login(user: Login):

    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(
            User.username == user.username
        ).first()

        if not existing_user:
            raise HTTPException(status_code=401,detail="Invalid username or password")

        if not verify_password(user.password, existing_user.password):
            raise HTTPException(status_code=401,detail="Invalid username or password")

        token = create_access_token(existing_user.id,existing_user.role)

        return {
            "access_token": token,
            "token_type": "bearer",
            "role": existing_user.role,
            "username": existing_user.username
        }

    finally:
        db.close()


@router.post("/upload")
async def upload_audio_feedback(audio: UploadFile = File(...),current_user=Depends(get_current_user)):

    filename = audio.filename

    local_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    with open(local_path, "wb") as f:
        f.write(await audio.read())

    try:

        # Upload audio to GCP
        cloud_path = (
            f"users/{current_user['user_id']}/{uuid.uuid4()}"
        )

        cloudinary_url = upload_audio(
            local_path,
            cloud_path
        )

        # AI processing
        text = transcribe(local_path)
        sentiment = analyze(text)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(e)}"
        )

    db = SessionLocal()

    try:

        feedback = Feedback(
            filename=filename,
            audio_path=cloudinary_url,
            transcript=text,
            sentiment=sentiment,
            user_id=current_user["user_id"]
        )

        db.add(feedback)
        db.commit()

        return {
            "message": "Feedback uploaded successfully",
            "transcript": text,
            "sentiment": sentiment
        }

    finally:
        db.close()

@router.get("/admin/feedback")
def get_feedback(current_user=Depends(require_admin)):

    db = SessionLocal()

    try:

        results = (
            db.query(Feedback, User)
            .join(User, Feedback.user_id == User.id)
            .all()
        )
        print(results)

        response = []

        for feedback, user in results:

            response.append({
                "id": feedback.id,
                "username": user.username,
                "audio_url": feedback.audio_path,
                "filename": feedback.filename,
                "transcript": feedback.transcript,
                "sentiment": feedback.sentiment
            })

        return response

    finally:
        db.close()