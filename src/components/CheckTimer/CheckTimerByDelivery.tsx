import React, { useEffect, useState } from 'react';
import { TimerTooltip } from '@components/Shared/Tooltip';
import { Obj } from '@model/index';
import { checkTimerLimitHelper, checkIsValidTimer } from '@utils/destination';
import useTimer from '@hooks/useTimer';
import { TextH6B, TextB2R, TextH5B } from '@components/Shared/Text';
import { theme, FlexRow } from '@styles/theme';

interface IProps {
  isTooltip?: boolean;
  isCartSheet?: boolean;
}

const msgMapper: Obj = {
  스팟저녁: '오늘 17시 전 도착',
  스팟점심: '오늘 12시 전 도착',
  택배배송: '오늘 발송',
  새벽배송: '내일 새벽 7시 전 도착',
};

const CheckTimerByDelivery = ({ isTooltip, isCartSheet }: IProps) => {
  const [targetDelivery, setTargetDelivery] = useState<string>('');
  const [timerMsg, setTimerMsg] = useState('');

  const { timer } = useTimer();

  let deliveryType = checkIsValidTimer(checkTimerLimitHelper()).replace('타이머', '');
  console.log(deliveryType, 'deliveryType');

  const msgHandler = () => {
    /* TODO: state 관리 필요? */
    setTimerMsg(`${targetDelivery} 마감 ${timer} 전 ${isTooltip ? `(${msgMapper[targetDelivery]})` : ''}`);
  };

  useEffect(() => {
    setTargetDelivery(deliveryType);
  }, []);

  useEffect(() => {
    if (timer) {
      msgHandler();
    }
  }, [timer]);

  if (!timerMsg) {
    return null;
  }

  if (isTooltip) {
    return <TimerTooltip message={timerMsg} bgColor={theme.brandColor} color={theme.white} minWidth="78px" />;
  } else if (isCartSheet) {
    return (
      <FlexRow>
        <TextH5B padding="0 4px 0 0">{deliveryType}</TextH5B>
        <TextB2R>{`마감 ${timer} 전 (${msgMapper[targetDelivery]})`}</TextB2R>
      </FlexRow>
    );
  } else {
    return <TextH6B color={theme.brandColor}>{timerMsg}</TextH6B>;
  }
};

export default React.memo(CheckTimerByDelivery);
