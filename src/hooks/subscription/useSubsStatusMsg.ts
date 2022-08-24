import { getFormatDate } from '@utils/common';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export const useSubsStatusMsg = (item: any) => {
  const [subsStatusmsg, setSubsStatusMsg] = useState<string>();
  const [subsStatusBoldmsg, setSubsStatusBoldMsg] = useState<string>();
  useEffect(() => {
    if (item.isSubscribing && item.subscriptionPeriod === 'UNLIMITED') {
      if (
        item.status === 'UNPAID' &&
        item?.unsubscriptionType !== 'DISABLED_DESTINATION' &&
        item?.unsubscriptionType !== 'DISABLED_MENU' &&
        item?.unsubscriptionType !== 'PAYMENT_FAILED' &&
        item?.unsubscriptionType !== 'USER_CANCEL'
      ) {
        // 구독주문 생성 후, 구독 결제 전, 결제실패나 해지사유가 없을때

        setSubsStatusBoldMsg(`구독 ${item.subscriptionRound}회차 ${item.subscriptionDiscountRate}% 할인!`);
        setSubsStatusMsg(`${getFormatDate(item.subscriptionPaymentDate)} 결제되는 구독 식단을 확인해 주세요!`);
      } else if (
        (item.status === 'UNPAID' && item?.unsubscriptionType === 'DISABLED_DESTINATION') ||
        item?.unsubscriptionType === 'DISABLED_MENU' ||
        item?.unsubscriptionType === 'PAYMENT_FAILED' ||
        item?.unsubscriptionType === 'USER_CANCEL'
      ) {
        // 구독주문 생성 후, 구독 결제 전, 구독 해지 전, 결제 실패 시
        setSubsStatusBoldMsg('결제 실패!');
        switch (item.unsubscriptionType) {
          case 'DISABLED_DESTINATION':
            setSubsStatusMsg(`오늘 오후 9시 전까지 배송정보를 변경해 주세요.`);
            break;
          case 'PAYMENT_FAILED':
            setSubsStatusMsg(`오늘 오후 9시 전까지 결제수단을 변경해 주세요.`);
            break;
        }
      }
    } else if (!item.isSubscribing && item.subscriptionPeriod === 'UNLIMITED') {
      if (item.status !== 'UNPAID') {
        // 구독 진행중 다음회차 구독주문 생성 실패,
        switch (item.unsubscriptionType) {
          case 'DISABLED_DESTINATION':
            setSubsStatusMsg(
              `이용 중인 배송지로 배송이 불가하여 ${getFormatDate(
                item.lastDeliveryDateOrigin
              )} 자동으로 구독 해지될 예정이에요.`
            );
            break;
          case 'DISABLED_MENU':
            setSubsStatusMsg(
              `구독 식단이 종료되어 ${getFormatDate(item.lastDeliveryDateOrigin)} 자동으로 구독 해지될 예정이에요.`
            );
            break;
          case 'USER_CANCEL':
            setSubsStatusMsg(`${getFormatDate(item.lastDeliveryDateOrigin)} 구독 해지될 예정이에요.`);
            break;
        }
      } else {
        switch (item.unsubscriptionType) {
          case 'DISABLED_MENU':
            // 구독 결제 전, 다음회차 구독주문 생성 실패
            setSubsStatusBoldMsg('결제 실패!');
            setSubsStatusMsg(`구독 식단 문제로 정기구독이 해지됐어요.`);
            break;
          case 'DISABLED_DESTINATION':
            setSubsStatusBoldMsg('결제 실패!');
            setSubsStatusMsg(`${getFormatDate(item.lastDeliveryDateOrigin)} 자동으로 구독 해지될 예정이에요.`);
            break;
          case 'PAYMENT_FAILED':
            setSubsStatusBoldMsg('결제 실패!');
            setSubsStatusMsg(`${getFormatDate(item.lastDeliveryDateOrigin)} 자동으로 구독 해지될 예정이에요.`);
            break;
        }
      }
    }
  }, []);
  return { subsStatusmsg, subsStatusBoldmsg };
};
