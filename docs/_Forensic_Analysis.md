# Forensic Analysis

SignalScope implements a robust suite of spectral and pixel-level forensic analyses. Generative models (like GANs and diffusion models) operate fundamentally differently than the physical sensors of a camera. This discrepancy leaves mathematical fingerprints in the image domain that our forensic modules expose.

## 1. Fast Fourier Transform (FFT)
Generative models, particularly upscalers and certain GANs, inherently struggle to perfectly synthesize high-frequency details, frequently leaving periodic grid artifacts or "chessboard" patterns.
- **Method:** We compute a 2D FFT (`np.fft.fft2`) and shift the zero-frequency component to the center (`np.fft.fftshift`). 
- **Detection:** We analyze the spectral energy in high-frequency bands. Abnormal spikes or unnaturally perfect periodic structures are flagged as synthetic artifacts.

## 2. Noise & Edge Profiling
Camera sensors naturally produce shot noise and thermal noise that scale with the ISO setting.
- **Method:** Using OpenCV (`cv2.fastNlMeansDenoising`), we separate the high-frequency noise from the image structure. We then use gradients (`cv2.Laplacian`, `cv2.Sobel`) to profile edges.
- **Detection:** Generative models often produce unnatural variance (e.g., completely noise-free areas juxtaposed with sharp artifacts). We analyze the standard deviation and variance of the extracted noise block-by-block. 

## 3. Error Level Analysis (ELA)
ELA identifies areas of an image with differing compression levels.
- **Method:** The image is intentionally re-saved at a known JPEG quality rate (e.g., 90%). The absolute difference between the original and the re-compressed image highlights error levels.
- **Detection:** In an authentic, unedited photograph, the entire image should display a relatively uniform error level. Sharp spikes in specific local regions indicate localized manipulation or synthetic splicing.

## 4. Texture Matrix Analytics (GLCM)
AI-generated images often suffer from "over-smoothing" or airbrushed textures, lacking the micro-contrast found in reality.
- **Method:** Using `scikit-image`, we calculate the Gray-Level Co-occurrence Matrix (`feature.graycomatrix`) across color channels.
- **Detection:** We extract properties (`feature.graycoprops`) such as contrast, homogeneity, and energy to detect synthetic texture patterns that deviate from natural distributions.

## 5. Double JPEG Compression & CFA Artifacts
- **Double JPEG:** Generative images saved multiple times leave mismatched quantization matrices in the DCT blocks, which we evaluate for compression anomalies.
- **Color Filter Array (CFA):** Digital cameras use Bayer filters requiring demosaicing. Generative models bypass this entirely, lacking natural CFA correlation patterns. We extract and analyze local correlation statistics to flag missing demosaicing artifacts.
