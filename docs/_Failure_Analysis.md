# Failure Analysis & Edge Cases

No detection model is flawless. During the deployment and testing of SignalScope, we encountered specific edge cases that required architectural intervention.

## The High-Resolution False Positive Problem
A critical failure mode was discovered when testing authentic, high-resolution photographs from modern smartphones (e.g., an OPPO A53 image sized `924x2048`).

### The Root Cause
The MobileNetV2 deep learning classifier is strictly constrained to a `224x224` input geometry. When a `924x2048` image is forcefully downscaled to `224x224`, the interpolation process destroys the original pixel integrity. It introduces jagged edges, crushes natural sensor noise, and creates synthetic-looking blurring. 

To the CNN, these resizing artifacts look identical to the traces left behind by latent diffusion models, resulting in a **1.0 (100%) AI Probability** false positive.

## The Mitigation: Aggressive Metadata Overrides
Because the CNN operates at an 85% static weight in the Trust Score calculation, a 1.0 AI Probability would utterly crush the authenticity score of a real image, dropping it to a failing grade (e.g., 5/100).

To prevent this systemic failure, we implemented an **Aggressive Metadata Override** within the Gated Ingestion Logic:

1. **Detection:** The backend checks the output of the metadata module. If the image possesses an extensive, pristine set of hardware EXIF tags (e.g., specific `FNumber`, `ExposureTime`, `LensModel`, `ISOSpeedRatings`).
2. **Forensic Gate:** The image is verified against the algorithmic noise analysis to ensure the metadata wasn't simply injected into a highly manipulated file.
3. **The Override:** If both conditions pass, the image is deemed highly likely to be an authentic photograph. The CNN's weight is aggressively suppressed from **85% to 10%**, and the Metadata weight is boosted to **70%**.

### Results
By dynamically shifting the weights based on non-destructive evidence, the system successfully overrides the CNN's resizing-induced false positive, raising the final Trust Score from a failing `5/100` to a passing `80/100`.
