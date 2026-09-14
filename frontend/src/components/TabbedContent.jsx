import { useState } from 'react';
import { SerratedDivider } from './SerratedDivider';
import { ShowcaseGrid } from './ShowcaseGrid';

import { MetadataViewer, C2PAViewer, ForensicViewer, ModelViewer } from './ResultViewers';

export function TabbedContent({ results }) {
  const [activeTab, setActiveTab] = useState('AI Model');
  const tabs = ['AI Model', 'C2PA Trace', 'Metadata', 'Forensics'];

  return (
    <section className="relative px-8 py-24 max-w-[1400px] mx-auto z-10" id="analysis">

      {/* Folder Tabs Navigation */}
      <div className="flex flex-wrap gap-4 mb-[-8px] md:pl-12 relative z-20">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab;
          const rotation = isActive ? 'rotate-0' : idx % 2 === 0 ? '-rotate-2' : '-rotate-1';

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 md:px-8 py-4 rounded-t-2xl font-serif text-lg md:text-xl tracking-tight transition-all duration-300 origin-bottom-left
                ${rotation}
                ${isActive
                  ? 'bg-acid-lime text-stone-black pb-6 -mt-2 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-30'
                  : 'bg-stone-black border-2 border-white/10 text-off-white opacity-70 hover:opacity-100 hover:-translate-y-1 hover:-rotate-0 z-10'
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10">
        <SerratedDivider className="rotate-180 bg-warm-charcoal -mb-[1px]" />

        <div className="bg-warm-charcoal min-h-[500px] rounded-b-2xl rounded-tr-2xl relative overflow-hidden border border-white/10 border-t-0 p-8 md:p-12">
          {/* Grid Pattern Background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #E7E5E4 1px, transparent 1px), linear-gradient(to bottom, #E7E5E4 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          <div className="relative z-10">
            <h2 className="font-serif text-4xl mb-8">
              <span className="italic font-light">Analysis</span> Details
            </h2>

            {/* Show Grid if no results yet, otherwise show data */}
            {!results ? (
              activeTab === 'AI Model' ? (
                <div className="p-8 border border-white/10 rounded-xl bg-stone-black/50 text-mono text-sm opacity-60">
                  Upload an image signal to run {activeTab.toLowerCase()} diagnostics.
                </div>
              ) : (
                <div className="p-8 border border-white/10 rounded-xl bg-stone-black/50 text-mono text-sm opacity-60">
                  Upload an image signal to run {activeTab.toLowerCase()} diagnostics.
                </div>
              )
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'AI Model' && <ModelViewer data={results.model} />}
                {activeTab === 'Metadata' && <MetadataViewer data={results.metadata} />}
                {activeTab === 'C2PA Trace' && <C2PAViewer data={results.c2pa} />}
                {activeTab === 'Forensics' && <ForensicViewer data={results.forensic} />}

              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
