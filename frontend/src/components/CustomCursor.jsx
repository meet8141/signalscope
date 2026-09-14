import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function CustomCursor() {
  const location = useLocation();
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);

  // Reset states on route change to prevent stuck cursor
  useEffect(() => {
    setLinkHovered(false);
    setClicked(false);
  }, [location.pathname]);

  // Use refs for positions to avoid re-renders
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const requestRef = useRef();

  useEffect(() => {
    const updatePosition = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (hidden) setHidden(false);
      
      // Update dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const render = () => {
      // Lerp (linear interpolation) for smooth trailing effect
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      requestRef.current = requestAnimationFrame(render);
    };
    
    requestRef.current = requestAnimationFrame(render);

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);
    const handleMouseDown = () => {
      setClicked(true);
      setClickEffect(true);
      setTimeout(() => setClickEffect(false), 500);
    };
    const handleMouseUp = () => setClicked(false);

    // Track if a link or button is hovered
    const handleMouseOver = (e) => {
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.cursor-pointer')) {
        setLinkHovered(true);
      } else {
        setLinkHovered(false);
      }
    };

    // Track text selection to trigger scale effect (mimicking 'click' feel)
    const handleSelection = () => {
      if (window.getSelection().toString().length > 0) {
        setClicked(true);
      } else {
        setClicked(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('selectionchange', handleSelection);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('selectionchange', handleSelection);
      cancelAnimationFrame(requestRef.current);
    };
  }, [hidden]);

  return (
    <>
      {/* Main Dot Outer Container (Handles Position) */}
      <div ref={dotRef} className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block" style={{ willChange: 'transform' }}>
        {/* Main Dot Inner Container (Handles Animations & Visuals) */}
        <div 
          className={`transition-all duration-200 ease-out rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center mix-blend-difference
            ${hidden ? 'opacity-0' : 'opacity-100'} 
            ${hidden ? 'opacity-0' : 'opacity-100'} ${'w-3 h-3 bg-acid-lime'} ${clicked ? 'scale-50' : 'scale-100'} 
            ${clicked ? 'scale-50' : 'scale-100'}`}
        />
      </div>
      
      {/* Trailing Ring Outer Container */}
      <div ref={ringRef} className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block" style={{ willChange: 'transform' }}>
        {/* Trailing Ring Inner Container */}
        <div 
          className={`transition-all duration-300 ease-out rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center mix-blend-difference
            ${hidden ? 'opacity-0 scale-50' : 'opacity-100'}
            ${linkHovered ? 'w-24 h-24 bg-acid-lime/30 blur-sm' : 'w-10 h-10 border-[1.5px] border-white bg-transparent'} 
            ${clicked ? 'scale-75' : 'scale-100'}`}
        />
      </div>
      
      {/* Click Ripple Effect */}
      {clickEffect && (
        <div 
          className="fixed top-0 left-0 pointer-events-none z-[9997] hidden md:block"
          style={{ transform: `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)` }}
        >
          <div className="w-8 h-8 border border-acid-lime/60 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping" />
        </div>
      )}
    </>
  );
}
