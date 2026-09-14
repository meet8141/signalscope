# Important Libraries

| Layer / Domain | Python Library | Core Functions Used | Operational Role |
| :--- | :--- | :--- | :--- |
| **C2PA Authentication** | `c2pa-python` | `c2pa.Reader()`, `reader.json()`, `reader.validation_status()` | Extract cryptographic hashes + provenance claims. |
| **Header Forensics** | `Pillow (PIL)`, `piexif` | `img._getexif()`, `TAGS.get()` | Extract camera and software identifiers + timestamps. |
| **Frequency Analysis** | `NumPy (np)` | `np.fft.fft2()`, `np.fft.fftshift()`, `np.fft.ifft2()` | Compute 2D FFT for spectral artifact detection. |
| **Noise & Edge Profiling** | `OpenCV (cv2)` | `cv2.fastNlMeansDenoising()`, `cv2.Laplacian()`, `cv2.Sobel()` | Estimate noise and edge/structure consistency. |
| **Error Level / Compression** | `SciPy` | `scipy.ndimage.generic_filter()` | Optional local compression/anomaly scoring. |
| **Texture Matrix Analytics** | `scikit-image` | `feature.graycomatrix()`, `feature.graycoprops()` | Compute GLCM contrast/homogeneity metrics. |
| **Deep Learning Inference** | `TensorFlow(keras)` | `MobileNetV2()` | Predict AI-generation likelihood score. |
| **Backend API** | `FastAPI` | `main.py` setup | Expose pipeline functionality via endpoints. |
