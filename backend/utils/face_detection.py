import cv2
import os
import numpy as np
from typing import List, Tuple

def detect_faces(image: np.ndarray) -> List[Tuple[int, int, int, int]]:
    current_directory = os.path.dirname(os.path.abspath(__file__))
    cascade_path = os.path.join(current_directory,'..', 'models', 'haarcascade_frontalface_default.xml')


    if not os.path.exists(cascade_path):
        raise Exception(f"Haar Cascade XML file not found at: {cascade_path}")

    try:
        face_cascade = cv2.CascadeClassifier(cascade_path)
        if face_cascade.empty():
            raise ValueError("Could not load cascade classifier from the given path.")
    except Exception as e:
        print(f"Error loading cascade classifier: {e}")
        raise

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    return faces
