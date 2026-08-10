from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="user")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    audio_path = Column(String)
    transcript = Column(String)
    sentiment = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))