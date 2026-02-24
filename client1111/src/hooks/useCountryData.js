import { useState, useEffect } from 'react';
import { getCountryData } from '../services/api';

export function useCountryData(code) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    setError(null);
    getCountryData(code)
      .then(setData)
      .catch(err => setError(err.response?.data?.error || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, [code]);

  return { data, loading, error };
}
