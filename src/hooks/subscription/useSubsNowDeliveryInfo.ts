/* eslint-disable react-hooks/exhaustive-deps */
import { SUBS_DELIVERY_STATUS } from '@constants/subscription';
import { IGetOrders, IOrderDeliverie } from '@model/index';
import { getFormatDate } from '@utils/common';
import { useEffect, useRef, useState } from 'react';

const useSubsNowDeliveryInfo = (item: IGetOrders) => {
  const [cards, setCards] = useState<any>([]);
  const cardsRef = useRef<IOrderDeliverie[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState({
    status: '',
    round: '',
    deliveryDate: '',
  });

  useEffect(() => {
    let arr: any = [];
    for (let i = 0; i < item.orderDeliveries.length; i++) {
      if (
        item.currentDeliveryDate === item.orderDeliveries[i].deliveryDate ||
        (!item.currentDeliveryDate &&
          item.orderDeliveries[i].status !== 'CANCELED' &&
          item.orderDeliveries[i].status !== 'COMPLETED')
      ) {
        arr.push(item.orderDeliveries[i]);
      } else if (
        !item.currentDeliveryDate &&
        (item.orderDeliveries[i].status === 'CANCELED' || item.orderDeliveries[i].status === 'COMPLETED')
      ) {
        arr = [item.orderDeliveries[item.orderDeliveries.length - 1]];
      }
    }
    cardsRef.current = arr;
    setCards(arr);
  }, []);

  useEffect(() => {
    if (item.status === 'UNPAID') {
      setDeliveryInfo({
        status: `구독예정`,
        round: `(${item?.subscriptionRound}회차)`,
        deliveryDate: `${getFormatDate(cardsRef.current[0].deliveryDate)} 시작`,
      });
    } else {
      if (cardsRef.current.length > 1) {
        setDeliveryInfo({
          status: SUBS_DELIVERY_STATUS[cardsRef.current[0].status!],
          round: `(배송 ${cardsRef.current.sort((a, b) => a.deliveryRound - b.deliveryRound)[0].deliveryRound}회차 외 ${
            cardsRef.current.length - 1
          }건)`,
          deliveryDate: `${getFormatDate(cardsRef.current[0].deliveryDate)} 도착예정`,
        });
      } else {
        setDeliveryInfo({
          status: SUBS_DELIVERY_STATUS[cardsRef.current[0].status!],
          round: `(배송 ${cardsRef.current[0].deliveryRound}회차)`,
          deliveryDate: `${getFormatDate(cardsRef.current[0].deliveryDate)} 도착예정`,
        });
      }
    }
  }, []);

  return { cards, deliveryInfo };
};
export default useSubsNowDeliveryInfo;
