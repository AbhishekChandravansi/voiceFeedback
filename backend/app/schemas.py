from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class Login(BaseModel):
    username: str
    password: str