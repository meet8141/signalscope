# ============================================================
# SIGNALSCOPE - REAL vs AI IMAGE CHECK
# SINGLE IMAGE PREDICTION + ROBUST GRAD-CAM
# ============================================================

import os
import traceback
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# ============================================================
# 1. CONFIGURATION
# ============================================================

MODEL_PATH = r"C:\Users\akshar Patel\signalscope\MODEL\mobilenetv2_v1.keras"

IMAGE_PATH = r"C:\Users\akshar Patel\Downloads\4.jpg"

THRESHOLD = 0.50


# ============================================================
# 2. HEADER
# ============================================================

print("=" * 60)
print("SIGNALSCOPE IMAGE ANALYSIS")
print("=" * 60)


# ============================================================
# 3. LOAD MODEL
# ============================================================

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"\nModel not found:\n{MODEL_PATH}"
    )

print("\nLoading model...")

model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False
)

print("Model loaded successfully!")
print("Model:", MODEL_PATH)


# ============================================================
# 4. MODEL INFORMATION
# ============================================================

print("\nModel input:")
print(model.input)

print("\nModel output:")
print(model.output)


# ============================================================
# 5. FIND CONVOLUTIONAL LAYERS
# ============================================================

print("\nSearching convolutional layers...")

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


print(
    f"Found {len(conv_layers)} convolution-related layers."
)


if len(conv_layers) == 0:

    raise ValueError(
        "No convolutional layers found in the model."
    )


print("\nLast convolutional layers:")

for layer in conv_layers[-10:]:

    print(
        f"{layer.name:40s} "
        f"{layer.__class__.__name__}"
    )


# ============================================================
# 6. SELECT LAST VALID 4D CONVOLUTIONAL LAYER
# ============================================================

target_layer = None

for layer in reversed(conv_layers):

    try:

        output_shape = layer.output.shape

        if len(output_shape) == 4:

            target_layer = layer

            break

    except Exception:

        continue


if target_layer is None:

    raise ValueError(
        "Could not find a suitable 4D convolutional layer."
    )


print(
    "\nSelected Grad-CAM layer:",
    target_layer.name
)

print(
    "Layer output shape:",
    target_layer.output.shape
)


# ============================================================
# 7. CHECK IMAGE
# ============================================================

if not os.path.exists(IMAGE_PATH):

    raise FileNotFoundError(
        f"\nImage not found:\n{IMAGE_PATH}"
    )

print("\nImage found:")
print(IMAGE_PATH)


# ============================================================
# 8. LOAD ORIGINAL IMAGE
# ============================================================

original_image = Image.open(
    IMAGE_PATH
).convert("RGB")

print(
    "Original size:",
    original_image.size
)


# ============================================================
# 9. PREPARE IMAGE
# ============================================================

image = original_image.resize(
    (224, 224)
)

image_array = np.asarray(
    image,
    dtype=np.float32
)

image_array = np.expand_dims(
    image_array,
    axis=0
)

image_array = preprocess_input(
    image_array
)


# ============================================================
# 10. PREDICTION
# ============================================================

print(
    "\nRunning MobileNetV2 prediction..."
)

prediction = model.predict(
    image_array,
    verbose=1
)

prediction = np.asarray(
    prediction
)

prediction_value = float(
    prediction.reshape(-1)[0]
)


# ============================================================
# 11. REAL / AI PROBABILITY
# ============================================================

ai_probability = prediction_value

real_probability = (
    1.0 - ai_probability
)


# ============================================================
# 12. DECISION
# ============================================================

if ai_probability >= THRESHOLD:

    verdict = "AI-GENERATED"

    confidence = ai_probability

else:

    verdict = "REAL"

    confidence = real_probability


# ============================================================
# 13. GRAD-CAM FUNCTION
# ============================================================

def generate_gradcam(
    image_tensor,
    full_model,
    target_layer
):

    print(
        "\nCreating Grad-CAM model..."
    )

    # --------------------------------------------------------
    # IMPORTANT
    #
    # Use the actual target layer object from the loaded model.
    # This preserves the original TensorFlow computation graph.
    # --------------------------------------------------------

    grad_model = tf.keras.models.Model(
        inputs=full_model.inputs,
        outputs=[
            target_layer.output,
            full_model.output
        ]
    )

    print(
        "Grad-CAM model created."
    )

    # --------------------------------------------------------
    # Forward pass
    # --------------------------------------------------------

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


    # --------------------------------------------------------
    # Calculate gradients
    # --------------------------------------------------------

    gradients = tape.gradient(
        loss,
        conv_outputs
    )


    if gradients is None:

        raise RuntimeError(
            "\nGradients are None.\n"
            "The selected layer is not connected "
            "to the model output."
        )


    print(
        "Gradient calculation successful."
    )


    # --------------------------------------------------------
    # Global average pooling
    # --------------------------------------------------------

    pooled_gradients = tf.reduce_mean(
        gradients,
        axis=(0, 1, 2)
    )


    # --------------------------------------------------------
    # Remove batch dimension
    # --------------------------------------------------------

    conv_outputs = conv_outputs[0]


    # --------------------------------------------------------
    # Weighted activation maps
    # --------------------------------------------------------

    heatmap = tf.reduce_sum(
        conv_outputs *
        pooled_gradients,
        axis=-1
    )


    # --------------------------------------------------------
    # ReLU
    # --------------------------------------------------------

    heatmap = tf.maximum(
        heatmap,
        0
    )


    # --------------------------------------------------------
    # Normalize
    # --------------------------------------------------------

    max_heatmap = tf.reduce_max(
        heatmap
    )


    if float(max_heatmap) > 1e-8:

        heatmap = (
            heatmap /
            max_heatmap
        )

    else:

        print(
            "WARNING: Heatmap activation is zero."
        )

        heatmap = tf.zeros_like(
            heatmap
        )


    return heatmap.numpy()


# ============================================================
# 14. GENERATE GRAD-CAM
# ============================================================

heatmap_success = False

heatmap_display = None


try:

    print(
        "\nGenerating Grad-CAM..."
    )

    heatmap = generate_gradcam(
        image_array,
        model,
        target_layer
    )

    print(
        "Raw heatmap shape:",
        heatmap.shape
    )


    # ========================================================
    # RESIZE HEATMAP
    # ========================================================

    heatmap_uint8 = (
        heatmap * 255
    ).astype(np.uint8)


    heatmap_image = Image.fromarray(
        heatmap_uint8
    )


    heatmap_image = heatmap_image.resize(
        original_image.size,
        Image.Resampling.BILINEAR
    )


    heatmap_uint8 = np.asarray(
        heatmap_image
    )


    # ========================================================
    # APPLY JET COLOR MAP
    # ========================================================

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


    # ========================================================
    # ORIGINAL IMAGE ARRAY
    # ========================================================

    original_array = np.asarray(
        original_image,
        dtype=np.float32
    )


    # ========================================================
    # OVERLAY
    # ========================================================

    alpha = 0.40


    heatmap_display_array = (
        original_array * (1.0 - alpha)
        +
        colored_heatmap.astype(
            np.float32
        ) * alpha
    )


    heatmap_display_array = np.clip(
        heatmap_display_array,
        0,
        255
    ).astype(np.uint8)


    heatmap_display = Image.fromarray(
        heatmap_display_array
    )


    heatmap_success = True


    print(
        "\nGrad-CAM generated successfully!"
    )


except Exception:

    print("\n" + "!" * 60)

    print(
        "FAILED TO GENERATE GRAD-CAM"
    )

    print(
        "Error details:"
    )

    traceback.print_exc()

    print("!" * 60)


# ============================================================
# 15. PRINT RESULT
# ============================================================

print("\n")

print("=" * 60)
print("SIGNALSCOPE RESULT")
print("=" * 60)

print(
    f"AI Probability   : "
    f"{ai_probability * 100:.2f}%"
)

print(
    f"Real Probability : "
    f"{real_probability * 100:.2f}%"
)

print(
    f"Threshold        : "
    f"{THRESHOLD * 100:.2f}%"
)

print(
    f"Confidence       : "
    f"{confidence * 100:.2f}%"
)

print(
    f"VERDICT          : "
    f"{verdict}"
)

print("=" * 60)


# ============================================================
# 16. DISPLAY ORIGINAL + GRAD-CAM
# ============================================================

if heatmap_success:

    fig, axes = plt.subplots(
        1,
        2,
        figsize=(14, 7)
    )


    # --------------------------------------------------------
    # ORIGINAL
    # --------------------------------------------------------

    axes[0].imshow(
        original_image
    )

    axes[0].set_title(
        "SIGNALSCOPE ANALYSIS\n"
        f"{verdict}\n"
        f"AI: {ai_probability * 100:.2f}% | "
        f"Real: {real_probability * 100:.2f}%"
    )

    axes[0].axis("off")


    # --------------------------------------------------------
    # GRAD-CAM
    # --------------------------------------------------------

    axes[1].imshow(
        heatmap_display
    )

    axes[1].set_title(
        "GRAD-CAM HEATMAP\n"
        "Regions influencing prediction"
    )

    axes[1].axis("off")


else:

    plt.figure(
        figsize=(9, 7)
    )

    plt.imshow(
        original_image
    )

    plt.title(
        "SIGNALSCOPE ANALYSIS\n"
        f"{verdict}\n"
        f"AI: {ai_probability * 100:.2f}% | "
        f"Real: {real_probability * 100:.2f}%\n"
        "Grad-CAM unavailable"
    )

    plt.axis("off")


plt.tight_layout()

plt.show()


# ============================================================
# 17. FINAL JSON RESULT
# ============================================================

result = {

    "image":
        os.path.basename(
            IMAGE_PATH
        ),

    "model":
        MODEL_PATH,

    "ai_probability":
        round(
            ai_probability,
            4
        ),

    "real_probability":
        round(
            real_probability,
            4
        ),

    "threshold":
        THRESHOLD,

    "confidence":
        round(
            confidence,
            4
        ),

    "verdict":
        verdict,

    "gradcam":
        heatmap_success,

    "gradcam_layer":
        target_layer.name,

    "disclaimer":
        "This is a likelihood assessment, "
        "not a definitive authenticity claim."
}


print("\nResult:")

print(result)

print(
    "\nAnalysis completed."
)