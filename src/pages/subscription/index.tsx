import { InfoCard, SubsItem } from '@components/Pages/Subscription';
import { MySubsList } from '@components/Pages/Subscription';
import { TextB2R, TextH3B, TextH6B } from '@components/Shared/Text';
import { userForm } from '@store/user';
import { ScrollHorizonList, theme } from '@styles/theme';
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

const SubscriptiopPage = () => {
  const { me } = useSelector(userForm);

  const goToRegularSpot = () => {
    router.push('/subscription/products?tab=spot');
  };

  const goToRegularDawn = () => {
    router.push('/subscription/products?tab=dawn');
  };

  const { data: menus, isLoading: isMenusLoading } = useQuery(
    'getSubscriptionMenus',
    async () => {
      const params = { categories: '', keyword: '', type: 'SUBSCRIPTION' };

      const { data } = await getMenusApi(params);
      return data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { data: subsList, isLoading: isOrdersLoading } = useQuery(
    ['getSubscriptionOrders', 'progress'],
    async () => {
      const params = { days: 365, page: 1, size: 100, type: 'SUBSCRIPTION' };
      const { data } = await getOrdersApi(params);

      let filterData = await data.data.orders
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

      return filterData;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
      enabled: !!me,
    }
  );

  const goToSubsInformation = () => {
    router.push('/subscription/information');
  };

  if (isMenusLoading && isOrdersLoading) {
    return <div>...로딩중</div>;
  }

  return (
    <Container>
      <InfoCard subsCount={subsList?.length} />
      {subsList?.length > 0 && <MySubsList subsList={subsList} />}

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
      <Banner onClick={goToSubsInformation}>
        <Image src={subsMainBanner} alt="웰컴이미지" width={360} height={96} layout="responsive" objectFit="cover" />
      </Banner>
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
  background-color: #f2f2f2;
  cursor: pointer;
`;

export default SubscriptiopPage;
