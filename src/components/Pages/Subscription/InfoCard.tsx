import { getOrdersApi } from '@api/order';
import { TextH2B } from '@components/Shared/Text';
import { IGetOrders, IOrderDeliverie } from '@model/index';
import { userForm } from '@store/user';
import { theme } from '@styles/theme';
import { cloneDeep } from 'lodash-es';
import router from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const InfoCard = () => {
  const { isLoginSuccess, me } = useSelector(userForm);
  const [round, setRound] = useState();
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
      onSuccess: (data) => {
        // 구독의 시작이 가장 빠른 구독을 기준으로 round 표기
        const arr: any = [...data].reverse();
        for (let i = 0; i < arr.length; i++) {
          if (
            arr[i].status !== 'COMPLETED' &&
            arr[i].status !== 'CANCELED' &&
            arr[i].subscriptionPeriod === 'UNLIMITED'
          ) {
            setRound(arr[i].subscriptionRound);
            break;
          }
        }
      },
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
  if (isLoading) return <div>로딩중</div>;

  return (
    <Container>
      {isLoginSuccess &&
        (subsList?.length === 0 || !round ? (
          <TextH2B>
            <span>{me?.nickName}</span>님 <br />
            건강한 식단을 구독해 보세요!
          </TextH2B>
        ) : (
          <TextH2B>
            건강한 식단 <br />
            <span>{round}회</span> 구독 중이에요
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
