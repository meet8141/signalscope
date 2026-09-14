# Metadata & Cryptographic Provenance

The first line of defense in the SignalScope pipeline is the non-destructive analysis of the image's embedded data structures. This layer attempts to verify the origin and history of the media before executing heavy pixel-level computations.

## 1. C2PA Cryptographic Provenance
> [!IMPORTANT]
> The Coalition for Content Provenance and Authenticity (C2PA) standard is the gold standard for verifying digital media origins.

SignalScope utilizes the `c2pa-python` library to parse and authenticate C2PA manifests embedded within the image.
- **Validation:** Extracts cryptographic hashes and verifies the digital signature of the hardware or software that generated the file.
- **Impact:** If a valid C2PA manifest is present and authenticated, it acts as an absolute source of truth. In our gated logic, valid C2PA provenance immediately secures a high trust score, preempting potential false positives from the CNN layer.

## 2. EXIF & Header Analysis
Standard metadata can be easily stripped or spoofed, but when analyzed collectively, it provides a strong signal of authenticity. 

Using `Pillow (PIL)` and `piexif`, SignalScope extracts and audits:
- **Device Signatures:** Hardware identifiers (e.g., `Make`, `Model`, `LensModel`).
- **Capture Parameters:** Raw metrics such as `FNumber`, `ExposureTime`, `ISOSpeedRatings`, and focal lengths. Authentic hardware metrics follow physical optics constraints that are rarely perfectly spoofed by synthetic generators.
- **Software Traces:** Auditing the `Software` tags for traces of known editing software (Photoshop) vs. synthetic origins.
- **GPS Data:** Extracting geolocation tags, validating coordinate coherence.

### Aggressive Metadata Overrides
To mitigate the risk of high-resolution real images being misclassified as AI due to CNN resizing artifacts, SignalScope implements an **Aggressive Metadata Override**. 

If the pipeline detects a high volume of pristine, consistent hardware EXIF data (and the image passes baseline noise forensics), the Trust Score dynamically shifts to heavily prioritize the metadata (up to 70% weight), aggressively suppressing the CNN's likelihood of a false positive.
