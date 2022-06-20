import { getOrderListsApi } from '@api/order';
import { useEffect, useState } from 'react';

const useSubDeliveryDates = () => {
  const [subDates, setSubDates] = useState<any>([]);

  useEffect(() => {
    getApi();
  }, []);

  const getApi = async () => {
    const params = {
      days: 90,
      page: 1,
      size: 1,
      type: 'GENERAL',
    };

    const { data } = await getOrderListsApi(params);

    let dates: any = [];

    if (data.code === 200) {
      data.data.orderDeliveries.forEach((o) => {
        if (o.subOrderDelivery) {
          dates.push(o.subOrderDelivery);
        }
      });
      setSubDates(dates);
    }
  };
  return subDates;
};
export default useSubDeliveryDates;
