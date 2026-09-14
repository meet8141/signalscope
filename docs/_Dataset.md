# Dataset Assembly & Distribution

To train an robust and generalized deep learning classifier, SignalScope leverages a heavily curated, massive dataset comprising a diverse mix of real-world photography and state-of-the-art AI-generated imagery.

## Sourcing
The training and validation sets were aggregated from three high-quality open-source datasets:
1. **[HybridForensics Dataset](https://www.kaggle.com/datasets/shanmuk4622/real-and-fake-ai-generated-512px-dataset?select=HybridForensics_Dataset_High):** Provides high-resolution `512px` samples containing advanced generative artifacts.
2. **[CIFAKE Dataset](https://www.kaggle.com/datasets/birdy654/cifake-real-and-ai-generated-synthetic-images):** A synthetic vs. real image set structured for binary classification.
3. **[AI Art Images Dataset](https://www.kaggle.com/datasets/doctorstrange420/real-and-fake-ai-generated-art-images-dataset):** Ensures the model generalizes to highly stylized and artistic generative outputs, preventing the network from solely keying in on photorealistic errors.

## Data Distribution
The combined dataset consists of **141,642** images, strictly partitioned into an 80% training and 20% testing split to prevent data leakage and guarantee an objective evaluation.

| Classification Class | Training Set (80%) | Testing Set (20%) | Total Count |
| :--- | :--- | :--- | :--- |
| **REAL (Class 1)** | 52,656 | 13,165 | 65,821 |
| **FAKE (Class 0)** | 60,656 | 15,165 | 75,821 |
| **Aggregate Total** | 113,312 | 28,330 | **141,642** |

## Data Preparation & Integrity
Prior to training, the dataset underwent strict validation pipelines:
- **Integrity Checks:** Using `PIL.Image.verify()`, all 141,642 files were checked for corrupt headers or truncated byte streams. Broken files were systematically removed from the DataFrames to prevent training interrupts.
- **Balanced Augmentation:** To prevent the model from memorizing the training set, `ImageDataGenerator` was utilized for conservative data augmentation. Small rotations (10°), width/height shifts (5%), and horizontal flips were applied dynamically during training epochs.
- **Normalization:** All input arrays were scaled using the designated `preprocess_input` function for the MobileNetV2 architecture, mapping pixel values to the `[-1, 1]` range required for optimal gradient descent.
