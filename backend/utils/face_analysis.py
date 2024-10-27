from deepface import DeepFace
from fer import FER
import cv2
import numpy as np
from PIL import Image

def analyze_face_attributes(face_image: np.ndarray) -> dict:
    if face_image.shape[2] == 4:  
        face_image = Image.fromarray(face_image, 'RGBA').convert('RGB')
        face_image = np.array(face_image)

    results = {}
    
    deepface_result = DeepFace.analyze(face_image, actions=['age', 'gender'], enforce_detection=False)
    
    if deepface_result:
        results['age'] = deepface_result[0]['age']
        results['gender'] = deepface_result[0]['gender']

    emotion_detector = FER()
    emotions = emotion_detector.detect_emotions(face_image)

    if emotions:
        results['emotion'] = emotions[0]['emotions']

    return results
