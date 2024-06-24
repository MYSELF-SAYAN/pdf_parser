from pydantic import BaseModel
from typing import Optional
from .pdfs import Pdf 
class User(BaseModel):
    name: str
    email:Optional[str]=None 
    password: str
    pdfs: Optional[list[Pdf]]=[]