import React, { useEffect, useState } from 'react';
import checkTimerLimitHelper from '@utils/checkTimerLimitHelper';
import getCustomDate from '@utils/getCustomDate';
import useTimer from '@hooks/useTimer';
import { TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { getFormatTime } from '@utils/getFormatTime';

const CheckTimerByDelivery = () => {
  const [targetDelivery, setTargetDelivery] = useState<string>('');
  const { hours, minutes, seconds } = getCustomDate(new Date());

  // const currentTime = Number(`${getFormatTime(hours)}.${getFormatTime(minutes)}`);
  const currentTime = Number('09.29');

  const getCurrentTargetDelivery = () => {
    const result = checkTimerLimitHelper(currentTime);
    setTargetDelivery(result);
  };

  const getRestTimeTilLimit = (): number => {
    if (minutes >= 30) {
      return (60 - minutes) * 60 - seconds;
    } else {
      return (30 - minutes) * 60 - seconds;
    }
  };

  const { minute, second } = useTimer(getRestTimeTilLimit());

  useEffect(() => {
    getCurrentTargetDelivery();
    getRestTimeTilLimit();
  }, []);

  return (
    <TextH6B
      color={theme.brandColor}
    >{`${targetDelivery}마감 ${minute}:${second} 전`}</TextH6B>
  );
};

export default React.memo(CheckTimerByDelivery);
