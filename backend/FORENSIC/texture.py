import cv2
import numpy as np

def analyze_texture(filepath):
    """
    Analyzes image texture using Laplacian variance.
    """
    try:
        img = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise ValueError("Could not read image file.")

        # Calculate the Laplacian of the image to detect edges and texture
        laplacian = cv2.Laplacian(img, cv2.CV_64F)
        variance = laplacian.var()

        # Heuristic: AI images often have unusually smooth textures (low variance) 
        # or overly crisp artifacting (extremely high variance).
        is_anomalous = variance < 50 or variance > 5000

        return {
            "texture_variance": float(variance),
            "anomalous_texture": bool(is_anomalous),
            "status": "success"
        }

    except Exception as e:
        return {"error": str(e)}