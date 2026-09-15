import { ArrowRight, FileImage, ShieldAlert, ShieldCheck, Download } from 'lucide-react';

export function StickyNoteCTA({ results, selectedFile }) {
  const fileName = selectedFile?.name || 'No signal selected';
  const isAuthentic = results?.trust_score >= 7;

  return (
    <div className="relative z-10 w-full flex flex-col justify-center text-off-white">
      {results ? (
        <>
          <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-warm-charcoal/50 backdrop-blur-sm w-fit">
            <FileImage size={16} className={isAuthentic ? "text-acid-lime" : "text-red-400"} />
            <span className="font-mono text-sm opacity-80 max-w-[250px] truncate">{fileName}</span>
          </div>

          <h1 className="font-serif text-6xl md:text-8xl font-extralight leading-[0.9] tracking-tight mb-8">
            <span className={isAuthentic ? "text-acid-lime font-medium" : "text-red-400 font-medium"}>
              {results.trust_score}
            </span>
            <span className="text-4xl md:text-5xl opacity-40">/100</span>
            <br />
            <span className="italic font-light opacity-90 text-5xl md:text-7xl mt-2 block">Trust Score</span>
          </h1>

          <div className="flex items-center gap-4 mb-12">
            {isAuthentic ? (
              <ShieldCheck size={32} className="text-acid-lime" />
            ) : (
              <ShieldAlert size={32} className="text-red-400" />
            )}
            <p className="font-sans text-xl md:text-2xl font-medium leading-tight opacity-90">
              {results.model?.verdict || 'Analysis Complete'}
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full max-w-sm mt-4">
            <button
              onClick={() => window.print()}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-4 border border-acid-lime text-acid-lime bg-transparent font-serif text-base sm:text-lg rounded-full hover:bg-acid-lime hover:text-stone-black hover:shadow-[0_0_30px_rgba(212,242,104,0.2)] transition-all duration-300 w-full"
            >
              <Download size={20} className="transition-transform group-hover:-translate-y-1" />
              Download Full Report
            </button>
            <div
              onClick={() => document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex cursor-pointer items-center justify-between border-t border-white/20 pt-4 opacity-50 transition-opacity hover:opacity-100 w-full"
            >

              <span className="font-sans text-sm font-bold uppercase tracking-wider">Full Diagnostics Below</span>
              <ArrowRight size={18} className="rotate-90" />
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="font-serif text-6xl md:text-8xl font-extralight leading-[0.9] tracking-tight mb-8">
            Signal <br />
            <span className="italic font-light opacity-90">Analysis</span>
          </h1>
          <p className="font-sans text-xl opacity-60 max-w-md mb-12 leading-relaxed">
            Run comprehensive forensic analysis on media assets in milliseconds. Upload a signal to begin.
          </p>
          <div className="flex flex-col gap-6 w-full max-w-sm mt-4">
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-4 border border-white/20 text-off-white/30 bg-transparent font-serif text-base sm:text-lg rounded-full cursor-not-allowed w-full transition-all"
            >
              <Download size={20} className="opacity-50" />
              Download Full Report
            </button>
            <div className="flex items-center justify-between border-t border-white/20 pt-4 opacity-50 w-full">
              <span className="font-sans text-sm font-bold uppercase tracking-wider">Awaiting Input</span>
              <ArrowRight size={18} className="animate-pulse" />
            </div>
          </div>
        </>
      )
      }
    </div >
  );
}
