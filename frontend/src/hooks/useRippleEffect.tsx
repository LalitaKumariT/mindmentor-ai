import React, { useState, useCallback, useRef, FC, useEffect } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface UseRippleEffectReturn {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  RippleEffect: FC;
}

// Add the ripple animation styles to the document head
const addRippleStyles = () => {
  if (typeof document === 'undefined') return;
  
  const styleId = 'ripple-effect-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes ripple {
      to {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
};

export const useRippleEffect = (): UseRippleEffectReturn => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const cleanupRef = useRef<number | null>(null);

  // Add the ripple styles when the component mounts
  useEffect(() => {
    addRippleStyles();
    return () => {
      if (cleanupRef.current) {
        clearTimeout(cleanupRef.current);
      }
    };
  }, []);

  const onClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple: Ripple = {
      id: nextId.current++,
      x,
      y,
      size,
    };

    setRipples(prevRipples => [...prevRipples, newRipple]);

    if (cleanupRef.current) {
      clearTimeout(cleanupRef.current);
    }

    cleanupRef.current = window.setTimeout(() => {
      setRipples([]);
      cleanupRef.current = null;
    }, 600);
  }, []);

  const RippleEffect: FC = useCallback(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {ripples.map((rippleItem) => (
        <span
          key={rippleItem.id}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            pointerEvents: 'none',
            left: `${rippleItem.x}px`,
            top: `${rippleItem.y}px`,
            width: `${rippleItem.size}px`,
            height: `${rippleItem.size}px`,
            background: 'rgba(255, 255, 255, 0.7)',
            animation: 'ripple 600ms linear',
          }}
        />
      ))}
    </div>
  ), [ripples]);

  return { onClick, RippleEffect };
};