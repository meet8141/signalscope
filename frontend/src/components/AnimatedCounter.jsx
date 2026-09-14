import { useEffect, useRef, useState } from 'react';

function DigitScroll({ digit, delay }) {
  const [animate, setAnimate] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    let observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Staggered delay for each digit
        setTimeout(() => setAnimate(true), delay);
        if (nodeRef.current) observer.unobserve(nodeRef.current);
      }
    }, { threshold: 0.1 });
    
    if (nodeRef.current) observer.observe(nodeRef.current);
    
    return () => {
      if (observer) observer.disconnect();
    };
  }, [delay]);

  // Create a strip of numbers to create the "scrolling up and down" spinning effect.
  // We duplicate 0-9 so the digit spins past the first set and settles on the second set.
  const strip = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const targetNum = parseInt(digit, 10);
  
  // We want it to land on the targetNum in the SECOND set of 0-9 to force a longer spin.
  const targetIndex = 10 + targetNum;
  
  return (
    <span ref={nodeRef} className="inline-flex flex-col overflow-hidden h-[1em] leading-none relative align-bottom">
      <span 
        className="flex flex-col transition-transform duration-[3000ms]"
        style={{ 
          transform: animate ? `translateY(-${(targetIndex / strip.length) * 100}%)` : `translateY(0%)`,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' // buttery smooth ease out
        }}
      >
        {strip.map((num, i) => (
          <span key={i} className="h-[1em] flex items-center justify-center">{num}</span>
        ))}
      </span>
    </span>
  );
}

export function AnimatedCounter({ value }) {
  const characters = String(value).split('');
  
  return (
    <span className="inline-flex">
      {characters.map((char, index) => {
        if (/\d/.test(char)) {
          // Stagger the animation slightly left-to-right (100ms per digit)
          return <DigitScroll key={index} digit={char} delay={index * 100} />;
        }
        // Static characters (decimals, commas, percentages)
        return <span key={index} className="inline-flex h-[1em] items-center">{char}</span>;
      })}
    </span>
  );
}
