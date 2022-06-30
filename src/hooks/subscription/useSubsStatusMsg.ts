import { getFormatDate } from '@utils/common';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export const useSubsStatusMsg = (item: any) => {
  const [subsStatusmsg, setSubsStatusMsg] = useState<string>();
  const [subsStatusBoldmsg, setSubsStatusBoldMsg] = useState<string>();
  useEffect(() => {
    const year = dayjs(item.firstDeliveryDateOrigin).format('YYYY');
    if (item.isSubscribing) {
      if (
        item.status === 'UNPAID' &&
        item?.unsubscriptionType !== 'DISABLED_DESTINATION' &&
        item?.unsubscriptionType !== 'DISABLED_MENU' &&
        item?.unsubscriptionType !== 'PAYMENT_FAILED' &&
        item?.unsubscriptionType !== 'USER_CANCEL'
      ) {
        setSubsStatusBoldMsg(`구독 ${item.subscriptionRound}회차 ${item.subscriptionDiscountRate}% 할인!`);
        if ([30, 31, 1, 2].includes(Number(dayjs(item.firstDeliveryDateOrigin).format('DD')))) {
          //첫 구독시작일이 [30일, 31일, 1일, 2일]일때 자동결제일: 27일
          const month = dayjs(item.firstDeliveryDateOrigin).subtract(1, 'month').format('M');
          const dd = dayjs(`${year}-${month}-27`).format('dd');
          setSubsStatusMsg(`${month}월 27일 (${dd}) 결제되는 구독 식단을 확인해 주세요!`);
        } else {
          //첫 구독시작일이 3일 ~ 29일 이면 자동결제일: D-2
          const month = dayjs(item.firstDeliveryDateOrigin).format('M');
          const day = dayjs(item.firstDeliveryDateOrigin).subtract(2, 'day').format('DD');
          const dd = dayjs(`${year}-${month}-${day}`).format('dd');
          setSubsStatusMsg(`${month}월 ${day}일 (${dd}) 결제되는 구독 식단을 확인해 주세요!`);
        }
      } else if (
        item?.unsubscriptionType === 'DISABLED_DESTINATION' ||
        item?.unsubscriptionType === 'DISABLED_MENU' ||
        item?.unsubscriptionType === 'PAYMENT_FAILED' ||
        item?.unsubscriptionType === 'USER_CANCEL'
      ) {
        setSubsStatusBoldMsg('결제 실패!');
        switch (item.unsubscriptionType) {
          case 'DISABLED_DESTINATION':
            setSubsStatusMsg(`오늘 오후 9시 전까지 배송정보를 변경해 주세요.`);
            break;
          case 'PAYMENT_FAILED':
            setSubsStatusMsg(`오늘 오후 9시 전까지 결제수단을 변경해 주세요.`);
            break;
          default:
            break;
        }
      }
    } else {
      if (item.subscriptionPeriod !== 'UNLIMITED') {
        if (item.status !== 'UNPAID') {
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
            case 'PAYMENT_FAILED':
              break;
            case 'USER_CANCEL':
              break;
            default:
              break;
          }
        } else {
          if (item.unsubscriptionType === 'DISABLED_MENU') setSubsStatusMsg(`구독 식단 문제로 정기구독이 해지됐어요.`);
        }
      }
    }
  }, []);
  return { subsStatusmsg, subsStatusBoldmsg };
};
