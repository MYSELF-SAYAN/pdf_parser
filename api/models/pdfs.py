from pydantic import BaseModel
class Conversation(BaseModel):
    question: str
    answer: str

class Pdf(BaseModel):
    title: str
    file: str
    conversations: list[Conversation]