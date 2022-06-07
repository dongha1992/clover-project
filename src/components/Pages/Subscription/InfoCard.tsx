import { getOrdersApi } from '@api/order';
import { TextH2B } from '@components/Shared/Text';
import { userForm } from '@store/user';
import { theme } from '@styles/theme';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const InfoCard = () => {
  const { isLoginSuccess, me } = useSelector(userForm);
  const {
    data: subsList,
    error: menuError,
    isLoading,
  } = useQuery(
    'getSubscriptionOrders',
    async () => {
      const params = { days: 90, page: 1, size: 100, type: 'SUBSCRIPTION' };
      const { data } = await getOrdersApi(params);

      let filterData = await data.data.orders
        .map((item: any) => {
          item.orderDeliveries.sort(
            (a: any, b: any) => Number(a.deliveryDate.replaceAll('-', '')) - Number(b.deliveryDate.replaceAll('-', ''))
          );

          return item;
        })
        .filter((item: any) => item?.status !== 'COMPLETED');

      return filterData;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
    }
  );

  return (
    <Container>
      {isLoginSuccess &&
        (subsList?.length === 0 ? (
          <TextH2B>
            <span>{me?.nickName}</span>님 <br />
            건강한 식단을 구독해 보세요!
          </TextH2B>
        ) : (
          <TextH2B>
            건강한 식단 <br />
            136일째 진행 중 🥗
          </TextH2B>
        ))}
      {isLoginSuccess === false && (
        <TextH2B>
          프레시코드의 <br />
          건강한 식단을 구독해 보세요!
        </TextH2B>
      )}
    </Container>
  );
};
const Container = styled.div`
  padding: 24px 24px 48px;
  & > div span {
    color: ${theme.brandColor};
  }
`;
export default InfoCard;
