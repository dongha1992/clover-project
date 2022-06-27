import { getOrderListsApi } from '@api/order';
import { useEffect, useState } from 'react';

const useSubDeliveryDates = (orderDeliveries: any) => {
  const [subDates, setSubDates] = useState<any>([]);

  useEffect(() => {
    let datas: any = [];

    orderDeliveries?.forEach((o: any) => {
      if (o.type === 'SUB') {
        datas.push(o);
      }
    });

    setSubDates(datas);
  }, []);

  return subDates;
};
export default useSubDeliveryDates;
