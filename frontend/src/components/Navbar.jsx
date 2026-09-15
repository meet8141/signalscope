import { Shield, LogOut, Menu, X, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../firebase';
import { useState, useRef, useEffect } from 'react';

export function Navbar() {
  const location = useLocation();
  const isCheckPage = location.pathname === '/check';
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-stone-black/80 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-off-white hover:text-acid-lime transition-colors">
          <Shield className="text-acid-lime" size={28} />
          <span className="font-serif text-xl tracking-tight">Signal<span className="font-bold">Scope</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 font-mono text-sm uppercase tracking-wider">
          <Link to="/team" className="relative group opacity-60 hover:opacity-100 hover:text-acid-lime transition-colors">
            Team
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-acid-lime transition-all duration-300 ease-out group-hover:w-full"></span>
          </Link>

          {user ? (
            <div className="flex items-center gap-6">
              <Link
                to="/check"
                className="px-6 h-10 flex items-center justify-center bg-acid-lime text-stone-black rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_15px_rgba(212,242,104,0.2)] hover:shadow-[0_0_25px_rgba(212,242,104,0.4)] hover:bg-white"
              >
                Get Started
              </Link>

              {user.photoURL && !imageError ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-white/20 object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 font-sans font-medium text-lg">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}

              <button
                onClick={logout}
                title="Logout"
                className="w-10 h-10 flex items-center justify-center text-white/80 border border-white/20 rounded-full hover:text-red-400 hover:border-red-400 hover:bg-red-400/10 transition-all"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-6 h-10 bg-acid-lime text-stone-black rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_15px_rgba(212,242,104,0.2)] hover:shadow-[0_0_25px_rgba(212,242,104,0.4)] hover:bg-white"
            >
              <LogIn size={16} />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none p-2 -mr-2 relative w-10 h-10 flex items-center justify-center">
            <Menu className={`absolute transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} size={26} />
            <X className={`absolute transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} size={26} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-stone-black/98 backdrop-blur-xl border-b border-white/10 flex flex-col py-6 px-6 gap-2 font-mono text-sm uppercase tracking-wider shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300">
          <Link to="/team" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center w-full py-4 text-off-white hover:text-acid-lime transition-colors rounded-xl hover:bg-white/5">
            Team
          </Link>

          {user ? (
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-3 text-white/90 bg-white/5 border border-white/10 px-4 py-3 rounded-xl w-full">
                {user.photoURL && !imageError ? (
                  <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-white/10" onError={() => setImageError(true)} />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-sans font-medium text-lg">{user.email?.charAt(0).toUpperCase()}</div>
                )}
                <span className="text-xs truncate font-sans normal-case tracking-normal">{user.email}</span>
              </div>
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 w-full py-4 text-white/60 hover:text-red-400 bg-white/5 rounded-xl transition-colors">
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-4 bg-acid-lime text-stone-black rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(212,242,104,0.2)] hover:shadow-[0_0_25px_rgba(212,242,104,0.4)] hover:bg-white">
              <LogIn size={18} />
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
