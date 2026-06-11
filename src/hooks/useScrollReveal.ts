import { useEffect } from 'react';

export function useScrollReveal(deps: any[] = []) {
  useEffect(() => {
    function triggerReveals() {
      document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          el.classList.add('visible');
        }
      });
    }
    triggerReveals();
    window.addEventListener('scroll', triggerReveals);
    return () => window.removeEventListener('scroll', triggerReveals);
  }, deps);
}
