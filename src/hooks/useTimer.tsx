import { useState, useRef, useCallback, useEffect } from 'react';
import { useInterval } from '@hooks/useInterval';
import { getFormatTime } from '@utils/getFormatTime';
import { useDispatch } from 'react-redux';
import { SET_TIMER_STATUS } from '@store/order';

const AUTH_LIMIT = 300;

const useTimer = (limitTime?: number) => {
  const dispatch = useDispatch();
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [delay, setDelay] = useState<number | null>(1000);
  const timerRef = useRef(limitTime || AUTH_LIMIT);

  const _minute = Math.floor(timerRef.current / 60);
  const _second = Math.floor(timerRef.current % 60);

  const timerHandler = useCallback((): void => {
    timerRef.current -= 1;

    setMinute(_minute);
    setSecond(_second);
  }, [second, minute]);

  useEffect(() => {
    if (timerRef.current < 0) {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: false }));
      setDelay(null);
    }
  }, [minute, second]);

  useInterval(timerHandler, delay);

  return {
    minute: getFormatTime(minute || _minute),
    second: getFormatTime(second || _second),
  };
};

export default useTimer;
