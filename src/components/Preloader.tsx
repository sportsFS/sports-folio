import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

export default function Preloader() {
  const [hidden, setHidden] = useState(() => sessionStorage.getItem('preloader_seen') === '1');

  useEffect(() => {
    if (hidden) return;
    const t = setTimeout(() => {
      sessionStorage.setItem('preloader_seen', '1');
      setHidden(true);
    }, 2200);
    return () => clearTimeout(t);
  }, [hidden]);

  return (
    <div id="preloader" className={hidden ? 'hidden' : ''}>
      <img src={logo} alt="Sports Folio" className="preloader-logo" />
      <div className="preloader-bar">
        <div className="preloader-bar-fill" />
      </div>
    </div>
  );
}
