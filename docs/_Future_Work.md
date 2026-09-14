# Future Work & Roadmap

To address current limitations and expand the capabilities of SignalScope, several major architectural upgrades are planned for future development iterations.

## 1. Patch-Based Model Inference
To fundamentally solve the high-resolution false positive issue without relying on metadata overrides, we plan to implement a patch-based inference engine.
- Instead of downscaling a massive 4K image to `224x224` (crushing the pixel integrity), the backend will extract 5 to 10 random `224x224` crops from the image at its native resolution.
- The CNN will process each patch independently, and the final probability will be a statistical aggregate (mean or median) of the crop predictions. This preserves natural sensor noise and totally eliminates resizing artifacts.

## 2. Vision Transformer (ViT) Integration
While MobileNetV2 is incredibly efficient, Vision Transformers excel at capturing long-range dependencies and global context within an image. Future versions of the pipeline will test an ensemble approach, pairing the CNN's local feature extraction with a ViT's global spatial awareness.

## 3. C2PA Trust List Expansion
Currently, the presence of a valid C2PA manifest acts as a strong indicator of authenticity. However, AI generators (like Midjourney) are beginning to attach C2PA manifests declaring the media as synthetic. 
- The backend will be upgraded to not only verify the cryptographic signature but to deeply parse the manifest's *assertions*. 
- If the manifest asserts an AI origin, the Trust Score will immediately gate to `0`. If it asserts a hardware camera origin, it will gate to `100`.

## 4. Video Forensics
The logical next step for SignalScope is transitioning from spatial (image) forensics to temporal (video) forensics. This will involve analyzing inter-frame consistency, optical flow anomalies, and temporal noise distribution to detect deepfake videos and AI-generated frame generation (e.g., Sora).
