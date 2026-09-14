# Core Methodology (Four Parallel Layers)

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
