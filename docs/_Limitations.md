# Limitations & Constraints

While SignalScope's hybrid architecture is highly resilient, there are systemic limitations inherent to both the deep learning and forensic methodologies.

## 1. Social Media Compression
The most significant threat to the pipeline is severe lossy compression. When an image is shared via WhatsApp, Instagram, or Twitter:
- **Metadata Stripping:** All EXIF data, GPS coordinates, and C2PA manifests are aggressively stripped by the platform's backend servers to save space and protect privacy. This immediately neutralizes the first two layers of our defense (Metadata and C2PA provenance).
- **Pixel Degradation:** Heavy JPEG compression smooths out high-frequency data, effectively destroying the subtle pixel-level noise artifacts, Double-JPEG traces, and CFA correlations that the Forensic layer relies on. 

In these scenarios, the system is forced to rely entirely on the MobileNetV2 CNN, bypassing the safety of the gated override logic.

## 2. Model Geometry Constraints
As detailed in the Failure Analysis, the fixed `224x224` input requirement of the CNN backbone induces interpolation artifacts on high-resolution images. While the Aggressive Metadata Override mitigates this for original photos, if a high-resolution photo is stripped of its metadata (e.g., via a screenshot or social media upload), the CNN's false-positive will dictate the final trust score.

## 3. Sophisticated Adversarial Attacks
A highly motivated adversary could theoretically bypass the system using a chained attack:
1. Generate an image using a state-of-the-art diffusion model.
2. Inject synthetic noise mimicking a specific camera sensor's thermal noise profile.
3. Spoof the binary header to inject pristine, mathematically coherent EXIF tags (e.g., matching the ISO to the injected noise variance).
4. Strip the C2PA manifest.

While incredibly difficult to execute perfectly, this attack vector would trigger the "Aggressive Metadata Override," suppressing the CNN and forcing a False Negative (classifying the fake as real).

## 4. Processing Overhead
Running six parallel forensic algorithms (FFT, GLCM, Noise, CFA, etc.) plus a deep learning model creates a computationally heavy verification pipeline. Scaling this backend to handle thousands of concurrent requests would require significant horizontal scaling and asynchronous task queuing (e.g., Redis/Celery) to prevent severe latency spikes.
