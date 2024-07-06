from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, APIRouter, Body, Form
import dropbox
from datetime import datetime
from io import BytesIO
from PyPDF2 import PdfReader
from ..other.pdfUpload import uploadPdf
import requests
from ..models.pdfCreationReq import pdfCreationReq
from ..config.db import userCollection
from ..models.user import User
from ..schemas.userSchema import userEntity
import google.generativeai as genai
from ..models.pdfs import Conversation, Pdf
from dotenv import load_dotenv
import os

load_dotenv()
router = APIRouter(prefix="/pdf", tags=["pdf"])
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")
# chat = model.start_chat(history=[])


def extract_text_from_pdf(pdf_stream):
    pdf_reader = PdfReader(pdf_stream)
    text = ""
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()
    return text


@router.post("/parse")
async def parsePdf(
    username: str = Form(...), title: str = Form(...), file: UploadFile = File(...)
):
    user = userCollection.find_one({"name": username})
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="File format not supported. Please upload a PDF file.",
        )

    contents = await file.read()
    pdf_buffer = BytesIO(contents)

    pdf_buffer.seek(0)
    res = await uploadPdf(pdf_buffer, file.filename)

    pdf_buffer.seek(0)
    text = extract_text_from_pdf(pdf_buffer)
    pdfdata = {
        "title": title,
        "fileurl": res["response"],
        "fileData": text,
        "conversations": [],
    }
    userCollection.update_one(
        {"name": username},
        {"$push": {"pdfs": pdfdata}},
    )

    return {"content": {"message": "User created successfully"}, "status_code": 200}
        # "fileurl": res["response"],
        # "text": text,
    

@router.get("/getPdfs/{username}")
async def getPdfs(username: str):
    user = userCollection.find_one({"name": username})
    pdfs = user["pdfs"]
    return pdfs

@router.post("/chat")
async def chatPdf(
    username: str = Body(...), title: str = Body(...), prompt: str = Body(...)
):
    user = userCollection.find_one({"name": username})
    pdfs = user["pdfs"]
    pdf_data = None
    for pdf in pdfs:
        if pdf["title"] == title:
            pdf_data = pdf
    if not pdf_data["conversations"]:
        first_prompt = f"Act like a frienly chatbot whose name is PDFify and analyze the pdf data {pdf_data['fileData']} and answer the questions asked hereafter and start with the sentence exactly 'Hello, I am PDFify how can I help you?' only no extra data only the line."
        chat = model.start_chat(history=[])
        response = chat.send_message(first_prompt)
        pdf_data["conversations"].append({"text": first_prompt, "role": "user"})
        pdf_data["conversations"].append(
            {
                "text": response._result.candidates[0].content.parts[0].text,
                "role": "model",
            }
        )
        userCollection.update_one(
            {"name": username, "pdfs.title": title},
            {"$set": {"pdfs.$.conversations": pdf_data["conversations"]}},
        )
    else:
        chat = model.start_chat(history=[])
        new_prompt = f"This is the pdf data {pdf_data['fileData']} and generate the response for the prompt {prompt}, act like a chatbot with friendly tone the response should not in include * symbol"
        response = chat.send_message(new_prompt)
        pdf_data["conversations"].append({"text": prompt, "role": "user"})
        pdf_data["conversations"].append(
            {
                "text": response._result.candidates[0].content.parts[0].text,
                "role": "model",
            }
        )
        userCollection.update_one(
            {"name": username, "pdfs.title": title},
            {"$set": {"pdfs.$.conversations": pdf_data["conversations"]}},
        )

    return {
        "pdf": pdf_data["title"],
        "response": response._result.candidates[0].content.parts[0].text,
    }

@router.get("/getChat/{username}/{title}")
def getChat(username: str, title: str):
    user = userCollection.find_one({"name": username})
    pdfs = user["pdfs"]
    pdf_data = None
    for pdf in pdfs:
        if pdf["title"] == title:
            pdf_data = pdf
    return pdf_data["conversations"]