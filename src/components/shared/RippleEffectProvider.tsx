'use client';

import React, { useEffect } from 'react';

export function RippleEffectProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Do not create a ripple on common interactive elements or their children.
      if (target.closest('button, a, input, textarea, select, label, [role^="button"], [role^="link"], [role^="checkbox"], [role^="radio"], [role^="tab"], [role^="menuitem"]')) {
        return;
      }
      
      const ripple = document.createElement('div');
      
      document.body.appendChild(ripple);

      ripple.className = 'ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      
      // Clean up the ripple element after the animation is done to prevent DOM clutter.
      const handleAnimationEnd = () => {
        ripple.removeEventListener('animationend', handleAnimationEnd);
        if (ripple.parentElement) {
            ripple.parentElement.removeChild(ripple);
        }
      };
      
      ripple.addEventListener('animationend', handleAnimationEnd);
    };

    document.addEventListener('click', handleClick);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return <>{children}</>;
}
