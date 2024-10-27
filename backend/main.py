from fastapi import FastAPI, File, UploadFile
import uvicorn
from PIL import Image
import numpy as np
from utils.face_detection import detect_faces
from utils.face_analysis import analyze_face_attributes
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai


app = FastAPI()

origins = [
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

        user_text = (
            f"Age: {attributes.get('age', 'unknown')}, "
            f"Male: {round(attributes['gender'].get('Man', 0) * 100)}%, "
            f"Female: {round(attributes['gender'].get('Woman', 0) * 100)}%, "
        )

        if attributes.get('emotion'):
            mood_text = ", ".join([f"{mood}: {round(value * 100)}%" for mood, value in attributes['emotion'].items()])
        else:
            mood_text = "No mood data available."

        user_text += f"Mood: {mood_text}"



        apiKey = "AIzaSyDLzDcz_h9JAOFmJmOufB0YGVLYCQW27ZM"
        genai.configure(api_key=apiKey)
        model = genai.GenerativeModel('gemini-1.5-flash')

        prompt = "Consider you are talking to your friend , provide a concise and sarcasting comment to the following information about your friend, using only plain text and avoiding any special characters, symbols, or punctuation (only full stops & commas are allowed) :\n"+user_text

        response =model.generate_content(prompt)
        comment = response.text if response else "No comment available."



        face_data.append({
            "coordinates": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
            "attributes": attributes,
            "comment": comment
        })

    
    

    return {
        "filename": file.filename,
        "faces": face_data
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
