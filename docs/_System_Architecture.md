# System Architecture

SignalScope is divided into a decoupled architecture, comprising a fast, responsive frontend application and a heavily asynchronous, computation-focused backend.

## 1. Frontend Architecture
The client-side application is engineered as a Single Page Application (SPA) designed to deliver a premium user experience with dynamic forensic visualizations.

- **Framework:** React 18 powered by Vite for rapid HMR and optimized build delivery.
- **Styling:** Tailwind CSS, utilizing custom design tokens to enforce a sleek, modern dark mode aesthetic.
- **Visualizations:** Recharts is used to dynamically plot forensic frequency graphs, metadata distributions, and model confidence metrics.
- **Structure:**
  - `src/components/`: Reusable, modular UI elements (e.g., upload zones, confidence dials, heatmap overlays).
  - `src/pages/`: Main views including the Landing Page and the interactive Scanner Dashboard.

## 2. Backend & API Architecture
The backend serves as the orchestration layer for the multi-tiered forensic pipeline.

- **Framework:** FastAPI running asynchronously via Uvicorn.
- **Routing & Endpoints:** Defined in `backend/main.py`, exposing distinct verification modules:
  - `/api/verify/c2pa/`
  - `/api/verify/metadata/`
  - `/api/verify/forensic/`
  - `/api/verify/model/`
  - `/api/verify/` (Combined execution pipeline)

## 3. The ML & Forensics Pipeline
The core intelligence of SignalScope resides in isolated Python modules imported by the FastAPI router.

> [!TIP]
> **Gated Ingestion Logic**  
> The system operates using a weighted trust score. By separating the logic into discrete modules, the architecture can aggressively override or shift weights depending on the strength of the cryptographic or metadata signals.

- **Models Directory (`MODEL/`):** Contains the fine-tuned MobileNetV2 `.keras` weights and the central `model.py` prediction script, which handles inference and Grad-CAM generation via TensorFlow.
- **Forensics Directory (`FORENSIC/`):** Houses isolated scripts for specific spectral and pixel analyses (e.g., `fft.py`, `noise.py`, `texture.py`, `cfa_artifacts.py`).
- **Metadata Directories (`C2PA/`, `METADATA/`):** Dedicated pipelines for parsing binary headers using `Pillow`/`piexif` and extracting cryptographic manifests using `c2pa-python`.
