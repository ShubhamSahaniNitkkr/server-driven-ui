import { useCallback, useEffect, useState } from 'react';

function getPathFromLocation(): string {
  const path = window.location.pathname;
  if (path === '/' || path === '') return '/showcase';
  return path.replace(/\/$/, '') || '/showcase';
}

export function usePagePath() {
  const [path, setPath] = useState(getPathFromLocation);

  useEffect(() => {
    const handlePopState = () => setPath(getPathFromLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setInitialPath = useCallback((initialPath: string) => {
    setPath(initialPath);
  }, []);

  const navigate = useCallback((newPath: string) => {
    window.history.pushState({}, '', newPath);
    setPath(newPath);
  }, []);

  return { path, navigate, setInitialPath };
}
