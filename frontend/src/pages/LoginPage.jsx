import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../firebase';
import { useEffect, useState } from 'react';

export function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithGoogle();
      // After successful login, user will be redirected via the useEffect
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center pt-17 min-h-[calc(100vh-theme(space.17))]">
      <div className="w-full max-w-md p-8 md:p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden group mx-4">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-acid-lime/20 blur-[80px] -z-10 transition-all duration-700 group-hover:bg-acid-lime/30"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-acid-lime/10 blur-[60px] -z-10"></div>
        
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-white/5 rounded-full border border-white/10 shadow-[0_0_15px_rgba(212,242,104,0.1)]">
            <Shield className="text-acid-lime w-12 h-12" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-serif tracking-tight">
              Welcome to <span className="font-bold text-acid-lime">SignalScope</span>
            </h1>
            <p className="text-white/60 font-mono text-sm">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="w-full p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
              {error}
            </div>
          )}

          <div className="w-full pt-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full relative group/btn flex items-center justify-center gap-3 py-3.5 px-6 bg-white hover:bg-off-white text-stone-black rounded-xl font-bold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
          </div>
          
          <p className="text-xs text-white/40 font-mono mt-8">
            By connecting, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
