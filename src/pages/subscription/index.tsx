import { InfoCard, MySubsList, SubsParcelList, SubsSpotList } from '@components/Pages/Subscription';
import { userForm } from '@store/user';
import { useSelector } from 'react-redux';
import router from 'next/router';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { getOrdersApi } from '@api/order';
import { IGetOrders, IOrderDeliverie } from '@model/index';
import Image from 'next/image';
import subsMainBanner from '@public/images/subsMainBanner.svg';
import dayjs from 'dayjs';
import { parcelDeliveryCompledN, spotDeliveryCompledN, todayN } from '@utils/common';
import React, { ReactElement, useEffect, useState } from 'react';
import DefaultLayout from '@components/Layout/Default';
import HomeBottom from '@components/Bottom/HomeBottom';
import { NextPageWithLayout } from '@pages/_app';

const SubscriptiopPage: NextPageWithLayout = () => {
  const { me } = useSelector(userForm);

  const { data: menus } = useQuery(
    'getExhibitionMenus',
    async () => {
      const params = { categories: '', keyword: '', type: 'SUBSCRIPTION' };

      const { data } = await getMenusApi(params);
      return data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { data: subsList } = useQuery(
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
          // 정기구독, 구독진행 x, 구독실패 type o, 구독 완료일이 지났을때
          // COMPLETED, CANCELED로 넘어가지 않는 경우
          if (
            item.subscriptionPeriod === 'UNLIMITED' &&
            !item.isSubscribing &&
            !!item.unsubscriptionType &&
            todayN() > Number(dayjs(item.subscriptionPaymentDate).add(2, 'day').format('YYYYMMDD'))
          ) {
            return;
          } else if (
            item.subscriptionPeriod !== 'UNLIMITED' &&
            item.status === 'COMPLETED' &&
            item.delivery === 'SPOT' &&
            spotDeliveryCompledN(item.lastDeliveryDate!) < todayN() + 1
          ) {
            // 단기구독(스팟) 완료후 구독정보카드 하루유지
            return item;
          } else if (
            item.subscriptionPeriod !== 'UNLIMITED' &&
            item.status === 'COMPLETED' &&
            (item.delivery === 'PARCEL' || item.delivery === 'MORNING') &&
            parcelDeliveryCompledN(item.lastDeliveryDate!) < todayN() + 1
          ) {
            // 단기구독(새벽/택배) 완료후 구독정보카드 하루유지
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
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  // isMenusLoading && isOrdersLoading && 수정
  if (loading) {
    return (
      <div>...로딩중</div>
      // <Loading>
      //   <Lottie options={defaultOptions} height={500} width={500} />
      // </Loading>
    );
  }

  return (
    <Container>
      <InfoCard subsCount={subsList?.length!} />
      {subsList?.length! > 0 && <MySubsList subsList={subsList!} />}

      <SubsSpotList menus={menus!} moreClickHandler={goToSpot} />
      <SubsParcelList menus={menus!} moreClickHandler={goToDawn} />

      <Banner onClick={goToSubsInformation}>
        <Image src={subsMainBanner} alt="웰컴이미지" width={360} height={96} layout="responsive" objectFit="cover" />
      </Banner>
    </Container>
  );
};

SubscriptiopPage.getLayout = (page: ReactElement) => {
  return (<DefaultLayout bottom={<HomeBottom/>}>{page}</DefaultLayout>)
}

const Container = styled.div`
  padding: 0 0 68px;
`;
const Banner = styled.div`
  background-color: #f2f2f2;
  cursor: pointer;
`;

export default SubscriptiopPage;
