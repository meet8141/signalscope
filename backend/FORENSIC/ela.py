import cv2
import numpy as np
import os

def analyze_ela(filepath, block_size=16):
    """
    Grid-based Error Level Analysis to detect localized copy-paste manipulations.
    """
    try:
        original = cv2.imread(filepath)
        if original is None:
            raise ValueError("Could not read image file.")
        
        # Resave at known quality
        temp_jpg = f"{filepath}_ela.jpg"
        cv2.imwrite(temp_jpg, original, [cv2.IMWRITE_JPEG_QUALITY, 90])
        compressed = cv2.imread(temp_jpg)
        os.remove(temp_jpg)
        
        # Calculate absolute difference
        diff = cv2.absdiff(original, compressed)
        gray_diff = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        
        # Grid-based block analysis
        h, w = gray_diff.shape
        blocks = []
        for y in range(0, h, block_size):
            for x in range(0, w, block_size):
                block = gray_diff[y:y+block_size, x:x+block_size]
                blocks.append(np.mean(block))
        
        max_block = np.max(blocks)
        median_block = np.median(blocks)
        
        # Heuristic: If a single block has a vastly higher error than the median, 
        # it is likely spliced from a different image with different compression.
        anomaly_ratio = max_block / (median_block + 1e-5)
        localized_manipulation = anomaly_ratio > 5.0 and max_block > 20
        
        return {
            "max_block_noise": float(max_block),
            "median_block_noise": float(median_block),
            "anomaly_ratio": float(anomaly_ratio),
            "localized_manipulation_detected": bool(localized_manipulation)
        }
    except Exception as e:
        return {"error": str(e)}