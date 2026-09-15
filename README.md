# 🔍 SignalScope: Real vs. AI-Generated Image Detection Pipeline

> **🎯 About:** A high-accuracy, multi-layered forensic pipeline designed to detect AI-generated images using deep learning (MobileNetV2), metadata analysis, and pixel-level forensics.

**🌐 Live Demo:** [https://signalscope-1.onrender.com/](https://signalscope-1.onrender.com/)

---

## 🎥 Video Demonstration

<!-- Note: You can replace the path/to/your/video.mp4 below with the actual relative path in the repo, or an external URL to the raw video file. -->
<div align="center">
  <video width="600" controls autoplay muted loop playsinline>
    <source src="SIH_Final.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <br/>
  <p><em>Watch the complete pipeline in action, demonstrating both real and AI-generated image analysis.</em></p>
</div>

---

## 📚 Comprehensive Documentation Suite

For an in-depth understanding of the architecture, research, and technical decisions behind SignalScope, please refer to our full documentation suite located in the `docs/` directory:

### 🏛️ Architecture & Overview
*   **[Project Overview](docs/_Project_Overview.md)**: High-level summary of the pipeline, gated ingestion logic, and mission.
*   **[Problem Statement](docs/_Problem_Statement.md)**: The necessity for multi-layered defenses against modern generative AI and the flaws of single-layer detection.
*   **[System Architecture](docs/_System_Architecture.md)**: Detailed breakdown of the React frontend, FastAPI backend, and isolated ML modules.
*   **[Core Methodology](docs/_Core_Methodology.md)**: The five foundational parallel analysis layers.

### 🛡️ Verification Layers
*   **[Metadata & Provenance](docs/_Metadata_Provenance.md)**: C2PA cryptographic authentication, EXIF hardware profiling, and Aggressive Metadata Overrides.
*   **[Forensic Analysis](docs/_Forensic_Analysis.md)**: Deep dive into the spectral algorithms: FFT, Noise Profiling, Error Level Analysis (ELA), GLCM Textures, and CFA artifacts.

### 🧠 Machine Learning & Results
*   **[Dataset Assembly](docs/_Dataset.md)**: Sourcing, validation, and preprocessing of the robust 141,642 image dataset.
*   **[Model Training](docs/_Model_Training.md)**: The MobileNetV2 classification head, transfer learning strategies, and smart Keras callbacks.
*   **[Model Evaluation](docs/_Evaluation.md)**: Final empirical metrics (0.9690 ROC-AUC), operating thresholds, confusion matrix breakdowns, and visual galleries.
*   **[Explainability (Grad-CAM)](docs/_Explainability.md)**: Visual diagnostics highlighting synthetic artifacts via feature map gradients.

### 🔬 Analysis & Roadmap
*   **[Failure Analysis](docs/_Failure_Analysis.md)**: Mitigation strategies for high-resolution edge cases that trigger interpolation artifacts.
*   **[Limitations](docs/_Limitations.md)**: System constraints regarding aggressive social media compression and spoofing attacks.
*   **[Future Work](docs/_Future_Work.md)**: Our development roadmap, including Patch-Based Inference, Vision Transformers (ViT), and video forensics.

### ⚙️ Quick Start & References
*   **[Setup Guide](docs/_Setup_Guide.md)**: Quick start guide to run both the FastAPI backend and React frontend.
*   **[Important Libraries](docs/_Important_Libraries.md)**: Register of the technical stack and core library functions used.

---

## 🚀 Expected Contributions & Conclusion

This framework is designed to remain resilient against:
- **Compression degradation** (common on social platforms)
- **Tag spoofing / header manipulation**
- **Model evasion attacks**

By using gated ingestion logic, the system avoids unnecessary compute on decisively marked content while improving robustness via combined structural, texture, and spectral analysis when provenance is inconclusive.
