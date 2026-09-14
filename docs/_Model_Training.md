# Deep Learning Model Training

The CNN detection layer acts as the primary visual discriminator for SignalScope. It evaluates complex spatial features, textural inconsistencies, and low-level artifacts that are difficult to isolate using traditional algorithmic forensics.

## Architecture Selection: MobileNetV2
We selected **MobileNetV2** as the foundational backbone architecture. While heavier architectures (like ResNet152 or Vision Transformers) offer slight accuracy boosts, MobileNetV2 was chosen for its aggressive optimization and low latency, making it ideal for a real-time web verification pipeline.
- **Inverted Residuals & Linear Bottlenecks:** This design preserves subtle, low-level edge artifacts and non-linearities crucial for deepfake detection.
- **Depthwise Separable Convolutions:** Massively reduces the parameter count and computational complexity while retaining spatial awareness.

## Head Construction & Transfer Learning
To leverage existing feature extractors, the backbone was initialized with pre-trained ImageNet weights (`weights="imagenet"`), and the base layers were explicitly frozen (`trainable = False`) to prevent destructive gradient updates during early epochs.

A custom classification head was appended:
1. `GlobalAveragePooling2D()`: Flattens the final spatial dimensions.
2. `Dense(128, activation="relu")`: A high-capacity feature transformation layer.
3. `Dropout(0.3)`: Aggressive regularization to prevent overfitting on the training set.
4. `Dense(1, activation="sigmoid")`: The binary classification output (0 = Fake, 1 = Real).

> [!NOTE]
> **Parameter Count**  
> **Total:** 2,422,081 | **Trainable:** 164,097 | **Frozen:** 2,257,984

## Compilation & Training Strategy
- **Optimizer:** The Adam optimizer was used with an initial learning rate of `0.001`.
- **Loss Function:** Binary Crossentropy (`binary_crossentropy`).
- **Input Geometry:** Images were ingested at `224x224x3`.
- **Batching:** `32` images per step.
- **Epochs:** Hard limit of `10`, governed by aggressive callbacks.
- **Data Augmentation:** Training feed incorporates slight tilts/flips to prevent pure memorization, while test feeders evaluate raw frames.

### Smart Callbacks
Training efficiency and model stability were ensured via three primary Keras callbacks:
1. **EarlyStopping:** Monitored `val_loss` with a patience of 3 epochs, restoring the best weights to halt training precisely before overfitting commenced.
2. **ReduceLROnPlateau:** Dynamically reduced the learning rate by a factor of `0.2` if the validation loss stagnated for 2 epochs.
3. **ModelCheckpoint:** Continuously saved the optimal state to `real_vs_fake_mobilenetv2_best.keras` based on the maximum `val_auc` metric.
