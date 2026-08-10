import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)


def upload_audio(file_path: str, destination_name: str):

    result = cloudinary.uploader.upload(
        file_path,
        resource_type="video",
        public_id=destination_name,
        overwrite=True
    )

    return result["secure_url"]


# def generate_audio_url(public_id: str):

#     result = cloudinary.utils.cloudinary_url(
#         public_id,
#         resource_type="video",
#         secure=True
#     )

#     return result[0]