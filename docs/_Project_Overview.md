# Project Overview

> [!NOTE]
> **SignalScope** is a high-accuracy, multi-layered hybrid forensic pipeline designed to detect AI-generated images using deep learning, metadata analysis, and pixel-level forensics.

## The Core Mission
As generative AI continues to evolve, the line between authentic photographs and synthetic imagery becomes increasingly blurred. SignalScope's primary mission is to establish a rigorous, multi-layered defense mechanism that verifies digital authenticity. By acting as a comprehensive forensic suite, SignalScope empowers users to definitively distinguish between real and AI-generated media.

## Hybrid Verification Approach
SignalScope operates under a **Gated Ingestion Logic** framework. Rather than relying on a single point of failure (such as a standalone deep learning model that can be easily bypassed by adversarial attacks), SignalScope enforces parallel analysis across distinct domains:
1. **Cryptographic Provenance:** Validating C2PA credentials.
2. **Metadata Integrity:** Auditing EXIF data and software signatures.
3. **Spectral & Pixel Forensics:** Uncovering grid artifacts, unusual noise patterns, and anomalous textures.
4. **Deep Learning Inference:** Leveraging a fine-tuned MobileNetV2 architecture for high-efficiency image classification.

## Tech Stack Highlights
SignalScope is built for performance and scalability, featuring a modern technology stack:
- **Frontend Experience:** A responsive, highly interactive SPA built with **React 18**, **Vite**, and styled with **Tailwind CSS**. It features dynamic visualizations powered by **Recharts** and a premium dark mode UI.
- **Backend & API:** A high-performance, asynchronous backend driven by **FastAPI** and **Uvicorn**, running on **Python 3.10+**.
- **ML & Forensics:** Core logic is implemented using **TensorFlow/Keras** for deep learning, **OpenCV** and **scikit-image** for computer vision and texture analysis, and **Pillow/piexif/c2pa-python** for metadata and cryptographic extraction.
