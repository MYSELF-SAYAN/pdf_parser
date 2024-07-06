from pydantic import BaseModel
from typing import Optional
from fastapi import UploadFile
from .pdfs import Pdf 
class pdfCreationReq(BaseModel):
    username: str
    title: str
    file: UploadFile
   # pdfs: Optional[list[Pdf]]=[]