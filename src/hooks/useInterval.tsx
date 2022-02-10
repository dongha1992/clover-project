import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number | null, run = false) => {
  const tick = useRef(callback);

  useEffect(() => {
    tick.current = callback;
    if (run) tick.current();
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      let timerId = setInterval(() => tick.current(), delay);
      return () => clearInterval(timerId);
    }
  }, [delay]);
};
