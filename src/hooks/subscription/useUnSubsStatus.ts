import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

type unSubscriptionStatus = string | 'paymentFail' | 'closeReserved' | 'closed';

const useUnSubsStatus = (
  unsubscriptionType: string,
  isSubscribing: boolean,
  status: string,
  subscriptionPaymentDate: string
) => {
  const [unSubsStatus, setUnSubsStatus] = useState<unSubscriptionStatus>();

  useEffect(() => {
    if (unsubscriptionType) {
      if (isSubscribing) {
        // 구독 진행 o

        switch (status) {
          case 'PAYMENT_FAILED':
            setUnSubsStatus('paymentFail');
            break;

          case 'DISABLED_DESTINATION':
            setUnSubsStatus('paymentFail');
            break;

          default:
            setUnSubsStatus('closeReserved');
            break;
        }
      } else {
        // 구독 진행 x
        if (
          Number(dayjs(subscriptionPaymentDate).subtract(5, 'day').format('YYMMDD')) <=
          Number(dayjs().format('YYYYMMDD'))
        ) {
          setUnSubsStatus('closed');
        } else {
          setUnSubsStatus('closeReserved');
        }
      }
    }
  }, [isSubscribing, status, subscriptionPaymentDate, unsubscriptionType]);

  return unSubsStatus;
};
export default useUnSubsStatus;
