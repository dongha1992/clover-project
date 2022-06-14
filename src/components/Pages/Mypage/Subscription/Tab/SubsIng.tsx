import styled from 'styled-components';
import { useQuery } from 'react-query';
import { getOrdersApi } from '@api/order';
import { IGetOrders, IOrderDeliverie } from '@model/index';
import SubsMngIngItem from '../SubsMngIngItem';

const SubsIng = () => {
  const {
    data: subsList,
    error: menuError,
    isLoading,
  } = useQuery(
    ['getSubscriptionOrders', 'progress'],
    async () => {
      const params = { days: 90, page: 1, size: 100, type: 'SUBSCRIPTION' };
      const { data } = await getOrdersApi(params);
      let filterData = await data.data.orders
        .map((item: IGetOrders) => {
          item.orderDeliveries.sort(
            (a: IOrderDeliverie, b: IOrderDeliverie) =>
              Number(a.deliveryDate?.replaceAll('-', '')) - Number(b.deliveryDate?.replaceAll('-', ''))
          );

          return item;
        })
        .filter((item: any) => item?.status !== 'COMPLETED' || item?.status !== 'CANCELED');

      return filterData;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
    }
  );

  if (isLoading) {
    return <div>로딩중</div>;
  }
  return (
    <SubsIngContainer>
      {subsList?.map((item: IGetOrders, index: number) => (
        <SubsMngIngItem item={item} key={index} />
      ))}
    </SubsIngContainer>
  );
};
const SubsIngContainer = styled.div``;

export default SubsIng;
