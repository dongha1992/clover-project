import { getDateFormat } from '@utils/common';
import { useEffect, useState } from 'react';

const useSubsPaymentFail = (
  type: string,
  isSubscribing: boolean,
  lastDeliveryDate: string,
  subscriptionPeriod: string,
  status: string
) => {
  const [tooltipMsg, setTooltipMsg] = useState<string>();
  const [subsFailType, setSubsFailType] = useState<string>();
  useEffect(() => {
    if (isSubscribing && subscriptionPeriod === 'UNLIMITED' && status === 'UNPAID') {
      setTooltipMsg('결제 전 다음 회차 구독 식단을 확인해 주세요.');

      switch (type) {
        case 'DISABLED_DESTINATION':
          setTooltipMsg('결제 실패! 배송정보를 변경해 주세요.');
          setSubsFailType('destination');
          break;
        case 'PAYMENT_FAILED':
          setTooltipMsg('결제 실패! 결제수단을 변경해 주세요.');
          setSubsFailType('payment');
          break;
        case 'USER_CANCEL':
          break;
        default:
          break;
      }
    } else if (!isSubscribing && subscriptionPeriod === 'UNLIMITED') {
      if (
        type === 'DISABLED_DESTINATION' ||
        type === 'DISABLED_MENU' ||
        type === 'PAYMENT_FAILED' ||
        type === 'USER_CANCEL'
      ) {
        setSubsFailType('close');
        setTooltipMsg(`${getDateFormat(lastDeliveryDate)} 정기구독이 해지될 예정이에요.`);
      }
    }
  }, [isSubscribing, lastDeliveryDate, subscriptionPeriod, type]);

  return { tooltipMsg, subsFailType };
};
export default useSubsPaymentFail;
