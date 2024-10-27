from fastapi import FastAPI, File, UploadFile
import uvicorn
from PIL import Image
import numpy as np
from utils.face_detection import detect_faces
from utils.face_analysis import analyze_face_attributes


app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Face Analysis API is running!"}

@app.post("/analyze-face/")
async def analyze_face(file: UploadFile = File(...)):
    image = np.array(Image.open(file.file))
    faces = detect_faces(image)

    face_data = []
    for (x, y, w, h) in faces:
        face_image = image[y:y+h, x:x+w]
        attributes = analyze_face_attributes(face_image)
        face_data.append({
            "coordinates": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
            "attributes": attributes
        })

    return {
        "filename": file.filename,
        "faces": face_data
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
