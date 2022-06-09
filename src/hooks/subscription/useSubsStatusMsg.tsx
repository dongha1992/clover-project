import { getFormatDate } from '@utils/common';
import { useEffect, useState } from 'react';

export const useSubsStatusMsg = (item: any) => {
  const [msg, setMsg] = useState<string>();
  useEffect(() => {
    switch (item.status) {
      case 'UNPAID':
        setMsg('결제 전 다음 회차 구독 식단을 확인해 주세요.');
        break;
      case 'CANCELED':
        if (item?.isSubscribing === false) {
          setMsg(`${getFormatDate(item.lastDeliveryDate)} 정기구독이 해지될 예정이에요.`);
        }
        break;
      default:
        break;
    }
  }, [item.lastDeliveryDate, item.status]);
  return msg;
};
