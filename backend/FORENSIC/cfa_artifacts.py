import cv2
import numpy as np

def analyze_cfa(filepath):
    """
    Checks for Color Filter Array (CFA) interpolation consistency.
    """
    try:
        img = cv2.imread(filepath)
        if img is None:
            raise ValueError("Could not read image file.")
        
        b, g, r = cv2.split(img.astype(np.float32))
        
        # High-pass filter to extract the image noise/micro-texture
        kernel = np.array([[-1, -1, -1],
                           [-1,  8, -1],
                           [-1, -1, -1]]) / 8.0
        
        noise_g = cv2.filter2D(g, -1, kernel)
        noise_r = cv2.filter2D(r, -1, kernel)
        noise_b = cv2.filter2D(b, -1, kernel)
        
        # Calculate Pearson correlation coefficient between high-frequency color channels
        corr_gr = np.corrcoef(noise_g.flatten(), noise_r.flatten())[0, 1]
        corr_gb = np.corrcoef(noise_g.flatten(), noise_b.flatten())[0, 1]
        
        avg_correlation = (corr_gr + corr_gb) / 2.0
        
        # Real camera demosaicing usually guarantees an avg_correlation > 0.6.
        # AI images generate RGB channels independently and drop below 0.4.
        cfa_pattern_missing = avg_correlation < 0.4
        
        return {
            "cfa_correlation_gr": float(corr_gr),
            "cfa_correlation_gb": float(corr_gb),
            "avg_cfa_correlation": float(avg_correlation),
            "cfa_pattern_missing_or_ai": bool(cfa_pattern_missing)
        }
    except Exception as e:
        return {"error": str(e)}