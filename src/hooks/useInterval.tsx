import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number | null) => {
  const tick = useRef(callback);

  useEffect(() => {
    tick.current = callback;
    tick.current();
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      let timerId = setInterval(() => tick.current(), delay);
      return () => clearInterval(timerId);
    }
  }, [delay]);
};
