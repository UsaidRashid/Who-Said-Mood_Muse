import cv2

cascade_path = r'E:\Projects\Face Detector\backend\models\haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(cascade_path)

if face_cascade.empty():
    print("Failed to load Haar Cascade")
else:
    print("Haar Cascade loaded successfully")
