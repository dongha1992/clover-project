import { InfoCard, MySubsList, SubsParcelList, SubsSpotList } from '@components/Pages/Subscription';
import { userForm } from '@store/user';
import { useSelector } from 'react-redux';
import router from 'next/router';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { getOrdersApi } from '@api/order';
import { IGetOrders, IMenus, IOrderDeliverie } from '@model/index';
import Image from 'next/image';
import subsMainBanner from '@public/images/subsMainBanner.svg';
import dayjs from 'dayjs';
import { dateN, afterDateN } from '@utils/common';
import React, { ReactElement, useEffect, useState } from 'react';
import DefaultLayout from '@components/Layout/Default';
import HomeBottom from '@components/Bottom/HomeBottom';
import { NextPageWithLayout } from '@pages/_app';
import SubsMainSkeleton from '@components/Skeleton/SubsMainSkeleton';

const SubscriptiopPage: NextPageWithLayout = () => {
  const { me } = useSelector(userForm);
  const [spotList, setSpotList] = useState<IMenus[]>();
  const [parcelList, setParcelList] = useState<IMenus[]>();

  const { isLoading: isMenusLoading } = useQuery(
    'getExhibitionMenus',
    async () => {
      const params = { categories: '', keyword: '', type: 'SUBSCRIPTION' };

      const { data } = await getMenusApi(params);
      return data.data;
    },
    {
      onSuccess: (menus) => {
        setSpotList(menus?.filter((menu) => menu.subscriptionDeliveries?.includes('SPOT')));
        setParcelList(menus?.filter((menu) => !menu.subscriptionDeliveries?.includes('SPOT')));
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const { data: subsList, isLoading: isOrdersLoading } = useQuery(
    ['getSubscriptionOrders', 'progress'],
    async () => {
      const params = { days: 365, page: 1, size: 100, type: 'SUBSCRIPTION' };
      const { data } = await getOrdersApi(params);

      return data.data.orders
        .map((item: IGetOrders) => {
          item.orderDeliveries.sort(
            (a: IOrderDeliverie, b: IOrderDeliverie) =>
              Number(a.deliveryDate?.replaceAll('-', '')) - Number(b.deliveryDate?.replaceAll('-', ''))
          );

          return item;
        })
        .filter((item: IGetOrders) => {
          // ????????????, ???????????? x, ???????????? type o, ?????? ???????????? ????????????
          // COMPLETED, CANCELED??? ???????????? ?????? ??????
          if (
            item.subscriptionPeriod === 'UNLIMITED' &&
            !item.isSubscribing &&
            !!item.unsubscriptionType &&
            dateN() > Number(dayjs(item.subscriptionPaymentDate).add(2, 'day').format('YYYYMMDD'))
          ) {
            return;
          } else if (
            item.subscriptionPeriod !== 'UNLIMITED' &&
            item.status === 'COMPLETED' &&
            item.delivery === 'SPOT' &&
            dateN(item.lastDeliveryDate!) < dateN() + 1
          ) {
            // ????????????(??????) ????????? ?????????????????? ????????????
            return item;
          } else if (
            item.subscriptionPeriod !== 'UNLIMITED' &&
            item.status === 'COMPLETED' &&
            (item.delivery === 'PARCEL' || item.delivery === 'MORNING') &&
            afterDateN(item.lastDeliveryDate!, 1) < dateN() + 1
          ) {
            // ????????????(??????/??????) ????????? ?????????????????? ????????????
            return item;
          } else if (item?.status !== 'COMPLETED' && item?.status !== 'CANCELED') {
            return item;
          }
        });
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
      enabled: !!me,
    }
  );

  const goToSpot = () => {
    router.push('/subscription/products?tab=spot');
  };

  const goToDawn = () => {
    router.push('/subscription/products?tab=parcel');
  };

  const goToSubsInformation = () => {
    router.push('/subscription/information');
  };

  if (isMenusLoading || isOrdersLoading || !spotList || !parcelList) {
    return <SubsMainSkeleton me={me} />;
  }
  return (
    <Container>
      <InfoCard subsCount={subsList?.length!} />
      {subsList?.length! > 0 && <MySubsList subsList={subsList!} />}

      <SubsSpotList menus={spotList!} moreClickHandler={goToSpot} />
      <SubsParcelList menus={parcelList!} moreClickHandler={goToDawn} />

      <Banner onClick={goToSubsInformation}>
        <Image src="/images/subsMainBanner.svg" alt="???????????????" width={512} height={131} layout="responsive" />
      </Banner>
    </Container>
  );
};

SubscriptiopPage.getLayout = (page: ReactElement) => {
  return <DefaultLayout bottom={<HomeBottom />}>{page}</DefaultLayout>;
};

const Container = styled.div`
  padding: 0 0 48px;
`;
const Banner = styled.div`
  background-color: #f2f2f2;
  cursor: pointer;
`;

export default SubscriptiopPage;
