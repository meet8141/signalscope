import { Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const location = useLocation();
  const isCheckPage = location.pathname === '/check';

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-stone-black/80 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-8 h-17 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-off-white hover:text-acid-lime transition-colors">
          <Shield className="text-acid-lime" size={28} />
          <span className="font-serif text-xl tracking-tight">Signal<span className="font-bold">Scope</span></span>
        </Link>

        <div className="flex items-center gap-6 font-mono text-sm uppercase tracking-wider">
          <a href="https://github.com/aksharpatel/signalscope" target="_blank" rel="noopener noreferrer" className="relative group opacity-60 hover:opacity-100 hover:text-acid-lime transition-colors">
            Documentation
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-acid-lime transition-all duration-300 ease-out group-hover:w-full"></span>
          </a>

          {isCheckPage ? (
            <Link to="/" className="px-5 py-2 border border-white/20 rounded-full opacity-80 hover:bg-white hover:text-stone-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Return Home
            </Link>
          ) : (
            <Link to="/check" className="px-5 py-2 bg-acid-lime text-stone-black rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(212,242,104,0.5)] hover:bg-white">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
