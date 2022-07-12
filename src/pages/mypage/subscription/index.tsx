import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useGetOrders } from '@queries/order';
import { IGetOrders, IOrderDeliverie } from '@model/index';
import { TextB2R, TextB3R } from '@components/Shared/Text';
import { FlexCol, theme } from '@styles/theme';
import { useState } from 'react';
import { SubsMngItem } from '@components/Pages/Mypage/Subscription';
import { Button } from '@components/Shared/Button';

const SubscriptionManagementPage = () => {
  const router = useRouter();
  const [subsList, setSubsList] = useState<IGetOrders[]>();

  const { isFetching } = useGetOrders(
    ['getSubscriptionOrders'],
    { days: 365, page: 1, size: 100, type: 'SUBSCRIPTION' },
    {
      onSuccess: async (data) => {
        let filterData = await data.orders.map((item: IGetOrders) => {
          item.orderDeliveries.sort(
            (a: IOrderDeliverie, b: IOrderDeliverie) =>
              Number(a.deliveryDate?.replaceAll('-', '')) - Number(b.deliveryDate?.replaceAll('-', ''))
          );
          return item;
        });
        setSubsList(filterData);
      },
      onError: () => {
        router.replace('/onboarding');
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
      retry: false,
    }
  );

  const goToSubscription = () => {
    router.push('/subscription');
  };

  if (isFetching && !subsList) return <div>...로딩중</div>;

  return (
    <Container>
      {subsList?.length !== 0 ? (
        <>
          <SubsMngList>
            {subsList?.map((item: IGetOrders, index: number) => (
              <SubsMngItem item={item} key={index} />
            ))}
          </SubsMngList>
          <InfoBox>
            <TextB3R color={theme.greyScale65}>
              최근 1년 이내 구독 내역만 조회 가능해요. (이전 구독 내역은 고객센터로 문의해 주세요.)
            </TextB3R>
          </InfoBox>
        </>
      ) : (
        <NoSubsBox>
          <FlexCol width="100%">
            <TextB2R padding="0 0 24px" color={theme.greyScale65} center>
              구독중인 상품이 없어요 😭
            </TextB2R>
            <Button backgroundColor="#fff" color="#242424" width="100%" border onClick={goToSubscription}>
              구독 상품 보러가기
            </Button>
          </FlexCol>
        </NoSubsBox>
      )}
    </Container>
  );
};
const Container = styled.div`
  /* padding: 24px 24px 0 24px; */
`;
const SubsMngList = styled.div`
  padding: 24px;
`;
const InfoBox = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
`;
const NoSubsBox = styled.div`
  height: calc(100vh - 104px);
  display: flex;
  align-items: center;
  padding: 0 24px;
`;

export default SubscriptionManagementPage;
