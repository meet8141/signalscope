import { ShieldCheck, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-stone-black pt-20 overflow-hidden mt-12">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-acid-lime/30 to-transparent"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-6 h-6 text-acid-lime" />
              <span className="font-serif text-2xl text-off-white">SignalScope</span>
            </div>
            <p className="font-sans text-sm text-off-white/50 mb-6 leading-relaxed">
              Advanced multi-layered forensic pipeline for distinguishing authentic photography from AI-generated media.
            </p>
            <div className="flex gap-4 mt-8">
              <a href="https://github.com/meet8141/signalscope" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-off-white/60 hover:bg-acid-lime hover:text-stone-black hover:border-acid-lime transition-all">
                <GithubIcon />
              </a>
              <a href="https://www.linkedin.com/groups/40598002/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-off-white/60 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all">
                <LinkedinIcon />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase text-off-white/70 mb-6 border-b border-white/5 pb-2">Platform</h4>
            <ul className="space-y-4 font-sans text-sm text-off-white/50">
              <li><a href="/architecture" target="_blank" rel="noopener noreferrer" className="hover:text-acid-lime hover:translate-x-1 transition-all inline-block">Architecture Overview</a></li>
              <li><a href="/performance" target="_blank" rel="noopener noreferrer" className="hover:text-acid-lime hover:translate-x-1 transition-all inline-block">Performance Benchmarks</a></li>
              <li><a href="/developer" target="_blank" rel="noopener noreferrer" className="hover:text-acid-lime hover:translate-x-1 transition-all inline-block">Developer Documentation</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase text-off-white/70 mb-6 border-b border-white/5 pb-2">Resources</h4>
            <ul className="space-y-4 font-sans text-sm text-off-white/50">
              <li><a href="/research" target="_blank" rel="noopener noreferrer" className="hover:text-acid-lime hover:translate-x-1 transition-all inline-block">Research Methodology</a></li>
              <li><a href="/dataset" target="_blank" rel="noopener noreferrer" className="hover:text-acid-lime hover:translate-x-1 transition-all inline-block">Dataset Access (Kaggle)</a></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase text-off-white/70 mb-6 border-b border-white/5 pb-2">Connect</h4>
            <ul className="space-y-4 font-sans text-sm text-off-white/50">
              <li><a href="/faq" target="_blank" rel="noopener noreferrer" className="hover:text-acid-lime hover:translate-x-1 transition-all inline-block">FAQ</a></li>
              <li><a href="/team" target="_blank" rel="noopener noreferrer" className="hover:text-acid-lime hover:translate-x-1 transition-all inline-block">Team</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-off-white/40">
          <p>&copy; {new Date().getFullYear()} SIH SignalScope Project. Open Source.</p>
          <div className="flex items-center gap-6">
            <Link
              to="/team"
              className="flex items-center gap-2 hover:text-acid-lime transition-colors"
            >
              <Users size={14} />
              MEET THE TEAM
              <ChevronRight size={14} />
            </Link>
            <p className="hidden md:block">Designed with precision. Built for truth.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
