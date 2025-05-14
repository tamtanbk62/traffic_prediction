from models.request_response import PredictionRequest, PredictionResponse
from services.model_loader import load_model
import numpy as np

model = load_model()

def predict_density(request: PredictionRequest) -> PredictionResponse:
    # input_array = np.array(request.recent_densities).reshape(1, -1)
    # pred = model.predict(input_array)[0]
    # return PredictionResponse(camera_id=request.camera_id, predicted_density=round(float(pred), 4))
    return PredictionResponse(camera_id='123456779', predicted_density=0.1234) # mock response