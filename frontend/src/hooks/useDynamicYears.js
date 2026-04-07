import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const parseYears = (values = []) => {
  const years = [];
  values.forEach((raw) => {
    const txt = String(raw ?? '').trim();
    const match = txt.match(/(19|20)\d{2}/g);
    if (match) {
      match.forEach((m) => years.push(Number(m)));
    }
  });
  const unique = Array.from(new Set(years.filter((y) => Number.isFinite(y))));
  unique.sort((a, b) => b - a); // newest first
  return unique;
};

const fetchYears = async () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const url = `${baseUrl}/shared/years`;
  const res = await axios.get(url);
  return Array.isArray(res.data?.years) ? parseYears(res.data.years) : [];
};

export default function useDynamicYears() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshYears = useCallback(async () => {
    try {
      setLoading(true);
      const list = await fetchYears();
      setYears(list);
    } catch {
      // keep previous years if fetch fails
    } finally {
      setLoading(false);
    }
  }, []);

  const mergeYears = useCallback((extraYears = []) => {
    setYears((prev) => {
      const merged = Array.from(new Set([...(prev || []), ...parseYears(extraYears)]));
      merged.sort((a, b) => b - a);
      return merged;
    });
  }, []);

  useEffect(() => {
    refreshYears();
    // run once on mount only
  }, [refreshYears]);

  return { years, loading, refreshYears, mergeYears };
}
