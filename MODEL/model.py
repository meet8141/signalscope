# ============================================================
# SIGNALSCOPE - REAL vs AI IMAGE CHECK
# FINAL SINGLE-IMAGE PREDICTION
# ============================================================

import os
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# ============================================================
# 1. MODEL
# ============================================================

MODEL_PATH = r"C:\Users\akshar Patel\signalscope\MODEL\mobilenetv2_v1.keras"

print("=" * 60)
print("SIGNALSCOPE IMAGE ANALYSIS")
print("=" * 60)

print("\nLoading model...")

model = tf.keras.models.load_model(
    MODEL_PATH
)

print("Model loaded successfully!")
print("Model:", MODEL_PATH)


# ============================================================
# 2. IMAGE PATH
# ============================================================

IMAGE_PATH = r"C:\Users\akshar Patel\signalscope\Images\image1.png"


# ============================================================
# 3. CHECK IMAGE
# ============================================================

if not os.path.exists(IMAGE_PATH):
    raise FileNotFoundError(
        f"\nImage not found:\n{IMAGE_PATH}"
    )

print("\nImage found:")
print(IMAGE_PATH)


# ============================================================
# 4. LOAD ORIGINAL IMAGE
# ============================================================

original_image = Image.open(
    IMAGE_PATH
).convert("RGB")

print(
    "Original size:",
    original_image.size
)


# ============================================================
# 5. PREPARE IMAGE FOR MOBILENETV2
# ============================================================

image = original_image.resize(
    (224, 224)
)

image_array = np.array(
    image
).astype(
    np.float32
)

image_array = np.expand_dims(
    image_array,
    axis=0
)

image_array = preprocess_input(
    image_array
)


# ============================================================
# 6. RUN MODEL
# ============================================================

print("\nRunning MobileNetV2 prediction...")

prediction = model.predict(
    image_array,
    verbose=1
)

ai_probability = float(
    prediction[0][0]
)

real_probability = (
    1.0 - ai_probability
)


# ============================================================
# 7. DECISION
# ============================================================

THRESHOLD = 0.50

if ai_probability >= THRESHOLD:

    verdict = "AI-GENERATED"

    confidence = ai_probability

else:

    verdict = "REAL"

    confidence = real_probability


# ============================================================
# 8. PRINT RESULTS
# ============================================================

print("\n")
print("=" * 60)
print("SIGNALSCOPE RESULT")
print("=" * 60)

print(
    f"AI Probability   : {ai_probability * 100:.2f}%"
)

print(
    f"Real Probability : {real_probability * 100:.2f}%"
)

print(
    f"Threshold        : {THRESHOLD * 100:.2f}%"
)

print(
    f"Confidence       : {confidence * 100:.2f}%"
)

print(
    f"VERDICT          : {verdict}"
)

print("=" * 60)


# ============================================================
# 9. DISPLAY IMAGE
# ============================================================

plt.figure(
    figsize=(9, 7)
)

plt.imshow(
    original_image
)

plt.title(
    f"SIGNALScope Analysis\n"
    f"{verdict}\n"
    f"AI: {ai_probability * 100:.2f}% | "
    f"Real: {real_probability * 100:.2f}%"
)

plt.axis("off")

plt.tight_layout()

plt.show()


# ============================================================
# 10. FINAL JSON-LIKE RESULT
# ============================================================

result = {
    "image": os.path.basename(IMAGE_PATH),
    "model": MODEL_PATH,
    "ai_probability": round(
        ai_probability, 4
    ),
    "real_probability": round(
        real_probability, 4
    ),
    "threshold": THRESHOLD,
    "confidence": round(
        confidence, 4
    ),
    "verdict": verdict,
    "disclaimer":
        "This is a likelihood assessment, "
        "not a definitive authenticity claim."
}

print("\nResult:")
print(result)