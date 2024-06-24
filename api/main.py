from typing import Union
from urllib.parse import quote_plus
import json
from bson import json_util
from fastapi import FastAPI
from api.routers import auth
app = FastAPI()
# username = "sayanmukherjee7663"
# password = "sayan@7663"
# encoded_username = quote_plus(username)
# encoded_password = quote_plus(password)

# # Construct your URI using the encoded credentials
# uri = f"mongodb+srv://{encoded_username}:{encoded_password}@cluster0.ev0uhk5.mongodb.net/?retryWrites=true&w=majority"

# conn=MongoClient(uri)

app.include_router(auth.router)