import { useState, useRef, useCallback, useEffect } from 'react';
import { useInterval } from '@hooks/useInterval';
import { useDispatch } from 'react-redux';
import { SET_TIMER_STATUS } from '@store/order';
import getCustomDate from '@utils/getCustomDate';
import { getFormatTimeStr, getFormatTime } from '@utils/getFormatTime';

const AUTH_TIME_LIMIT = 299;
const DELIVERY_TIME_LIMIT = 1799;

const useTimer = () => {
  const [delay, setDelay] = useState<number | null>(500);
  const [timer, setTimer] = useState<string>('');

  const timerRef = useRef<number>(DELIVERY_TIME_LIMIT);
  const dispatch = useDispatch();

  const getRestTimeTilLimit = (): number => {
    const { minutes, seconds } = getCustomDate(new Date());
    if (minutes >= 30) {
      return (60 - minutes) * 60 - seconds;
    } else {
      return (30 - minutes) * 60 - seconds;
    }
  };

  const timerHandler = useCallback((): void => {
    const mm = Math.floor(timerRef.current / 60);
    const ss = Math.floor(timerRef.current % 60);

    timerRef.current = getRestTimeTilLimit();

    setTimer(getFormatTimeStr(mm, ss));
  }, [timer, getRestTimeTilLimit]);

  useInterval(() => {
    timerHandler();
  }, delay);

  useEffect(() => {
    if (timer === '00:00') {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: false }));
      setDelay(null);
    }
  }, [timer]);

  useEffect(() => {
    timerRef.current = getRestTimeTilLimit();
  }, [timer]);

  return {
    timer,
  };
};

export default useTimer;
