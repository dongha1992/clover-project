import { IGetOrders } from '@model/index';
import { useEffect, useState } from 'react';

const useSubsSetProgress = (item: IGetOrders) => {
  const [round, setRound] = useState(0);
  useEffect(() => {
    if (item.firstDeliveryDate === item.currentDeliveryDate && item.orderDeliveries[0].status !== 'COMPLETED') {
      // 배송1회차 상품이 완료가 아닐때 progressBar 0
      setRound(0);
    } else if (
      !item.currentDeliveryDate &&
      item.orderDeliveries[item.orderDeliveries.length - 1].status === 'COMPLETED'
    ) {
      // 배송 마지막 회차 배송완료일때
      setRound(item.orderDeliveries.length);
    } else if (
      !item.currentDeliveryDate &&
      item.orderDeliveries[item.orderDeliveries.length - 1].status !== 'COMPLETED'
    ) {
      // 배송 마지막 회차 배송완료가 아닐때
      setRound(item.orderDeliveries.length - 1);
    } else {
      item.orderDeliveries.forEach((order) => {
        if (item.currentDeliveryDate === order.deliveryDate) {
          setRound(order.deliveryRound);
        }
      });
    }
  }, []);
  return round;
};
export default useSubsSetProgress;
