from tensorflow.keras.models import load_model
import os

MODEL_PATH = os.path.join("model", "predictor.keras")

def loadmodel():
    return load_model(MODEL_PATH)