from fastapi import APIRouter, Body, HTTPException
from ..config.db import pdfCollection, userCollection
from bson import json_util
from fastapi.responses import JSONResponse
from ..models.user import User
from ..schemas.userSchema import userEntity
from pymongo.errors import ServerSelectionTimeoutError
from ..other.hashing import Hasher

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/create")
def create_user(user: User = Body(...)):
    try:
        user.password = Hasher.hash(user.password)
        response = userCollection.insert_one(dict(user))
        return JSONResponse(
            content={"message": "User created successfully"}, status_code=201
        )
    except Exception as e:
        return JSONResponse(content={"message": str(e)}, status_code=500)


@router.post("/login")
def login_user(user: User = Body(...)):
    try:
        stored_user = userCollection.find_one({"name": user.name})
        if stored_user:
            check = Hasher.check(user.password, stored_user["password"])
            if check == False:
                return JSONResponse(
                    content={"message": "Invalid password"}, status_code=401
                )
            else:
                # del stored_user["password"]

                return JSONResponse(
                    content={
                        "message": "User logged in successfully",
                        "user": userEntity(stored_user),
                    },
                    status_code=200,
                )
        else:
            return JSONResponse(content={"message": "User not found"}, status_code=404)
    except ServerSelectionTimeoutError as e:
        raise HTTPException(status_code=500, detail="Database connection error")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
