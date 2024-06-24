
from urllib.parse import quote_plus

from pymongo import MongoClient
username = "sayanmukherjee7663"
password = "sayan@7663"
encoded_username = quote_plus(username)
encoded_password = quote_plus(password)
uri = f"mongodb+srv://{encoded_username}:{encoded_password}@cluster0.ev0uhk5.mongodb.net/?retryWrites=true&w=majority"
conn=MongoClient(uri)
db=conn.pdf_parser
pdfCollection=db["pdf"]
userCollection=db["users"]