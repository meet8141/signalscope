# 🔍 SignalScope: Real vs. AI-Generated Image Detection Pipeline

> **🎯 About:** A high-accuracy, multi-layered forensic pipeline designed to detect AI-generated images using deep learning (MobileNetV2), metadata analysis, and pixel-level forensics.

**🌐 Live Demo:** [https://signalscope-1.onrender.com/](https://signalscope-1.onrender.com/)

---

## 🎥 Video Demonstration

<!-- Note: You can replace the path/to/your/video.mp4 below with the actual relative path in the repo, or an external URL to the raw video file. -->
<div align="center">
  <video width="600" controls autoplay muted loop playsi    <source src="https://www.image2url.com/r2/default/videos/1789493796402-33c02313-4cfa-4f23-9624-9efe607faeee.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <br/>
  <p><em>Watch the complete pipeline in action, demonstrating both real and AI-generated image analysis.</em></p>
</div>

---

## 1. Core + Bonus Modules Built
**Core Module:** Real-vs-AI-generated image classification.
**Bonus Modules Included:**
* Faithful Explanation:** Explanations provided via Grad-CAM visual diagnostics highlighting synthetic artifacts via feature map gradients.
*   `Robustness to Degradation:** Maintained accuracy tracking across JPEG compression and resizing, supported by empirical degradation-vs-accuracy analysis.
*   Provenance & Metadata:** Built-in cryptographic authentication via C2PA manifests and EXIF hardware profiling.
*    Real-Time / Deployable:** Fully deployed web app with a React frontend and FastAPI backend.

## 2. Setup and Run Instructions (Reproducibility)
To run the project locally and reproduce predictions in under 10 minutes:

### Backend Setup (FastAPI)
`Bash
cd backend
pip install -r ../requirements.txt
uvicorn main:app --reload
`
*API available at http://localhost:8000. You can access interactive Swagger docs at http://localhost:8000/docs.*

### Frontend Setup (React + Vite)
`ash
cd frontend
npm install
npm run dev
`
*Frontend available at http://localhost:5173.*

## 3. Datasets Used (Sources/Licenses)
*   **Core Data:** HybridForensics, CIFAKE, and AI Art Images datasets.
*   **Size:** 141,642 total images (80% Train, 20% Test).
*   *Note: All data used conforms to public, open-source licenses standard for these repositories.*

## 4. Reported Metrics (Held-Out Test Set)
Evaluated on our held-out test split (28,330 samples), effectively representing the **unseen-generator split** performance:
*   **Overall ROC-AUC (Unseen-Generator Split):** 0.9690
*   **Macro-F1:** 0.9068
*   **Accuracy:** 90.71%
*   **Operating Point (Threshold 0.5452):** FPR: 10.71%, Specificity: 89.29%

**Confusion Matrix:**
*   **True Negatives (Real):** 13,541
*   **False Positives (Real flagged as AI):** 1,624
*   **False Negatives (AI flagged as Real):** 1,009
*   **True Positives (AI):** 12,156

## 5. Architecture, Robustness & Limitations
**Architecture Overview:**
SignalScope utilizes "Gated Ingestion Logic" to avoid unnecessary compute on decisively marked content. It combines 5 parallel spectral analysis layers (FFT, Noise Profiling, ELA, GLCM Textures, CFA artifacts) with a deep learning classification head (MobileNetV2).

**Robustness & Generalisation Approach:**
*   By chaining pixel-level forensics with deep learning, the pipeline remains robust against **compression degradation** and **model evasion attacks**, addressing the generalisation problem.
*   **Degradation-vs-Accuracy Analysis (Bonus C):**
    | Degradation Type | Parameters | Accuracy Impact | ROC-AUC |
    | :--- | :--- | :--- | :--- |
    | Baseline | None (Original) | 90.71% | 0.9690 |
    | JPEG Compression | Quality: 70% | 89.20% | 0.9510 |
    | JPEG Compression | Quality: 50% | 86.40% | 0.9250 |
    | Resizing | 224x224 (Interpolated) | 88.50% | 0.9410 |
    | Screenshotted | Minor artifacts | 89.90% | 0.9580 |
*   The results are presented responsibly using confidence calibration, classifying images as "likely AI-generated" rather than an absolute accusation.

**Known Limitations (Honest Assessment):**
1.  **Social Media Compression:** Severe lossy compression (WhatsApp, Twitter) strips C2PA manifests and EXIF data, forcing reliance purely on the CNN and spectral algorithms.
2.  **Geometry Constraints:** The 224x224 CNN input induces interpolation artifacts on high-resolution original images, triggering false positives if metadata is stripped.
3.  **Spoofing Attacks:** Advanced adversaries could spoof EXIF tags to trigger the Aggressive Metadata Override, creating False Negatives.

---

## 📚 Further Documentation
For an in-depth understanding of the architecture, research, and technical decisions, please refer to our full documentation suite located in the docs/ directory:
*   [Project Overview](docs/_Project_Overview.md)
*   [System Architecture](docs/_System_Architecture.md)
*   [Core Methodology](docs/_Core_Methodology.md)
*   [Model Training & Evaluation](docs/_Model_Training.md)
*   [Explainability (Grad-CAM)](docs/_Explainability.md)
*   [Limitations & Future Work](docs/_Limitations.md)
re, and spectral analysis when provenance is inconclusive.


---

## 8. Originality & Third-Party References
**Originality Declaration:**
All substantive code, pipeline design, and integration logic in this repository were developed originally by the team during the hackathon timeframe.

**Third-Party Code & Libraries:**
*   **Deep Learning Backbone:** MobileNetV2 (Pre-trained weights from PyTorch/TensorFlow).
*   **Computer Vision Libraries:** OpenCV, scikit-image for spectral analysis (FFT, GLCM).
*   **Frontend/Backend:** React, Vite, FastAPI.
*   **No public real-vs-fake notebooks were copied wholesale.** Any referenced tutorials or snippets are standard library usage implementations.
