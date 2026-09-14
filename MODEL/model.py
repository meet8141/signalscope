# ============================================================
# SIGNALSCOPE - REAL vs AI IMAGE CHECK
# SINGLE IMAGE PREDICTION + ROBUST GRAD-CAM
# ============================================================

import os
import traceback
import numpy as np
import tensorflow as tf
import warnings

# Suppress harmless Keras 3 input structure warnings for single-input models
warnings.filterwarnings("ignore", message=".*The structure of `inputs` doesn't match the expected structure.*")


from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# ============================================================
# 1. CONFIGURATION
# ============================================================

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

# Try multiple model file candidates in priority order
_MODEL_CANDIDATES = [
    os.path.join(MODEL_DIR, "mobilenetv2_final.keras"),
    os.path.join(MODEL_DIR, "mobilenetv2_v1.keras"),
]

MODEL_PATH = None
for _candidate in _MODEL_CANDIDATES:
    if os.path.exists(_candidate):
        MODEL_PATH = _candidate
        break

if MODEL_PATH is None:
    raise FileNotFoundError(
        f"\nNo model file found in: {MODEL_DIR}\n"
        f"Looked for: {_MODEL_CANDIDATES}"
    )

THRESHOLD = 0.50


# ============================================================
# 2. LOAD MODEL (SINGLETON - LOADED ONCE AT IMPORT)
# ============================================================

print("=" * 60)
print("SIGNALSCOPE - Loading AI Detection Model")
print("=" * 60)

print(f"\nModel file: {MODEL_PATH}")
print("Loading model...")

_model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False
)

print("Model loaded successfully!")


# ============================================================
# 3. FIND TARGET GRAD-CAM LAYER (ONCE AT IMPORT)
# ============================================================

def _find_target_layer(model):
    """
    Finds the last valid 4D convolutional layer
    for Grad-CAM visualization.
    """

    conv_layers = []

    for layer in model.layers:

        class_name = layer.__class__.__name__.lower()
        layer_name = layer.name.lower()

        if (
            "conv2d" in class_name
            or "depthwiseconv2d" in class_name
            or "conv" in layer_name
        ):

            conv_layers.append(layer)

    if len(conv_layers) == 0:
        return None

    # Select last valid 4D convolutional layer
    for layer in reversed(conv_layers):

        try:

            output_shape = layer.output.shape

            if len(output_shape) == 4:
                return layer

        except Exception:
            continue

    return None


_target_layer = _find_target_layer(_model)

if _target_layer is not None:
    print(
        f"Grad-CAM target layer: {_target_layer.name}"
    )
else:
    print(
        "WARNING: No suitable convolutional layer "
        "found for Grad-CAM."
    )

print("=" * 60)
print("Model ready for predictions.\n")


# ============================================================
# 4. GRAD-CAM GENERATION
# ============================================================

def _generate_gradcam(image_tensor, model, target_layer):
    """
    Generates a Grad-CAM heatmap for the given image tensor.

    Returns a numpy heatmap array (H x W), values 0.0 to 1.0.
    """

    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[
            target_layer.output,
            model.output
        ]
    )

    with tf.GradientTape() as tape:

        conv_outputs, predictions = grad_model(
            image_tensor,
            training=False
        )

        # Binary classifier
        if predictions.shape[-1] == 1:
            loss = predictions[:, 0]
        else:
            class_index = tf.argmax(
                predictions[0]
            )
            loss = predictions[:, class_index]

    # Calculate gradients
    gradients = tape.gradient(
        loss,
        conv_outputs
    )

    if gradients is None:
        raise RuntimeError(
            "Gradients are None. "
            "The selected layer is not connected "
            "to the model output."
        )

    # Global average pooling
    pooled_gradients = tf.reduce_mean(
        gradients,
        axis=(0, 1, 2)
    )

    # Remove batch dimension
    conv_outputs = conv_outputs[0]

    # Weighted activation maps
    heatmap = tf.reduce_sum(
        conv_outputs * pooled_gradients,
        axis=-1
    )

    # ReLU
    heatmap = tf.maximum(heatmap, 0)

    # Normalize
    max_heatmap = tf.reduce_max(heatmap)

    if float(max_heatmap) > 1e-8:
        heatmap = heatmap / max_heatmap
    else:
        heatmap = tf.zeros_like(heatmap)

    return heatmap.numpy()


# ============================================================
# 5. SAVE HEATMAP OVERLAY TO FILE
# ============================================================

def _save_heatmap_overlay(
    original_image, heatmap, save_path, alpha=0.40
):
    """
    Overlays a Grad-CAM heatmap on the original image
    and saves it to the given file path.

    Returns True if saved successfully, False otherwise.
    """

    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
    except ImportError:
        return False

    # Resize heatmap to original image size
    heatmap_uint8 = (heatmap * 255).astype(np.uint8)

    heatmap_image = Image.fromarray(heatmap_uint8)

    heatmap_image = heatmap_image.resize(
        original_image.size,
        Image.Resampling.BILINEAR
    )

    heatmap_uint8 = np.asarray(heatmap_image)

    # Apply JET color map
    try:
        jet = plt.colormaps["jet"]
    except AttributeError:
        jet = plt.get_cmap("jet")

    colored_heatmap = jet(
        heatmap_uint8 / 255.0
    )[:, :, :3]

    colored_heatmap = (
        colored_heatmap * 255
    ).astype(np.uint8)

    # Blend overlay
    original_array = np.asarray(
        original_image, dtype=np.float32
    )

    overlay_array = (
        original_array * (1.0 - alpha)
        + colored_heatmap.astype(np.float32) * alpha
    )

    overlay_array = np.clip(
        overlay_array, 0, 255
    ).astype(np.uint8)

    overlay_image = Image.fromarray(overlay_array)

    # Save to file
    os.makedirs(
        os.path.dirname(save_path),
        exist_ok=True
    )

    overlay_image.save(save_path, format="PNG")

    return True


# ============================================================
# 6. PREDICT IMAGE (PUBLIC API)
# ============================================================

def predict_image(
    image_path: str,
    heatmap_save_path: str = None
) -> dict:
    """
    Runs the MobileNetV2 AI-detection model on a single image.

    Parameters
    ----------
    image_path : str
        Absolute path to the image file.

    heatmap_save_path : str, optional
        If provided, the Grad-CAM heatmap overlay
        will be saved to this path as a PNG file.

    Returns
    -------
    dict
        {
            "ai_probability": float,
            "real_probability": float,
            "threshold": float,
            "confidence": float,
            "verdict": "AI-GENERATED" | "REAL",
            "gradcam_available": bool,
            "gradcam_layer": str | None,
            "heatmap_saved_path": str | None,
            "disclaimer": str
        }
    """

    # ----------------------------------------------------------
    # Validate image path
    # ----------------------------------------------------------

    if not os.path.exists(image_path):
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    # ----------------------------------------------------------
    # Load and preprocess image
    # ----------------------------------------------------------

    original_image = Image.open(
        image_path
    ).convert("RGB")

    image = original_image.resize((224, 224))

    image_array = np.asarray(
        image, dtype=np.float32
    )

    image_array = np.expand_dims(
        image_array, axis=0
    )

    image_array = preprocess_input(image_array)

    # ----------------------------------------------------------
    # Run prediction
    # ----------------------------------------------------------

    prediction = _model.predict(
        image_array, verbose=0
    )

    prediction = np.asarray(prediction)

    prediction_value = float(
        prediction.reshape(-1)[0]
    )

    # ----------------------------------------------------------
    # Calculate probabilities
    # ----------------------------------------------------------

    ai_probability = prediction_value
    real_probability = 1.0 - ai_probability

    # ----------------------------------------------------------
    # Decision
    # ----------------------------------------------------------

    if ai_probability >= 0.8:
        verdict = "Highly Likely AI gen"
        confidence = ai_probability
    elif ai_probability >= THRESHOLD:
        verdict = "Likely AI gen"
        confidence = ai_probability
    elif real_probability >= 0.8:
        verdict = "Highly Likely REAL"
        confidence = real_probability
    else:
        verdict = "Likely REAL"
        confidence = real_probability

    # ----------------------------------------------------------
    # Grad-CAM (save to file if path provided)
    # ----------------------------------------------------------

    gradcam_available = False
    heatmap_saved = None
    gradcam_layer_name = None

    if _target_layer is not None and heatmap_save_path:

        try:

            heatmap = _generate_gradcam(
                image_array, _model, _target_layer
            )

            saved = _save_heatmap_overlay(
                original_image,
                heatmap,
                heatmap_save_path
            )

            if saved:
                gradcam_available = True
                heatmap_saved = heatmap_save_path

            gradcam_layer_name = _target_layer.name

        except Exception:

            traceback.print_exc()

    elif _target_layer is not None:

        gradcam_layer_name = _target_layer.name

    # ----------------------------------------------------------
    # Return result
    # ----------------------------------------------------------

    return {

        "ai_probability":
            round(ai_probability, 4),

        "real_probability":
            round(real_probability, 4),

        "threshold":
            THRESHOLD,

        "confidence":
            round(confidence, 4),

        "verdict":
            verdict,

        "gradcam_available":
            gradcam_available,

        "gradcam_layer":
            gradcam_layer_name,

        "heatmap_saved_path":
            heatmap_saved,

        "disclaimer":
            "This is a likelihood assessment, "
            "not a definitive authenticity claim."
    }