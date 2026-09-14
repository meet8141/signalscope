import React from 'react';
import ReactMarkdown from 'react-markdown';
import readme from '../../../README.md?raw';
import setupGuide from '../../../docs/_Setup_Guide.md?raw';
import { Link } from 'react-router-dom';

export function DeveloperPage() {
  return (
    <div className="pt-32 pb-24 px-8 max-w-[1400px] mx-auto w-full relative z-10">
      <Link to="/" className="inline-block text-acid-lime hover:underline mb-8 font-mono text-sm uppercase tracking-wider">
        ← Back to Home
      </Link>
      <h1 className="font-serif text-5xl md:text-7xl font-extralight mb-12">Developer Documentation</h1>
      
      <div className="space-y-16">
        <section className="prose prose-invert max-w-none prose-headings:font-serif prose-headings:font-light prose-a:text-acid-lime hover:prose-a:text-white transition-colors prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
          <ReactMarkdown>{readme}</ReactMarkdown>
        </section>
        
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-12" />
        
        <section className="prose prose-invert max-w-none prose-headings:font-serif prose-headings:font-light prose-a:text-acid-lime hover:prose-a:text-white transition-colors prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
          <ReactMarkdown>{setupGuide}</ReactMarkdown>
        </section>
      </div>
    </div>
  );
}
