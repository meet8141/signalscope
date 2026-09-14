import { ArrowRight, ShieldCheck, Cpu, Image as ImageIcon, Database, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { MetricsDashboard } from '../components/MetricsDashboard';

import { AnimatedCounter } from '../components/AnimatedCounter';

function FeatureCard({ title, desc, icon: Icon }) {
  return (
    <div className="bg-stone-black border border-white/10 p-8 rounded-xl hover:border-acid-lime/50 transition-colors">
      <div className="w-12 h-12 bg-warm-charcoal rounded-lg flex items-center justify-center text-acid-lime mb-6">
        <Icon size={24} />
      </div>
      <h3 className="font-serif text-2xl text-off-white mb-3">{title}</h3>
      <p className="font-sans text-off-white/60 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}

function Metric({ value, label }) {
  return (
    <div className="flex flex-col border-l-2 border-acid-lime pl-4 sm:pl-6">
      <span className="font-serif text-3xl sm:text-5xl text-off-white font-light">
        <AnimatedCounter value={value} />
      </span>
      <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-off-white/50 mt-2">{label}</span>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="pt-24 sm:pt-32 pb-24">
      {/* Hero Section */}
      <section className="px-4 sm:px-8 max-w-[1400px] mx-auto text-center min-h-[calc(100vh-8rem)] flex flex-col justify-center items-center mb-32">
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-extralight leading-tight tracking-tight mb-8">
          Real vs AI-Generated <br />
          <span className="italic font-light text-acid-lime">Image Detection</span>
        </h1>
        <p className="font-sans text-lg sm:text-xl opacity-60 max-w-2xl mx-auto mb-12 leading-relaxed px-4">
          A resilient, multi-layered hybrid verification framework checking cryptographic provenance, metadata integrity, pixel-domain forensics, and deep-model inference.
        </p>
        <Link
          to="/check"
          className="inline-flex items-center gap-3 bg-acid-lime text-stone-black px-8 py-4 rounded-full font-sans font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,242,104,0.4)] hover:bg-white"
        >
          Get started
          <ArrowRight size={20} />
        </Link>

        {/* Scroll Indicator */}
        <div className="mt-8 flex flex-col items-center justify-center opacity-80 cursor-pointer">
          <span className="text-[10px] font-mono uppercase tracking-widest text-off-white/40 mb-4">Scroll to Explore</span>
          <div className="flex flex-col items-center">
            <div className="relative w-px h-10 bg-white/10 overflow-hidden mb-2">
              <div className="absolute top-0 left-0 w-full h-full bg-acid-lime animate-[scroll-line_2s_ease-in-out_infinite]"></div>
            </div>
            <ChevronDown className="text-acid-lime opacity-80 animate-bounce" size={16} />
          </div>
        </div>
      </section>

      {/* 4 Parallel Layers */}
      <section className="px-4 sm:px-8 max-w-[1400px] mx-auto mb-32">
        <div className="flex flex-col items-center mb-12 sm:mb-16 text-center">
          <span className="font-mono text-acid-lime text-xs sm:text-sm tracking-widest uppercase mb-4">Core Methodology</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-off-white">Four Parallel Layers of Verification</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title="C2PA Provenance"
            desc="Validates content credentials using Coalition for Content Provenance and Authenticity (C2PA) standards for cryptographic proof."
            icon={ShieldCheck}
          />
          <FeatureCard
            title="Metadata Integrity"
            desc="Audits binary EXIF headers for device and software signatures, flagging spoofed tags and synthetic traces."
            icon={Database}
          />
          <FeatureCard
            title="Pixel Forensics"
            desc="Advanced noise, GLCM texture, double JPEG, and FFT frequency-domain inspection for compression artifacts."
            icon={ImageIcon}
          />
          <FeatureCard
            title="Deep Model Inference"
            desc="Custom MobileNetV2 architecture with inverted residuals and depthwise convolutions fine-tuned for deepfake detection."
            icon={Cpu}
          />
        </div>
      </section>

      {/* Comprehensive Metrics & Performance Dashboard */}
      <section className="px-4 sm:px-8 max-w-[1400px] mx-auto bg-stone-black/50 border border-white/5 rounded-3xl p-6 sm:p-12 lg:p-16 flex flex-col mb-32 mx-4 sm:mx-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-mono text-acid-lime text-xs sm:text-sm tracking-widest uppercase mb-4 block">Performance & Data Architecture</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-off-white mb-6">Comprehensive Benchmarks</h2>
          <p className="font-sans text-sm sm:text-base text-off-white/60 leading-relaxed max-w-3xl mx-auto px-2">
            Our MobileNetV2 architecture was fine-tuned specifically for deepfake detection, leveraging transfer learning, inverted residuals, and depthwise convolutions.
          </p>
        </div>

        {/* Top level stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full mb-16 border-b border-white/10 pb-16">
          <Metric value="90.71%" label="Test Accuracy" />
          <Metric value="0.9690" label="ROC-AUC Score" />
          <Metric value="90.68%" label="Macro-F1" />
          <Metric value="96.33%" label="Avg Precision" />
        </div>

        <div className="flex flex-col gap-16 w-full">

          {/* Row 1: Dataset Distribution & Training Strategy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Dataset Distribution */}
            <div className="w-full overflow-hidden">
              <h3 className="font-mono text-acid-lime text-xs tracking-widest uppercase mb-6 border-b border-white/10 pb-2">Dataset Distribution (141.6k Total)</h3>
              <div className="bg-warm-charcoal rounded-xl border border-white/10 overflow-x-auto w-full">
                <table className="w-full text-sm text-left min-w-[350px]">
                  <thead className="bg-stone-black border-b border-white/10 font-mono text-xs uppercase text-off-white/50">
                    <tr>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3 text-right">Train (80%)</th>
                      <th className="px-4 py-3 text-right">Test (20%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-off-white/60 font-sans">REAL (65.8k)</td>
                      <td className="px-4 py-3 text-right">52,656</td>
                      <td className="px-4 py-3 text-right">13,165</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-off-white/60 font-sans">FAKE (75.8k)</td>
                      <td className="px-4 py-3 text-right">60,656</td>
                      <td className="px-4 py-3 text-right">15,165</td>
                    </tr>
                    <tr className="bg-stone-black/50 text-acid-lime font-bold">
                      <td className="px-4 py-3 font-sans">TOTAL</td>
                      <td className="px-4 py-3 text-right">113,312</td>
                      <td className="px-4 py-3 text-right">28,330</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-off-white/40 italic">
                Spanning HybridForensics, CIFAKE, and custom art datasets.
              </p>
            </div>

            {/* Training Strategy */}
            <div>
              <h3 className="font-mono text-acid-lime text-xs tracking-widest uppercase mb-6 border-b border-white/10 pb-2">Training Strategy</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-off-white/60">Input Size</span><span className="font-mono">224x224</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-off-white/60">Batch Size</span><span className="font-mono">32</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-off-white/60">Epochs</span><span className="font-mono">10</span></div>
                <div className="flex justify-between"><span className="text-off-white/60">Gating Threshold</span><span className="font-mono">0.5452</span></div>
              </div>
            </div>
          </div>

          {/* Row 2: Classification Metrics */}
          <div>
            <h3 className="font-mono text-acid-lime text-xs tracking-widest uppercase mb-6 border-b border-white/10 pb-2">Classification Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-stone-black border border-white/5 rounded-xl p-4 sm:p-6 flex flex-col justify-center">
                <span className="text-off-white/60 text-xs sm:text-sm mb-2">Precision</span>
                <span className="font-mono text-xl sm:text-2xl">0.8821</span>
              </div>
              <div className="bg-stone-black border border-white/5 rounded-xl p-6 flex flex-col justify-center">
                <span className="text-off-white/60 text-sm mb-2">Recall</span>
                <span className="font-mono text-2xl">0.9234</span>
              </div>
              <div className="bg-stone-black border border-white/5 rounded-xl p-6 flex flex-col justify-center">
                <span className="text-off-white/60 text-sm mb-2">Specificity</span>
                <span className="font-mono text-2xl">0.8929</span>
              </div>
              <div className="bg-stone-black border border-white/5 rounded-xl p-6 flex flex-col justify-center">
                <span className="text-off-white/60 text-sm mb-2">False Positive Rate</span>
                <span className="font-mono text-2xl">0.1071</span>
              </div>
            </div>
          </div>

          {/* Row 3: Confusion Matrix */}
          <div>
            <h3 className="font-mono text-acid-lime text-xs tracking-widest uppercase mb-6 border-b border-white/10 pb-2">Confusion Matrix (Test Set)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-stone-black border border-acid-lime/30 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-xs text-off-white/50 uppercase tracking-widest mb-2">True Negative</span>
                <span className="font-serif text-4xl text-acid-lime">13,541</span>
                <span className="text-sm text-off-white/30 mt-2">Real as Real</span>
              </div>
              <div className="bg-stone-black border border-red-500/30 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-xs text-off-white/50 uppercase tracking-widest mb-2">False Positive</span>
                <span className="font-serif text-4xl text-red-400">1,624</span>
                <span className="text-sm text-off-white/30 mt-2">Real as Fake</span>
              </div>
              <div className="bg-stone-black border border-red-500/30 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-xs text-off-white/50 uppercase tracking-widest mb-2">False Negative</span>
                <span className="font-serif text-4xl text-red-400">1,009</span>
                <span className="text-sm text-off-white/30 mt-2">Fake as Real</span>
              </div>
              <div className="bg-stone-black border border-acid-lime/30 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-xs text-off-white/50 uppercase tracking-widest mb-2">True Positive</span>
                <span className="font-serif text-4xl text-acid-lime">12,156</span>
                <span className="text-sm text-off-white/30 mt-2">Fake as Fake</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MetricsDashboard (Recharts) */}
      <section className="px-8 max-w-[1400px] mx-auto mb-32">
        <MetricsDashboard />
      </section>

      {/* Tech Stack & File Structure */}
      <section className="px-8 max-w-[1400px] mx-auto mb-32">
        <div className="flex flex-col items-center mb-16">
          <span className="font-mono text-acid-lime text-sm tracking-widest uppercase mb-4">Architecture</span>
          <h2 className="font-serif text-4xl text-off-white text-center">Tech Stack & Project Structure</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* File Structure */}
          <div className="bg-stone-black border border-white/5 rounded-3xl p-8 lg:p-12">
            <h3 className="font-mono text-acid-lime text-xs tracking-widest uppercase mb-8 border-b border-white/10 pb-2 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Repository Structure
            </h3>
            <div className="font-mono text-sm text-off-white/70 bg-warm-charcoal p-6 rounded-xl border border-white/5 overflow-x-auto">
              <div className="flex flex-col gap-1 whitespace-nowrap">
                <span className="text-acid-lime font-bold">signalscope/</span>
                <span className="ml-4 flex gap-2"><span className="text-white/30">├─</span> <span className="text-blue-400 font-bold">backend/</span> <span className="text-white/40 text-xs ml-2 hidden sm:inline"># FastAPI & ML Pipeline</span></span>
                <span className="ml-8 flex gap-2"><span className="text-white/30">├─</span> main.py <span className="text-white/40 text-xs ml-2 hidden sm:inline"># API endpoints & routing</span></span>
                <span className="ml-8 flex gap-2"><span className="text-white/30">├─</span> analyzer.py <span className="text-white/40 text-xs ml-2 hidden sm:inline"># Core forensic logic</span></span>
                <span className="ml-8 flex gap-2"><span className="text-white/30">├─</span> c2pa_check.py <span className="text-white/40 text-xs ml-2 hidden sm:inline"># Cryptographic provenance</span></span>
                <span className="ml-8 flex gap-2"><span className="text-white/30">├─</span> models/ <span className="text-white/40 text-xs ml-2 hidden sm:inline"># MobileNetV2 weights (.h5)</span></span>
                <span className="ml-8 flex gap-2"><span className="text-white/30">└─</span> requirements.txt</span>
                <span className="ml-4 mt-2 flex gap-2"><span className="text-white/30">├─</span> <span className="text-acid-lime font-bold">frontend/</span> <span className="text-white/40 text-xs ml-2 hidden sm:inline"># React + Vite UI</span></span>
                <span className="ml-8 flex gap-2"><span className="text-white/30">├─</span> src/</span>
                <span className="ml-12 flex gap-2"><span className="text-white/30">├─</span> components/ <span className="text-white/40 text-xs ml-2 hidden sm:inline"># Reusable UI</span></span>
                <span className="ml-12 flex gap-2"><span className="text-white/30">├─</span> pages/ <span className="text-white/40 text-xs ml-2 hidden sm:inline"># Landing & Scanner</span></span>
                <span className="ml-12 flex gap-2"><span className="text-white/30">└─</span> App.jsx</span>
                <span className="ml-8 flex gap-2"><span className="text-white/30">├─</span> package.json</span>
                <span className="ml-8 flex gap-2"><span className="text-white/30">└─</span> tailwind.config.js</span>
                <span className="ml-4 mt-2 flex gap-2"><span className="text-white/30">└─</span> README.md</span>
              </div>
            </div>
          </div>

          {/* Tech Stack Modules */}
          <div>
            <h3 className="font-mono text-acid-lime text-xs tracking-widest uppercase mb-8 border-b border-white/10 pb-2">Technical Domains</h3>

            <div className="space-y-4">
              <div className="bg-stone-black border border-white/5 rounded-2xl p-6 hover:border-acid-lime/30 transition-colors">
                <h4 className="text-off-white font-serif text-xl mb-2">Backend & API</h4>
                <p className="text-off-white/50 text-sm mb-4">FastAPI powered async backend for high-performance model inference and data processing.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/5 text-off-white/80 text-xs font-mono rounded-full border border-white/10">FastAPI</span>
                  <span className="px-3 py-1 bg-white/5 text-off-white/80 text-xs font-mono rounded-full border border-white/10">Uvicorn</span>
                  <span className="px-3 py-1 bg-white/5 text-off-white/80 text-xs font-mono rounded-full border border-white/10">Python 3.10+</span>
                </div>
              </div>

              <div className="bg-stone-black border border-white/5 rounded-2xl p-6 hover:border-acid-lime/30 transition-colors">
                <h4 className="text-off-white font-serif text-xl mb-2">ML & Forensics Pipeline</h4>
                <p className="text-off-white/50 text-sm mb-4">Multi-layered analysis utilizing deep learning alongside cryptographic and spectral forensics.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono rounded-full border border-blue-500/20">TensorFlow / Keras</span>
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-mono rounded-full border border-orange-500/20">OpenCV</span>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-mono rounded-full border border-purple-500/20">scikit-image</span>
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-mono rounded-full border border-green-500/20">c2pa-python</span>
                  <span className="px-3 py-1 bg-white/5 text-off-white/80 text-xs font-mono rounded-full border border-white/10">Pillow / piexif</span>
                </div>
              </div>

              <div className="bg-stone-black border border-white/5 rounded-2xl p-6 hover:border-acid-lime/30 transition-colors">
                <h4 className="text-off-white font-serif text-xl mb-2">Frontend Experience</h4>
                <p className="text-off-white/50 text-sm mb-4">Responsive, highly interactive React SPA featuring dynamic visualizations and a premium dark mode UI.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#61DAFB]/10 text-[#61DAFB] text-xs font-mono rounded-full border border-[#61DAFB]/20">React 18</span>
                  <span className="px-3 py-1 bg-[#38B2AC]/10 text-[#38B2AC] text-xs font-mono rounded-full border border-[#38B2AC]/20">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-[#646CFF]/10 text-[#646CFF] text-xs font-mono rounded-full border border-[#646CFF]/20">Vite</span>
                  <span className="px-3 py-1 bg-white/5 text-off-white/80 text-xs font-mono rounded-full border border-white/10">Recharts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
