import React from 'react';
import ReactMarkdown from 'react-markdown';
import modelTraining from '../../../docs/_Model_Training.md?raw';
import evaluation from '../../../docs/_Evaluation.md?raw';
import { Link } from 'react-router-dom';

export function PerformancePage() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-[1400px] mx-auto w-full">
      <h1 className="font-serif text-5xl md:text-7xl font-extralight mb-8">Performance Benchmarks</h1>
      <section className="prose prose-invert max-w-none mb-8 prose-headings:font-serif prose-headings:font-light prose-a:text-acid-lime hover:prose-a:text-white transition-colors prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
        <ReactMarkdown>{modelTraining}</ReactMarkdown>
      </section>
      <section className="prose prose-invert max-w-none mb-8 prose-headings:font-serif prose-headings:font-light prose-a:text-acid-lime hover:prose-a:text-white transition-colors prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
        <ReactMarkdown>{evaluation}</ReactMarkdown>
      </section>
      <Link to="/" className="mt-12 inline-block text-acid-lime hover:underline">← Back to Home</Link>
    </div>
  );
}
