# Explainability & Visual Diagnostics

Deep neural networks are often criticized as "black boxes." In forensic analysis, simply returning a probability score is insufficient; the user must understand *why* the model made its decision. SignalScope achieves this through **Gradient-weighted Class Activation Mapping (Grad-CAM)**.

## How Grad-CAM Works in SignalScope
Grad-CAM uses the gradients of the classification target flowing into the final convolutional layer to produce a coarse localization map highlighting the regions in the image most critical to the prediction.

1. **Layer Extraction:** The script dynamically identifies the final 4D convolutional block in the MobileNetV2 architecture (typically `Conv_1_bn` or `out_relu`).
2. **Gradient Calculation:** We instantiate a `GradientTape` to compute the gradients of the predicted class score with respect to the output feature maps of the target layer.
3. **Global Average Pooling:** The gradients are pooled across spatial dimensions to obtain "importance weights" for each feature map.
4. **Heatmap Generation:** A weighted sum of the feature maps is computed, passed through a ReLU activation to focus only on positive influences, and normalized.

## Visual Overlay
The resulting heatmap is mapped to a JET colormap and blended over the original image at a defined opacity (`alpha=0.40`). 

### Interpreting the Results
- **Synthetic Identifiers:** When evaluating an AI-generated image, the heatmap frequently highlights specific artifacts that humans might miss. This includes unnatural hair blending boundaries, non-euclidean background geometry, or synthetic skin texture repetition.
- **Authentic Regions:** In a real image, the model tends to focus on natural edges, sensor noise distribution areas, or complex organic textures that are difficult for diffusion models to replicate perfectly.
