// ~/hooks/useFilters.ts
import { useSearchParams, useNavigate } from "react-router";

export function useFilters() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getFilterValue = (key: string): string => {
    return searchParams.get(key) || '';
  };

  const activeFiltersCount = (excludeKeys: string[] = ['searchTerm']): number => {
    const params = Array.from(searchParams.entries());
    return params.filter(([key, value]) => {
      if (excludeKeys.includes(key)) return false;
      return value !== '' && value !== 'all' && value !== 'undefined';
    }).length;
  };

  const clearAllFilters = (preserveKeys: string[] = ['searchTerm']): void => {
    const newParams = new URLSearchParams();
    preserveKeys.forEach(key => {
      const value = searchParams.get(key);
      if (value) newParams.set(key, value);
    });
    navigate({ search: newParams.toString() });
  };

  return {
    getFilterValue,
    activeFiltersCount,
    clearAllFilters,
    searchParams,
  };
}