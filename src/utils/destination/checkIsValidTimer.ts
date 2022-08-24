import { TResult } from './checkTimerLimitHelper';
import { getWeekDay } from '@utils/common/dateHelper';

const checkIsValidTimer = (date: string, deliveryType: TResult): boolean => {
  const weekDay = getWeekDay(date);
  // 요일 체크
  const isWeekends = ['토', '일'].includes(weekDay);

  const isRolling = ['스팟저녁', '새벽택배', '새벽택배N일', '스팟점심', '스팟점심N일'].includes(deliveryType);

  return !(isWeekends || isRolling || !deliveryType);
};

export default checkIsValidTimer;
