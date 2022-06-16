import { InfoCard, SubsItem } from '@components/Pages/Subscription';
import { MySubsList } from '@components/Pages/Subscription';
import { TextB2R, TextH3B, TextH6B } from '@components/Shared/Text';
import { userForm } from '@store/user';
import { ScrollHorizonList, theme } from '@styles/theme';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import router from 'next/router';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { getOrdersApi } from '@api/order';
import { IGetOrders, IOrderDeliverie } from '@model/index';

const SubscriptiopPage = () => {
  const { isLoginSuccess, me } = useSelector(userForm);

  const goToRegularSpot = () => {
    router.push('/subscription/products?tab=spot');
  };

  const goToRegularDawn = () => {
    router.push('/subscription/products?tab=dawn');
  };

  const {
    data: menus,
    error: menuError,
    isLoading,
  } = useQuery(
    'getSubscriptionMenus',
    async () => {
      const params = { categories: '', menuSort: 'LAUNCHED_DESC', searchKeyword: '', type: 'SUBSCRIPTION' };

      const { data } = await getMenusApi(params);
      return data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const {
    data: subsList,
    error,
    isLoading: isSubsLoading,
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
          .filter((item: any) => item?.status !== 'COMPLETED' || item?.status !== 'CANCELED');

        return filterData;
      }
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
      enabled: !!me,
    }
  );

  if (isLoading) {
    return <div>...로딩중</div>;
  }

  return (
    <Container>
      <InfoCard />
      {subsList?.length > 0 && <MySubsList />}

      <SubsListContainer>
        <TitleBox>
          <div className="row">
            <TextH3B>프코스팟 정기구독</TextH3B>
            <TextH6B color={theme.greyScale65} pointer textDecoration="underline" onClick={goToRegularSpot}>
              더보기
            </TextH6B>
          </div>
          <TextB2R color={theme.greyScale65}>매주 무료배송으로 스팟에서 픽업해보세요</TextB2R>
        </TitleBox>
        <ListBox>
          <ScrollHorizonList>
            <SubsList>
              {menus?.map(
                (item, index) =>
                  item.subscriptionDeliveries?.includes('SPOT') && (
                    <SubsItem item={item} key={index} height="168px" width="298px" testType="SPOT" />
                  )
              )}
            </SubsList>
          </ScrollHorizonList>
        </ListBox>
      </SubsListContainer>
      <SubsListContainer>
        <TitleBox>
          <div className="row">
            <TextH3B>새벽/택배 정기구독</TextH3B>
            <TextH6B color={theme.greyScale65} pointer textDecoration="underline" onClick={goToRegularDawn}>
              더보기
            </TextH6B>
          </div>
          <TextB2R color={theme.greyScale65}>매주 신선한 샐러드를 집으로 배송시켜보세요</TextB2R>
        </TitleBox>
        <ListBox>
          <ScrollHorizonList>
            <SubsList>
              {menus?.map(
                (item, index) =>
                  (item.subscriptionDeliveries?.includes('PARCEL') ||
                    item.subscriptionDeliveries?.includes('MORNING')) && (
                    <SubsItem item={item} key={index} height="168px" width="298px" testType="PARCEL" />
                  )
              )}
              {menus?.filter(
                (item) =>
                  item.subscriptionDeliveries?.includes('PARCEL') || item.subscriptionDeliveries?.includes('MORNING')
              ).length === 0 && <div>새벽/택배 구독 상품이 없습니다.</div>}
            </SubsList>
          </ScrollHorizonList>
        </ListBox>
      </SubsListContainer>
      <Banner>정기구독 안내 배너</Banner>
    </Container>
  );
};

const Container = styled.div`
  padding: 0 0 68px;
`;
const SubsListContainer = styled.article`
  padding-bottom: 44px;
`;

const TitleBox = styled.div`
  padding: 0 24px 24px;
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
  }
`;
const ListBox = styled.div`
  padding-left: 24px;
`;
const SubsList = styled.div`
  display: flex;
  > div {
    margin-right: 16px;
    margin-bottom: 0;
  }
`;
const Banner = styled.div`
  width: 100%;
  height: 96px;
  background-color: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default SubscriptiopPage;
