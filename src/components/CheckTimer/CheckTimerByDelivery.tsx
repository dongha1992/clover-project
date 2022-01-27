import React, { useEffect, useState } from 'react';
import checkTimerLimitHelper from '@utils/checkTimerLimitHelper';
import useTimer from '@hooks/useTimer';
import { TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { getFormatTime } from '@utils/getFormatTime';
import { TimerTooltip } from '@components/Shared/Tooltip';
import { Obj } from '@model/index';
interface IProps {
  isTooltip?: boolean;
}
const CheckTimerByDelivery = ({ isTooltip }: IProps) => {
  const [targetDelivery, setTargetDelivery] = useState<string>('');
  const [isSetTimer, setIsSetTimer] = useState('');

  const msgMapper: Obj = {
    스팟저녁: '오늘 17시 전 도착',
    스팟점심: '오늘 12시 전 도착',
    택배배송: '오늘 발송',
    새벽배송: '내일 새벽 7시 전 도착',
  };

  // const currentTime = Number(`${getFormatTime(hours)}.${getFormatTime(minutes)}`);
  const currentTime = Number('09.29');

  const getCurrentTargetDelivery = () => {
    const result = checkTimerLimitHelper(currentTime);
    setTargetDelivery(result);
  };

  const { timer } = useTimer();

  useEffect(() => {
    getCurrentTargetDelivery();
  }, []);

  useEffect(() => {
    if (timer) {
      msgHandler();
    }
  }, [timer]);

  const msgHandler = () => {
    setIsSetTimer(
      `${targetDelivery} 마감 ${timer} 전 (${msgMapper[targetDelivery]})`
    );
  };

  if (isTooltip) {
    return (
      <TimerTooltip
        message={isSetTimer}
        bgColor={theme.brandColor}
        color={theme.white}
        minWidth="78px"
      />
    );
  } else {
    return <TextH6B color={theme.brandColor}>{isSetTimer}</TextH6B>;
  }
};

export default React.memo(CheckTimerByDelivery);
