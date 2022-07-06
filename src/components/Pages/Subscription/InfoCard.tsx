import { getOrdersApi } from '@api/order';
import { TextH2B } from '@components/Shared/Text';
import { IGetOrders, IOrderDeliverie } from '@model/index';
import { useGetOrders } from '@queries/order';
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
  const [subsList, setSubsList] = useState([]);

  const {} = useGetOrders(
    ['getSubscriptionOrders'],
    { days: 365, page: 1, size: 1000, type: 'SUBSCRIPTION' },
    {
      onSuccess: async (data) => {
        const filterData = data.orders.filter((o: IGetOrders) => o.status !== 'COMPLETED' && o.status !== 'CANCELED');
        setSubsList(filterData);
      },
      onError: () => {
        router.replace('/onboarding');
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
      enabled: !!me,
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
            <span>{me?.nickName}</span>님 <br />
            건강한 식단을 구독 중이에요!
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
