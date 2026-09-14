import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

const faqMarkdown = `
## Frequently Asked Questions

### What is SignalScope?
SignalScope is an advanced multi-layered forensic pipeline designed to distinguish authentic photography from AI-generated media. It uses deep learning, metadata analysis, and pixel-level forensics to detect synthetic artifacts.

### How does the Gated Ingestion Logic work?
To optimize performance, the system uses a gated pipeline. It first checks for known cryptographic signatures (like C2PA) and metadata anomalies. If an image is definitively proven real or fake at this stage, it avoids running computationally heavy spectral analysis and deep learning models.

### What kind of models do you use?
We use a custom-trained MobileNetV2 architecture with a classification head optimized for detecting synthetic noise patterns. Transfer learning was employed along with smart Keras callbacks to achieve a high ROC-AUC score.

### Can the system detect images that have been compressed or resized?
Yes. While compression and resizing degrade subtle high-frequency artifacts (often destroying simple noise-based detection), SignalScope's multi-layered approach uses structural and spectral analysis (like Error Level Analysis and FFT) which are more robust against such degradation.

### Is my data stored when I upload an image?
No, the pipeline is designed for privacy. Images are processed in memory during the forensic analysis and are not permanently stored on our servers.

### How accurate is the detection?
Based on our extensive benchmarking using a dataset of over 140,000 images, the model achieved a 0.9690 ROC-AUC score, making it highly reliable in distinguishing authentic media from state-of-the-art AI generations.
`;

export function FAQPage() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-[1400px] mx-auto w-full relative z-10">
      <Link to="/" className="inline-block text-acid-lime hover:underline mb-8 font-mono text-sm uppercase tracking-wider">
        ← Back to Home
      </Link>
      <h1 className="font-serif text-5xl md:text-7xl font-extralight mb-12">FAQ</h1>
      
      <section className="prose prose-invert max-w-none prose-headings:font-serif prose-headings:font-light prose-a:text-acid-lime hover:prose-a:text-white transition-colors">
        <ReactMarkdown>{faqMarkdown}</ReactMarkdown>
      </section>
    </div>
  );
}
