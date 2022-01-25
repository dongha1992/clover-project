import { useState, useRef, useCallback, useEffect } from 'react';
import { useInterval } from '@hooks/useInterval';
import { getFormatTime } from '@utils/getFormatTime';

const AUTH_LIMIT = 300;

const useTimer = (limitTime?: number) => {
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [delay, setDelay] = useState<number | null>(1000);
  const timerRef = useRef(limitTime || AUTH_LIMIT);

  const timerHandler = useCallback((): void => {
    const _minute = Math.floor(timerRef.current / 60);
    const _second = Math.floor(timerRef.current % 60);

    timerRef.current -= 1;

    setMinute(_minute);
    setSecond(_second);
  }, [second, minute]);

  useInterval(timerHandler, delay);

  useEffect(() => {
    if (timerRef.current < 0) {
      setDelay(null);
    }
  }, [second]);

  return { minute: getFormatTime(minute), second: getFormatTime(second) };
};

export default useTimer;
