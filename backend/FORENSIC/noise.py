import cv2
import numpy as np
import os

def analyze_forensics(filepath):
    """
    Performs Error Level Analysis (ELA) to detect varying compression levels.
    """
    try:
        original = cv2.imread(filepath)
        if original is None:
            raise ValueError("Could not read image file.")

        # Resave the image at a known quality (e.g., 90) to create a baseline
        temp_jpg = f"{filepath}_ela_temp.jpg"
        cv2.imwrite(temp_jpg, original, [cv2.IMWRITE_JPEG_QUALITY, 90])
        
        compressed = cv2.imread(temp_jpg)
        os.remove(temp_jpg)

        # Calculate the absolute difference between the original and compressed image
        diff = cv2.absdiff(original, compressed)
        
        max_diff = np.max(diff)
        avg_diff = np.mean(diff)

        # Heuristic: Highly manipulated images often have stark differences in ELA
        manipulation_detected = max_diff > 50 and avg_diff > 2.0

        return {
            "manipulation_detected": bool(manipulation_detected),
            "max_noise_difference": float(max_diff),
            "avg_noise_difference": float(avg_diff),
            "anomalies": ["High noise variance detected"] if manipulation_detected else []
        }

    except Exception as e:
        return {"error": str(e)}