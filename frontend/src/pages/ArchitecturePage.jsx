import React from 'react';
import ReactMarkdown from 'react-markdown';
import coreMethodology from '../../../docs/_Core_Methodology.md?raw';
import metadata from '../../../docs/_Metadata_Provenance.md?raw';
import forensicAnalysis from '../../../docs/_Forensic_Analysis.md?raw';
import { Link } from 'react-router-dom';

export function ArchitecturePage() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-[1400px] mx-auto w-full">
      <h1 className="font-serif text-5xl md:text-7xl font-extralight mb-8">Architecture Overview</h1>
      <section className="prose prose-invert max-w-none mb-8 prose-headings:font-serif prose-headings:font-light prose-a:text-acid-lime hover:prose-a:text-white transition-colors prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
        <ReactMarkdown>{coreMethodology}</ReactMarkdown>
      </section>
      <section className="prose prose-invert max-w-none mb-8 prose-headings:font-serif prose-headings:font-light prose-a:text-acid-lime hover:prose-a:text-white transition-colors prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
        <ReactMarkdown>{metadata}</ReactMarkdown>
      </section>
      <section className="prose prose-invert max-w-none mb-8 prose-headings:font-serif prose-headings:font-light prose-a:text-acid-lime hover:prose-a:text-white transition-colors prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
        <ReactMarkdown>{forensicAnalysis}</ReactMarkdown>
      </section>
      <Link to="/" className="mt-12 inline-block text-acid-lime hover:underline">← Back to Home</Link>
    </div>
  );
}
