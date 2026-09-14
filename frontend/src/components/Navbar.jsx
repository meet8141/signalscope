import { Shield, LogOut, Menu, X } from 'lucide-react';
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
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 h-17 flex items-center justify-between">
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

          {isCheckPage ? (
            <Link to="/" className="px-5 py-2 border border-white/20 rounded-full opacity-80 hover:bg-white hover:text-stone-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Return Home
            </Link>
          ) : (
            <Link to="/check" className="px-5 py-2 bg-acid-lime text-stone-black rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(212,242,104,0.5)] hover:bg-white">
              Get Started
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4 ml-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 focus:outline-none hover:scale-105 transition-transform"
                  title="View Profile"
                >
                  {user.photoURL && !imageError ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border border-white/20 cursor-pointer"
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 cursor-pointer">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 py-2.5 px-4 bg-stone-black border border-white/10 rounded-xl shadow-2xl backdrop-blur-md z-50 whitespace-nowrap animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-white/80 font-mono text-xs">{user.email}</p>
                  </div>
                )}
              </div>
              <button
                onClick={logout}
                className="text-white/60 hover:text-red-400 transition-colors flex items-center gap-1"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 px-4 py-1.5 border border-white/20 rounded-full text-xs hover:bg-white/10 transition-all duration-300"
            >
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
        <div className="md:hidden absolute top-full left-0 w-full bg-stone-black/95 backdrop-blur-md border-b border-white/10 flex flex-col items-center py-6 gap-6 font-mono text-sm uppercase tracking-wider shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-top-2 duration-300">
          <Link to="/team" onClick={() => setIsMobileMenuOpen(false)} className="text-off-white hover:text-acid-lime transition-colors">Team</Link>
          
          {isCheckPage ? (
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-2 border border-white/20 rounded-full opacity-80 hover:bg-white hover:text-stone-black transition-all">
              Return Home
            </Link>
          ) : (
            <Link to="/check" onClick={() => setIsMobileMenuOpen(false)} className="px-5 py-2 bg-acid-lime text-stone-black rounded-full font-bold transition-all hover:bg-white">
              Get Started
            </Link>
          )}

          {user ? (
            <div className="flex flex-col items-center gap-4 mt-2 w-full px-8">
              <div className="flex items-center gap-3 text-white/80 bg-white/5 border border-white/10 px-4 py-2 rounded-xl w-full justify-center">
                {user.photoURL && !imageError ? (
                  <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" onError={() => setImageError(true)} />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">{user.email?.charAt(0).toUpperCase()}</div>
                )}
                <span className="text-xs truncate max-w-[200px]">{user.email}</span>
              </div>
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-white/60 hover:text-red-400 transition-colors flex items-center gap-2 py-2">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-2 border border-white/20 rounded-full text-xs hover:bg-white/10 transition-all mt-2">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
