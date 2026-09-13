import cv2
import numpy as np

def analyze_fft(filepath):
    """
    Performs Fast Fourier Transform (FFT) to detect frequency-domain anomalies.
    """
    try:
        img = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise ValueError("Could not read image file.")

        # Compute the 2D FFT
        f = np.fft.fft2(img)
        fshift = np.fft.fftshift(f)
        
        # Calculate magnitude spectrum (for potential visualization/debugging)
        magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1e-8)

        # Isolate high-frequency energy by masking out the center (low frequencies)
        rows, cols = img.shape
        crow, ccol = rows // 2, cols // 2
        mask_size = 30
        
        fshift_high = fshift.copy()
        fshift_high[crow - mask_size : crow + mask_size, ccol - mask_size : ccol + mask_size] = 0
        
        # Calculate the energy of the high frequencies
        high_freq_energy = np.sum(np.abs(fshift_high)) / (rows * cols)

        # Heuristic: Unnatural spikes in high-frequency energy often indicate AI generation
        artifacts_detected = high_freq_energy > 1500

        return {
            "high_frequency_energy": float(high_freq_energy),
            "artifacts_detected": bool(artifacts_detected),
            "status": "success"
        }

    except Exception as e:
        return {"error": str(e)}