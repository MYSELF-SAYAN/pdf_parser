from pydantic import BaseModel
from typing import Optional, List,Dict


class Part(BaseModel):
    text: str


class Conversation(BaseModel):
    parts:  Dict[str, str]
    role: str


class Pdf(BaseModel):
    title: str
    fileurl: str
    fileData: str
    conversations: Optional[List[Conversation]] = []
