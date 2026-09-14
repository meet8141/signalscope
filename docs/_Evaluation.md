# Model Evaluation & Metrics

SignalScope's deep learning component demonstrated powerful discriminative capabilities between authentic and synthetic imagery during the final evaluation phase on the unseen test set (28,330 samples).

## Primary Performance Metrics
The classifier yields exceptionally strong aggregate metrics, proving its robustness across various generative model artifacts.

- **ROC-AUC (Receiver Operating Characteristic - Area Under Curve):** `0.9690`
- **Average Precision (AP / PR-AUC):** `0.9633`
- **Accuracy:** `90.71%`
- **Macro-F1 Score:** `0.9068`

> [!TIP]
> The `0.9690` ROC-AUC indicates that the model has a 96.9% probability of ranking a randomly chosen real image higher than a randomly chosen AI-generated image, proving excellent separability.

## Operating Point Selection
By analyzing the ROC curve and optimizing for Youden's J statistic, the ideal probability threshold was calculated.

- **Selected Threshold:** `0.5452`
- **Precision:** `0.8821`
- **Recall (Sensitivity):** `0.9234`
- **Specificity:** `0.8929`
- **False Positive Rate:** `0.1071`
- **Negative Predictive Value (NPV):** `0.9307`

## Confusion Matrix Analysis
At the `0.5452` operating threshold, the model produced the following distribution on the 28,330 test samples:

| | Predicted FAKE (Class 0) | Predicted REAL (Class 1) |
|---|---|---|
| **Actual FAKE** | True Negatives (TN): **13,541** | False Positives (FP): **1,624** |
| **Actual REAL** | False Negatives (FN): **1,009** | True Positives (TP): **12,156** |

**Takeaways:**
1. The model is highly effective at identifying REAL images (High Recall: 12,156 correctly identified out of 13,165).
2. The slightly elevated False Positive rate (1,624 Fake images slipping through as Real) highlights the necessity of the hybrid forensic layers. Images that fool the CNN will be subsequently flagged by the Metadata, C2PA, or Spectral Forensic layers, fulfilling the promise of the gated multi-layer architecture.

## 🖼️ Gallery / Visualizations

Below are the visualizations and outputs from the training run located in the `images` directory:

<div align="center">
 <img src="../images/WhatsApp%20Image%202026-09-13%20at%204.10.42%20PM.jpeg" width="30%" alt="Image 1"/>
  <img src="../images/WhatsApp%20Image%202026-09-13%20at%204.10.58%20PM.jpeg" width="30%" alt="Image 2"/>
  <br/>
  <img src="../images/WhatsApp%20Image%202026-09-13%20at%204.11.19%20PM.jpeg" width="30%" alt="Image 5"/>
  <img src="../images/WhatsApp%20Image%202026-09-13%20at%204.11.10%20PM.jpeg" width="30%" alt="Image 4"/>
  <br/>
  
  <img src="../images/WhatsApp%20Image%202026-09-13%20at%204.11.51%20PM.jpeg" width="30%" alt="Image 7"/>
  <img src="../images/WhatsApp%20Image%202026-09-13%20at%204.12.08%20PM.jpeg" width="30%" alt="Image 9"/>
  <br/>
  
  <img src="../images/WhatsApp%20Image%202026-09-13%20at%204.12.00%20PM.jpeg" width="30%" alt="Image 8"/>
  <img src="../images/WhatsApp%20Image%202026-09-13%20at%204.11.28%20PM.jpeg" width="30%" alt="Image 6"/>
  <br/>
    <img src="../images/WhatsApp%20Image%202026-09-13%20at%204.11.04%20PM.jpeg" width="30%" alt="Image 3"/>
</div>
