import { TextH3B, TextH6B } from '@components/Shared/Text';
import { ScrollHorizonList, theme } from '@styles/theme';
import { useState } from 'react';
import styled from 'styled-components';
import { SubsCardItem } from '@components/Pages/Subscription';
import { getOrdersApi } from '@api/order';
import { useQuery } from 'react-query';
import { IGetOrders, IOrderDeliverie } from '@model/index';
import { useSelector } from 'react-redux';
import { userForm } from '@store/user';
import router from 'next/router';

const MySubsList = () => {
  const { me } = useSelector(userForm);
  const {
    data: subsList,
    error: menuError,
    isLoading,
  } = useQuery(
    ['getSubscriptionOrders', 'progress'],
    async () => {
      if (me) {
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
          .filter((item: any) => item?.status !== 'COMPLETED' && item?.status !== 'CANCELED');

        return filterData;
      }
    },
    {
      onError: () => {
        router.replace('/onboarding');
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
      enabled: !!me,
    }
  );
  if (isLoading) {
    return <div>로딩중</div>;
  }
  return (
    <MySubsBox>
      <Head>
        <TextH3B>내 구독 ({subsList.length})</TextH3B>
        <TextH6B color={theme.greyScale65} pointer textDecoration="underline">
          구독 관리
        </TextH6B>
      </Head>
      <ScrollHorizonList style={{ backgroundColor: theme.greyScale3 }}>
        <ListContainer>
          {subsList.map((item: IGetOrders, index: number) => (
            <SubsCardItem key={index} item={item} />
          ))}
        </ListContainer>
      </ScrollHorizonList>
    </MySubsBox>
  );
};
const MySubsBox = styled.div`
  padding-bottom: 56px;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px 16px;
`;

const ListContainer = styled.div`
  display: flex;
  padding: 24px;
  background-color: ${theme.greyScale3};
`;

export default MySubsList;
