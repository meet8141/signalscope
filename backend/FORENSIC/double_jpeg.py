import cv2
import numpy as np

def analyze_double_jpeg(filepath):
    """
    Detects Double JPEG compression by analyzing spatial 8x8 Block Artifact Grids (BAG).
    """
    try:
        img = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise ValueError("Could not read image file.")
        
        # Crop to strict multiples of 8 for JPEG block alignment
        h, w = img.shape
        img = img[:h-(h%8), :w-(w%8)]
        
        # Calculate pixel differences across rows (horizontal) and columns (vertical)
        diff_h = np.abs(img[:, :-1].astype(int) - img[:, 1:].astype(int))
        diff_v = np.abs(img[:-1, :].astype(int) - img[1:, :].astype(int))
        
        # Compare differences at the 8-pixel boundaries vs inside the blocks
        boundary_h = np.mean(diff_h[:, 7::8])
        non_boundary_h = np.mean(np.delete(diff_h, np.s_[7::8], axis=1))
        
        boundary_v = np.mean(diff_v[7::8, :])
        non_boundary_v = np.mean(np.delete(diff_v, np.s_[7::8], axis=0))
        
        bag_ratio_h = boundary_h / (non_boundary_h + 1e-5)
        bag_ratio_v = boundary_v / (non_boundary_v + 1e-5)
        
        # High discontinuity at grid lines indicates multiple JPEG saves over varying qualities
        double_compressed = bag_ratio_h > 1.5 or bag_ratio_v > 1.5
        
        return {
            "horizontal_blocking_ratio": float(bag_ratio_h),
            "vertical_blocking_ratio": float(bag_ratio_v),
            "double_compression_suspected": bool(double_compressed)
        }
    except Exception as e:
        return {"error": str(e)}                                                        