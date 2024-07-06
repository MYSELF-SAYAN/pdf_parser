from fastapi import FastAPI, File, UploadFile, HTTPException
import dropbox
from io import BytesIO
from datetime import datetime
import requests
from dotenv import load_dotenv
import os

load_dotenv()

def get_access_token():
    url = "https://api.dropbox.com/oauth2/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "refresh_token",
        "refresh_token": os.getenv("DROPBOX_REFRESH_TOKEN"),
        "client_id": os.getenv("DROPBOX_CLIENT_ID"),
        "client_secret": os.getenv("DROPBOX_CLIENT_SCERET"),
    }
    response = requests.post(url, headers=headers, data=data)
    response.raise_for_status()
    return response.json()["access_token"]


DROPBOX_ACCESS_TOKEN = get_access_token()
dbx = dropbox.Dropbox(DROPBOX_ACCESS_TOKEN)


# Mz9Muw5db6QAAAAAAAAAI9PDTC-cGkQcIaeYwvU3-SE
async def uploadPdf(pdf_buffer: BytesIO, filename: str):
    try:
        unique_suffix = datetime.now().strftime("%Y%m%d%H%M%S")
        unique_file_name = (
            f"{filename.rsplit('.', 1)[0]}_{unique_suffix}.{filename.rsplit('.', 1)[1]}"
        )

        dropbox_path = f"/{unique_file_name}"

        dbx.files_upload(pdf_buffer.getvalue(), dropbox_path)
        link = dbx.sharing_create_shared_link_with_settings(dropbox_path)
        url = link.url
        return {
            "response": url,
            "message": "File uploaded successfully to Dropbox.",
        }

    except dropbox.exceptions.ApiError as e:
        raise HTTPException(status_code=500, detail=f"Dropbox API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")
