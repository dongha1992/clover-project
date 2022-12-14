import { useEffect, useState } from 'react';

const useSubDeliveryDates = (orderDeliveries: any) => {
  const [subDates, setSubDates] = useState<any>([]);

  useEffect(() => {
    let datas: any = [];

    orderDeliveries?.forEach((o: any) => {
      if (o?.subOrderDelivery?.type === 'SUB') {
        datas.push(o);
      }
    });

    setSubDates(datas);
  }, [orderDeliveries]);

  return subDates;
};
export default useSubDeliveryDates;
