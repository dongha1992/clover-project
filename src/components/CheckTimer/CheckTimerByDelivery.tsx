import React, { useEffect, useState } from 'react';
import { TimerTooltip } from '@components/Shared/Tooltip';
import { Obj } from '@model/index';
import { checkTimerLimitHelper, checkIsValidTimer, getTargetDelivery } from '@utils/destination';
import useTimer from '@hooks/useTimer';
import { TextH6B, TextB2R, TextH5B } from '@components/Shared/Text';
import { theme, FlexRow } from '@styles/theme';
import { useDispatch, useSelector } from 'react-redux';
import { destinationForm } from '@store/destination';
import { INIT_TIMER } from '@store/order';
import { getCurrentDate } from '@utils/common/dateHelper';

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
  const dispatch = useDispatch();
  const { timer } = useTimer();
  const { locationStatus } = useSelector(destinationForm);
  const timerResult = checkTimerLimitHelper(locationStatus);
  if (checkIsValidTimer(getCurrentDate(), timerResult)) {
    dispatch(INIT_TIMER({ isInitDelay: false })); //타이머 시작
  } else {
    dispatch(INIT_TIMER({ isInitDelay: true })); //타이머 정지
  }

  const deliveryType = getTargetDelivery(timerResult);

  const msgHandler = () => {
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
