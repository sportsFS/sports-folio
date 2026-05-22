import { useState, useEffect } from 'react';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="preloader" className={hidden ? 'hidden' : ''}>
      <div className="preloader-logo">SPORTS FOLIO</div>
      <div className="preloader-bar">
        <div className="preloader-bar-fill" />
      </div>
    </div>
  );
}
