import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, showPage } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  function handleExpand() {
    if (expanded) {
      closeSearch();
      return;
    }
    setExpanded(true);
  }

  function closeSearch() {
    setQuery('');
    setSearchQuery('');
    setExpanded(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      setSearchQuery(query.trim());
      showPage('shop');
      if (!query.trim()) setExpanded(false);
    }
    if (e.key === 'Escape') {
      closeSearch();
    }
  }

  function handleClear() {
    closeSearch();
  }

  return (
    <div
      className={`search-bar-wrapper ${expanded ? 'expanded' : ''}`}
    >
      <button className="search-icon-btn" onClick={handleExpand} aria-label="Search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      {expanded && (
        <>
          <div className="search-bar-glow" />
          <input
            ref={inputRef}
            className="search-bar-input"
            type="text"
            placeholder="Search gear..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button className="search-clear-btn" onClick={handleClear} aria-label="Clear search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
}
