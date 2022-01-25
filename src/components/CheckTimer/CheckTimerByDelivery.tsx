import React, { useEffect, useState } from 'react';
import checkTimerLimitHelper from '@utils/checkTimerLimitHelper';
import getCustomDate from '@utils/getCustomDate';
import useTimer from '@hooks/useTimer';

const CheckTimerByDelivery = () => {
  const [targetDelivery, setTargetDelivery] = useState<string>('');
  const { hours, minutes } = getCustomDate(new Date());

  const getCurrentTargetDelivery = () => {
    // const currentTime = Number(`${formatTime(hours)}.${formatTime(minutes)}`);
    const currentTime = Number('09.21');
    const result = checkTimerLimitHelper(currentTime);

    setTargetDelivery(result);
  };

  const { minute, second } = useTimer(5);

  useEffect(() => {
    getCurrentTargetDelivery();
  }, []);
  return <div>{`${targetDelivery}마감 ${minute}:${second}전`}</div>;
};

export default React.memo(CheckTimerByDelivery);
