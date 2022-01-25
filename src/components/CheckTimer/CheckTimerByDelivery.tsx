import React, { useEffect, useState } from 'react';
import checkTimerLimitHelper from '@utils/checkTimerLimitHelper';
import getCustomDate from '@utils/getCustomDate';
import useTimer from '@hooks/useTimer';
import { TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { getFormatTime } from '@utils/getFormatTime';

const CheckTimerByDelivery = () => {
  const [targetDelivery, setTargetDelivery] = useState<string>('');
  const { hours, minutes } = getCustomDate(new Date());

  const getCurrentTargetDelivery = () => {
    // const currentTime = Number(`${getFormatTime(hours)}.${getFormatTime(minutes)}`);
    const currentTime = Number('09.21');
    const result = checkTimerLimitHelper(currentTime);

    setTargetDelivery(result);
  };

  const { minute, second } = useTimer(5);

  useEffect(() => {
    getCurrentTargetDelivery();
  }, []);
  return (
    <TextH6B
      color={theme.brandColor}
    >{`${targetDelivery}마감 ${minute}:${second} 전`}</TextH6B>
  );
};

export default React.memo(CheckTimerByDelivery);
