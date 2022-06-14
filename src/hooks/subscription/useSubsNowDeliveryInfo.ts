/* eslint-disable react-hooks/exhaustive-deps */
import { IGetOrders, IOrderDeliverie } from '@model/index';
import { useEffect, useState } from 'react';

const useSubsNowDeliveryInfo = (item: IGetOrders) => {
  const [cards, setCards] = useState<any>([]);
  useEffect(() => {
    let arr = [];
    for (let i = 0; i < item.orderDeliveries.length; i++) {
      if (item.currentDeliveryDate === item.orderDeliveries[i].deliveryDate || !item.currentDeliveryDate) {
        arr.push(item.orderDeliveries[i]);
      }
    }
    setCards(arr);
  }, []);

  return cards;
};
export default useSubsNowDeliveryInfo;
