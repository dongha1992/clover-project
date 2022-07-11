import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { todayN, subsClosedDateN } from '@utils/common';

dayjs.locale('ko');

type unSubscriptionStatus = string | 'closeReserved' | 'closed';
type isChanged = boolean;

const useUnSubsStatus = (
  unsubscriptionType: string | null,
  isSubscribing: boolean,
  status: string,
  subscriptionPaymentDate: string
) => {
  const [unSubsStatus, setUnSubsStatus] = useState<unSubscriptionStatus>();
  const [isChanged, setIsChanged] = useState<isChanged>(false);

  useEffect(() => {
    if (unsubscriptionType) {
      if (isSubscribing) {
        // 구독 진행 o
        switch (unsubscriptionType) {
          case 'PAYMENT_FAILED':
            setUnSubsStatus('closeReserved');
            setIsChanged(true);
            break;

          case 'DISABLED_DESTINATION':
            setUnSubsStatus('closeReserved');
            setIsChanged(true);
            break;

          default:
            setUnSubsStatus('closeReserved');
            break;
        }
      } else {
        // 구독 진행 x

        switch (unsubscriptionType) {
          case 'PAYMENT_FAILED':
            setUnSubsStatus('closed');
            setIsChanged(true);
            break;

          case 'DISABLED_DESTINATION':
            setUnSubsStatus('closed');
            setIsChanged(true);
            break;

          default:
            if (subsClosedDateN(subscriptionPaymentDate) <= todayN()) {
              setUnSubsStatus('closed');
            } else {
              setUnSubsStatus('closeReserved');
            }
            break;
        }
      }
    }
  }, [isSubscribing, status, subscriptionPaymentDate, unsubscriptionType]);

  return { unSubsStatus, isChanged };
};
export default useUnSubsStatus;
