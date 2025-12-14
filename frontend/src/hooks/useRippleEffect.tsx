import React, { useState, useCallback, useRef, FC } from 'react';

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

export const useRippleEffect = (): UseRippleEffectReturn => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const cleanupRef = useRef<number | null>(null);

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
      {ripples.map((rippleItem, index) => (
        <span
          key={rippleItem.id}
          className="absolute bg-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${rippleItem.x}px`,
            top: `${rippleItem.y}px`,
            width: `${rippleItem.size}px`,
            height: `${rippleItem.size}px`,
            animation: 'ripple 600ms linear',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  ), [ripples]);

  return { onClick, RippleEffect };
};