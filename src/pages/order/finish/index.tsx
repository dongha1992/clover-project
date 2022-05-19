import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextB3R, TextH2B, TextH4B, TextB2R, TextH5B } from '@components/Shared/Text';
import {
  theme,
  FlexBetween,
  FlexRow,
  homePadding,
  FlexBetweenStart,
  FlexCol,
  FlexColEnd,
  fixedBottom,
} from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import { FinishOrderItem } from '@components/Pages/Order';
import { ButtonGroup } from '@components/Shared/Button';
import { getOrderDetailApi } from '@api/order';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { DELIVERY_TYPE_MAP, DELIVERY_TIME_MAP } from '@constants/order';
import { getCustomDate } from '@utils/destination';
import { ILocation, IOrderDeliveriesInSpot } from '@model/index';
import { postTossApproveApi, postKakaoApproveApi } from '@api/order';
import { getCookie } from '@utils/common';
interface IProps {
  orderId: number;
  pgToken?: string;
  payToken?: number;
  pg: string;
}

/* TODO: deliveryDateRenderer, cancelOrderInfoRenderer 컴포넌트로 분리 */

const OrderFinishPage = ({ orderId, pgToken, pg, payToken }: IProps) => {
  const router = useRouter();
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false);

  const { data: orderDetail, isLoading } = useQuery(
    ['getOrderDetail'],
    async () => {
      const { data } = await getOrderDetailApi(orderId);
      return data.data;
    },
    {
      onSuccess: () => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!isPaymentSuccess,
    }
  );

  console.log(orderId, pgToken, pg, payToken, 'orderId, pgToken, pg, payToken');

  const checkPg = async () => {
    console.log(orderId, pgToken, pg, payToken, 'orderId, pgToken, pg, payToken in fnc');
    if (pg === 'kakao') {
      const kakaoTid = getCookie({ name: 'kakao-tid-clover' });
      if (pgToken && kakaoTid) {
        const reqBody = { pgToken, tid: kakaoTid };
        console.log(pgToken, kakaoTid, '!@#!@#!@#!');
        const { data } = await postKakaoApproveApi({ orderId, data: reqBody });
        console.log(data, 'AFTER KAKAO PAY');
      } else {
        // 카카오 결제 에러
      }
    } else {
      if (payToken) {
        const { data } = await postTossApproveApi({ orderId, payToken });
        console.log(data, 'AFTER TOSS');
      } else {
        // 토스 페이 에러
      }
    }
  };

  const goToOrderDetail = () => {
    router.push({ pathname: `/mypage/order-detail/${orderId}` });
  };

  const goToShopping = () => {
    router.push('/');
  };

  const deliveryDateRenderer = ({
    location,
    delivery,
    deliveryDetail,
    dayFormatter,
    spotName,
    spotPickupName,
    deliveryEndTime,
    deliveryStartTime,
  }: {
    location: ILocation;
    delivery: string;
    deliveryDetail: string;
    dayFormatter: string;
    spotName: string;
    spotPickupName: string;
    deliveryEndTime: string;
    deliveryStartTime: string;
  }) => {
    const isLunch = deliveryDetail === 'LUNCH';

    const devlieryTime = `${deliveryStartTime}-${deliveryEndTime}`;

    switch (delivery) {
      case 'PARCEL': {
        return (
          <>
            <FlexBetweenStart margin="16px 0">
              <TextH5B>배송 예정실시</TextH5B>
              <FlexColEnd>
                <TextB2R>{dayFormatter}</TextB2R>
                <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
                <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
            <FlexBetweenStart>
              <TextH5B>베송지</TextH5B>
              <FlexColEnd>
                <TextB2R>{location.address}</TextB2R>
                <TextB3R color={theme.greyScale65}>{location.addressDetail}</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
          </>
        );
      }
      case 'MORNING': {
        return (
          <>
            <FlexBetweenStart margin="16px 0">
              <TextH5B>배송 예정실시</TextH5B>
              <FlexColEnd>
                <TextB2R>{dayFormatter} 00:00-07:00</TextB2R>
                <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
                <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
            <FlexBetweenStart>
              <TextH5B>베송지</TextH5B>
              <FlexColEnd>
                <TextB2R>{location.address}</TextB2R>
                <TextB3R color={theme.greyScale65}>{location.addressDetail}</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
          </>
        );
      }
      case 'QUICK': {
        return (
          <>
            <FlexBetweenStart margin="16px 0">
              <TextH5B>배송 예정실시</TextH5B>
              <FlexColEnd>
                <TextB2R>
                  {dayFormatter} {isLunch ? '11:30-12:00' : '15:30-18:00'}
                </TextB2R>
                <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
                <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
            <FlexBetweenStart>
              <TextH5B>베송지</TextH5B>
              <FlexColEnd>
                <TextB2R>{location.address}</TextB2R>
                <TextB3R color={theme.greyScale65}>{location.addressDetail}</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
          </>
        );
      }
      case 'SPOT': {
        return (
          <>
            <FlexBetweenStart margin="16px 0">
              <TextH5B>배송 예정실시</TextH5B>
              <FlexColEnd>
                <TextB2R>
                  {dayFormatter} {devlieryTime}
                </TextB2R>
                <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
                <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
            <FlexBetweenStart>
              <TextH5B>픽업장소</TextH5B>
              <FlexColEnd>
                <FlexRow>
                  <TextB3R>
                    {spotName} {spotPickupName}
                  </TextB3R>
                </FlexRow>
                <FlexRow>
                  <TextB3R color={theme.greyScale65} margin="0 4px 0 0">
                    ({location.zipCode})
                  </TextB3R>
                  <TextB3R color={theme.greyScale65}>{location.address}</TextB3R>
                </FlexRow>
              </FlexColEnd>
            </FlexBetweenStart>
          </>
        );
      }
    }
  };

  const cancelOrderInfoRenderer = (delivery: string, deliveryDetail: string) => {
    const isLunch = deliveryDetail === 'LUNCH';

    switch (delivery) {
      case 'QUICK':
      case 'SPOT': {
        return (
          <>
            <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
              주문 변경 및 취소는 수령일 당일 오전 7시까지 가능해요!
            </TextB3R>
            <TextB3R color={theme.greyScale65}>
              단, 수령일 오전 7시~{isLunch ? '9시 25' : '10시 55'}분 사이에 주문하면 주문완료 후 5분 이내로 주문 변경 및
              취소할 수 있어요!
            </TextB3R>
          </>
        );
      }
      case 'PARCEL':
      case 'MORNING': {
        return (
          <>
            <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
              주문 변경 및 취소는 수령일 하루 전 오후 3시까지 가능해요!
            </TextB3R>
            <TextB3R color={theme.greyScale65}>
              단, 수령일 오후 3시~4시 55분 사이에 주문하면 주문완료 후 5분 이내로 주문 변경 및 취소할 수 있어요!
            </TextB3R>
          </>
        );
      }
    }
  };

  useEffect(() => {
    checkPg();
  }, []);

  const { delivery, deliveryDetail } = orderDetail!;
  const { orderMenus, spotName, spotPickupName, location, deliveryDate, deliveryEndTime, deliveryStartTime } =
    orderDetail?.orderDeliveries[0]!;
  const { dayFormatter } = getCustomDate(new Date(deliveryDate));
  const isSpot = delivery === 'SPOT';
  const isSubOrder = orderDetail?.orderDeliveries[0]!.type === 'SUB';

  if (!isPaymentSuccess) {
    return <div>로딩중</div>;
  }

  return (
    <Container>
      <PlaceInfoWrapper>
        <div className="title">
          <TextH2B color={theme.brandColor}>{isSubOrder ? '함께배송' : DELIVERY_TYPE_MAP[delivery]}</TextH2B>
          {orderDetail ? (
            <TextH2B>{DELIVERY_TIME_MAP[deliveryDetail]}주문이 완료되었습니다.</TextH2B>
          ) : (
            <TextH2B>주문이 완료되었습니다.</TextH2B>
          )}
        </div>
        <div className="discription">{cancelOrderInfoRenderer(delivery, deliveryDetail)}</div>
      </PlaceInfoWrapper>
      <BorderLine height={8} />
      <OrderItemsWrapper>
        <FlexBetween padding="24px 0 0 0">
          <TextH4B>주문상품</TextH4B>
        </FlexBetween>
        <SingleOrderItemWrapper>
          <FinishOrderItem menu={orderDetail} />
        </SingleOrderItemWrapper>
      </OrderItemsWrapper>
      <BorderLine height={8} />
      <DevlieryInfoWrapper>
        <FlexBetween>
          <TextH4B>배송정보</TextH4B>
        </FlexBetween>
        <FlexCol padding="24px 0">
          {deliveryDateRenderer({
            location,
            delivery,
            deliveryDetail,
            dayFormatter,
            spotName,
            spotPickupName,
            deliveryEndTime,
            deliveryStartTime,
          })}
        </FlexCol>
      </DevlieryInfoWrapper>
      <ButtonGroup
        rightButtonHandler={goToShopping}
        leftButtonHandler={goToOrderDetail}
        rightText="쇼핑 계속하기"
        leftText="주문 상세보기"
      />
    </Container>
  );
};

const Container = styled.main``;

const PlaceInfoWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  margin-bottom: 72px;

  .discription {
    width: 100%;
  }
`;

const OrderItemsWrapper = styled.div`
  ${homePadding}
`;

const SingleOrderItemWrapper = styled.div`
  margin-top: 24px;
`;

const DevlieryInfoWrapper = styled.div`
  padding: 24px;
`;

export async function getServerSideProps(context: any) {
  const { orderId, pg_token, pg, payToken } = context.query;

  return {
    props: { orderId: +orderId, pgToken: pg_token, pg, payToken },
  };
}

export default OrderFinishPage;
