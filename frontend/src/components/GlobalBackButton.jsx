import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function GlobalBackButton() {
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="absolute top-24 left-4 sm:left-8 z-40">
      <Link
        to="/"
        className="flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-stone-black/80 backdrop-blur-md text-off-white/60 hover:text-stone-black hover:bg-acid-lime hover:border-acid-lime transition-all hover:scale-105 shadow-xl"
        title="Back to Home"
      >
        <ArrowLeft size={20} />
      </Link>
    </div>
  );
}
