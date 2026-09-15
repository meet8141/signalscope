import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function GlobalBackButton() {
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto relative z-40">
      <div className="absolute top-24 left-4 sm:left-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-acid-lime hover:opacity-75 transition-opacity font-mono text-sm uppercase tracking-wider"
          title="Back to Home"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
