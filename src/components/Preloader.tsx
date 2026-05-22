import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="preloader" className={hidden ? 'hidden' : ''}>
      <img src={logo} alt="Sports Folio" className="preloader-logo" />
      <div className="preloader-bar">
        <div className="preloader-bar-fill" />
      </div>
    </div>
  );
}
