import { ArrowRight } from 'lucide-react';

export function StickyNoteCTA({ results }) {
  return (
    <div className={`absolute -left-12 bottom-24 z-10 w-72 origin-bottom-left rotate-[6deg] rounded-lg p-10 shadow-2xl transition-transform duration-300 hover:scale-105 hover:rotate-0 ${results ? (results.trust_score >= 7 ? 'bg-acid-lime text-stone-black' : 'bg-red-400 text-stone-black') : 'bg-acid-lime text-stone-black'}`}>
      {results ? (
        <>
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-serif text-3xl font-light leading-tight">
              Final <br />
              <span className="italic font-medium">Verdict</span>
            </h3>
            <div className="flex flex-col items-end">
              <span className="text-4xl font-serif">{results.trust_score}</span>
              <span className="text-[10px] font-mono uppercase opacity-70">/ 10 Score</span>
            </div>
          </div>
          <p className="mb-6 font-sans text-xl font-medium leading-tight">
            {results.model?.verdict || 'Unknown'}
          </p>
          <div className="flex cursor-pointer items-center justify-between border-t border-stone-black/20 pt-4 opacity-70 transition-opacity hover:opacity-100">
            <span className="font-sans text-sm font-bold uppercase tracking-wider">Analysis Complete</span>
            <ArrowRight size={18} />
          </div>
        </>
      ) : (
        <>
          <h3 className="mb-4 font-serif text-3xl font-light leading-tight">
            Authenticate <br />
            <span className="italic font-medium">Digital Reality</span>
          </h3>
          <p className="mb-8 font-sans text-sm font-medium opacity-80">
            Run comprehensive forensic analysis on media assets in milliseconds.
          </p>
          <div className="flex cursor-pointer items-center justify-between border-t border-stone-black/20 pt-4 opacity-70 transition-opacity hover:opacity-100">
            <span className="font-sans text-sm font-bold uppercase tracking-wider">Deploy Scan</span>
            <ArrowRight size={18} />
          </div>
        </>
      )}
    </div>
  );
}
