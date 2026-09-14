# 🔍 SignalScope: Real vs. AI-Generated Image Detection Pipeline

<p align="center">
  <em>A Multi-Layered Hybrid Forensic Pipeline for Real vs. AI-Generated Image Detection Using Gated Ingestion Logic</em>
</p>

> **🎯 About:** A high-accuracy, multi-layered forensic pipeline designed to detect AI-generated images using deep learning (MobileNetV2), metadata analysis, and pixel-level forensics.


---

## 📖 Introduction & Problem Statement

The exponential rise of generative AI (diffusion models, GANs, large vision models like Midjourney, DALL-E 3, Stable Diffusion) makes it increasingly difficult to distinguish a real photograph from an AI-generated image.

Traditional detection mechanisms often rely on a single layer of verification—e.g., pure metadata analysis or an isolated deep-learning classifier. Adversaries can strip metadata, spoof headers, or fool standard CNNs.

**SignalScope** proposes a resilient, multi-layer hybrid verification framework that checks **cryptographic provenance**, **header/metadata integrity**, **pixel-domain forensics**, and **deep-model inference** in a gated (threshold-based) decision engine.

---

## 🏗️ Core Methodology (Four Parallel Layers)

The pipeline enforces parallel analysis across five foundational layers:

1. **C2PA Layer (Cryptographic Provenance)**
   - Validates content credentials using Coalition for Content Provenance and Authenticity (C2PA) standards. If a valid manifest exists, it provides high-confidence provenance.
2. **Metadata Layer (EXIF/Header Analysis)**
   - Audits binary headers for device and software signatures. Flags spoofed or inconsistent tags and "synthetic software" traces.
3. **Forensic Layer (Pixel + Frequency Domain)**
   - **Noise analysis**: Variance / standard deviation and (optionally) Error Level Analysis (ELA).
   - **Texture analysis (GLCM)**: Contrast, homogeneity, energy to detect “over-smooth / airbrushed” artifacts.
   - **FFT analysis**: Frequency-domain inspection for grid/chessboard artifacts and diffusion block patterns.
   - **Double JPEG compression**: DCT block evaluation and quantization matrix mismatches.
   - **CFA (Color Filter Array) artifacts**: Demosaicing pattern statistical extraction.
4. **CNN Detection Layer (MobileNetV2 / Deep Learning Domain)**
   - **Inverted residuals & linear bottlenecks**: Preserving subtle low-level edge artifacts.
   - **Depthwise separable convolutions**: Reducing computational complexity enabling real-time analysis on edge devices.
   - **Transfer learning & fine-tuning**: Leveraging pre-trained ImageNet weights adapted specifically for deepfake detection.

---

## 🛠️ Technical Stack Register

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

---

## 🚀 How to Run the Backend

To spin up the FastAPI backend locally, open your terminal and run the following commands:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies (if you haven't already)
pip install -r ../requirements.txt

# Start the FastAPI server using Uvicorn
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
You can access the interactive Swagger documentation at `http://localhost:8000/docs`.

---

## 📊 Datasets & Preparation

We utilize high-quality combined datasets to train our models:
- [HybridForensics Dataset](https://www.kaggle.com/datasets/shanmuk4622/real-and-fake-ai-generated-512px-dataset?select=HybridForensics_Dataset_High)
- [CIFAKE Dataset](https://www.kaggle.com/datasets/birdy654/cifake-real-and-ai-generated-synthetic-images)
- [AI Art Images Dataset](https://www.kaggle.com/datasets/doctorstrange420/real-and-fake-ai-generated-art-images-dataset)

### Dataset Distribution
| Type | Train (80%) | Test (20%) | Total |
| :--- | :--- | :--- | :--- |
| **REAL** | 52,656 | 13,165 | 65,821 |
| **FAKE** | 60,656 | 15,165 | 75,821 |
| **Total** | 113,312 | 28,330 | 141,642 |

---

## 🧠 Model Training

We initialized a MobileNetV2 architecture with pre-trained weights (base brain frozen), augmenting it with custom decision layers for robust 0 (Real) and 1 (Fake) classification.

### Training Strategy
- **Input Size**: 512x512
- **Batch Size**: 32
- **Epochs**: 10
- **Smart Callbacks**: Early stopping, learning rate reduction on plateau, and model checkpointing on best accuracy.
- **Data Augmentation**: Training feed incorporates slight tilts/flips to prevent pure memorization, while test feeders evaluate raw frames.

---

## 📈 Model Performance Stats

The following are the primary metrics and operating points from our actual model training execution:

### Primary Metric
*   **ROC-AUC**: 0.9690

### Classification
*   **Macro-F1**: 0.9068
*   **Accuracy**: 0.9071
*   **Precision**: 0.8821
*   **Recall**: 0.9234

### Operating Point
*   **Threshold**: 0.5452
*   **Specificity**: 0.8929
*   **False Positive Rate**: 0.1071

### Confusion Matrix
*   **TN**: 13541
*   **FP**: 1624
*   **FN**: 1009
*   **TP**: 12156

### Additional
*   **Average Precision**: 0.9633

---

## 🖼️ Gallery / Visualizations

Below are the visualizations and outputs from the training run located in the `images` directory:

<div align="center">
  <img src="images/WhatsApp%20Image%202026-09-13%20at%204.10.42%20PM.jpeg" width="30%" alt="Image 1"/>
  <img src="images/WhatsApp%20Image%202026-09-13%20at%204.10.58%20PM.jpeg" width="30%" alt="Image 2"/>
  <img src="images/WhatsApp%20Image%202026-09-13%20at%204.11.04%20PM.jpeg" width="30%" alt="Image 3"/>
  <br/>
  <img src="images/WhatsApp%20Image%202026-09-13%20at%204.11.10%20PM.jpeg" width="30%" alt="Image 4"/>
  <img src="images/WhatsApp%20Image%202026-09-13%20at%204.11.19%20PM.jpeg" width="30%" alt="Image 5"/>
  <img src="images/WhatsApp%20Image%202026-09-13%20at%204.11.28%20PM.jpeg" width="30%" alt="Image 6"/>
  <br/>
  <img src="images/WhatsApp%20Image%202026-09-13%20at%204.11.51%20PM.jpeg" width="30%" alt="Image 7"/>
  <img src="images/WhatsApp%20Image%202026-09-13%20at%204.12.00%20PM.jpeg" width="30%" alt="Image 8"/>
  <img src="images/WhatsApp%20Image%202026-09-13%20at%204.12.08%20PM.jpeg" width="30%" alt="Image 9"/>
</div>

---

## 🚀 Expected Contributions & Conclusion

This framework is designed to remain resilient against:
- **Compression degradation** (common on social platforms)
- **Tag spoofing / header manipulation**
- **Model evasion attacks**

By using gated ingestion logic, the system avoids unnecessary compute on decisively marked content while improving robustness via combined structural, texture, and spectral analysis when provenance is inconclusive.
