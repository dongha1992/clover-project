import { useState, useRef, useCallback, useEffect } from 'react';
import { useInterval } from '@hooks/useInterval';
import { getFormatTime } from '@utils/getFormatTime';
import { useDispatch } from 'react-redux';
import { SET_TIMER_STATUS } from '@store/order';
import getCustomDate from '@utils/getCustomDate';
import { getFormatTimeStr } from '@utils/getFormatTime';

const AUTH_TIME_LIMIT = 299;
const DELIVERY_TIME_LIMIT = 1799;

const useTimer = () => {
  const { minutes, seconds } = getCustomDate(new Date());

  const [delay, setDelay] = useState<number | null>(1000);
  const [timer, setTimer] = useState<string>('');

  const timerRef = useRef<number>(DELIVERY_TIME_LIMIT);
  const dispatch = useDispatch();

  const getRestTimeTilLimit = (): number => {
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

  useEffect(() => {
    if (timer === '00:00') {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: false }));
      setDelay(null);
    }
  }, [timer]);

  useEffect(() => {
    timerRef.current = getRestTimeTilLimit();
  }, [minutes, seconds]);

  useInterval(timerHandler, delay);

  return {
    timer,
  };
};

export default useTimer;
