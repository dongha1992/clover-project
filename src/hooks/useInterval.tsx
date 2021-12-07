import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number | null) => {
  const tick = useRef(callback);

  useEffect(() => {
    tick.current = callback;
  }, [callback]);

  useEffect(() => {
    console.log(delay);
    if (delay !== null) {
      let id = setInterval(() => tick.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
