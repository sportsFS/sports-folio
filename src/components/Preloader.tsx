import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

const SESSION_KEY = 'sportsfolio_entry_loader_seen';

export default function Preloader() {
  const [visible, setVisible] = useState(() => sessionStorage.getItem(SESSION_KEY) !== '1');

  useEffect(() => {
    if (!visible) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    const fallback = window.setTimeout(() => setVisible(false), 2000);
    return () => window.clearTimeout(fallback);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      id="preloader"
      role="status"
      aria-label="Loading SPORTSFOLIO"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) setVisible(false);
      }}
    >
      <img src={logo} alt="" className="preloader-logo" />
      <div className="preloader-bar" aria-hidden="true">
        <div className="preloader-bar-fill" />
      </div>
    </div>
  );
}
