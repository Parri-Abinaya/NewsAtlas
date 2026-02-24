import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCountries } from '../services/api';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function CountrySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) { setResults([]); setOpen(false); return; }
    searchCountries(debouncedQuery).then(r => {
      setResults(r);
      setOpen(r.length > 0);
    }).catch(() => {});
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = useCallback((code) => {
    setQuery('');
    setOpen(false);
    navigate(`/country/${code}`);
  }, [navigate]);

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search any country..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
      />
      {open && (
        <div className="search-results">
          {results.map(r => (
            <div
              key={r.code}
              className="search-result-item"
              onClick={() => handleSelect(r.code)}
            >
              {r.flag && <img src={r.flag} alt={r.name} style={{ width: 28, borderRadius: 3 }} />}
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>{r.region} {r.capital && `• ${r.capital}`}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
