
from urllib.parse import quote_plus
from dotenv import load_dotenv
import os
from pymongo import MongoClient

load_dotenv()

username = os.getenv("MONGO_USERNAME")
password = os.getenv("MONGO_PASSWORD")
encoded_username = quote_plus(username)
encoded_password = quote_plus(password)
uri = f"mongodb+srv://{encoded_username}:{encoded_password}@cluster0.ev0uhk5.mongodb.net/?retryWrites=true&w=majority"
conn=MongoClient(uri)
db=conn.pdf_parser
pdfCollection=db["pdf"]
userCollection=db["users"]