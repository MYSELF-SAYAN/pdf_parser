from typing import Union
from urllib.parse import quote_plus
import json
from bson import json_util
from fastapi import FastAPI
from api.routers import auth, pdf
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

origins = [
    "http://localhost:5173","http://localhost:52531",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(pdf.router)