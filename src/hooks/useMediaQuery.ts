import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listner = () => {
      setMatches(media.matches);
    };

    media.addEventListener('change', listner);
    return () => media.removeEventListener('change', listner);
  }, [matches, query]);

  return matches;
};
