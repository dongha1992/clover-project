import React, { useState, useEffect } from 'react';
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
import { FinishPaymentItem } from '@components/Pages/Payment';
import { ButtonGroup } from '@components/Shared/Button';
import { getOrderDetailApi } from '@api/order';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { DELIVERY_TYPE_MAP, DELIVERY_TIME_MAP } from '@constants/payment';
import getCustomDate from '@utils/getCustomDate';
import { ILocation } from '@model/index';
interface IProps {
  orderId: number;
}
const PaymentFinishPage = ({ orderId }: IProps) => {
  const router = useRouter();

  const { data: orderDetail, isLoading } = useQuery(
    ['getOrderDetail'],
    async () => {
      const { data } = await getOrderDetailApi(orderId);
      return data.data;
    },
    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const goToOrderDetail = () => {
    router.push('/mypage/order-detail');
  };

  const goToShopping = () => {};

  const deliveryDateRenderer = ({
    location,
    delivery,
    deliveryDetail,
    dayFormatter,
    spotName,
    spotPickupName,
  }: {
    location: ILocation;
    delivery: string;
    deliveryDetail: string;
    dayFormatter: string;
    spotName: string;
    spotPickupName: string;
  }) => {
    const isLunch = deliveryDetail === 'LUNCH';

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
                  {dayFormatter} {isLunch ? '11:30-12:00' : '17:30-18:00'}
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

  if (isLoading) {
    return <div>로딩중</div>;
  }

  const { delivery, deliveryDetail } = orderDetail!;
  const { orderMenus, spot, spotPickup, location, deliveryDate } = orderDetail?.orderDeliveries[0]!;
  const { dayFormatter } = getCustomDate(new Date(deliveryDate));
  console.log(orderDetail, 'orderDetail');

  return (
    <Container>
      <PlaceInfoWrapper>
        <div className="title">
          <TextH2B color={theme.brandColor}>스팟배송</TextH2B>
          <TextH2B>점심주문이 완료되었습니다.</TextH2B>
        </div>
        <div className="discription">
          <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
            주문취소는 배송일 전날 오전 7시까지 입니다.
          </TextB3R>
          <TextB3R color={theme.greyScale65}>
            단, 오전 7시~9시 반 사이에는 주문 직후 5분 뒤 제조가 시작되어 취소 불가합니다.
          </TextB3R>
        </div>
      </PlaceInfoWrapper>
      <BorderLine height={8} />
      <OrderItemsWrapper>
        <FlexBetween padding="24px 0 0 0">
          <TextH4B>주문상품</TextH4B>
        </FlexBetween>
        <SingleOrderItemWrapper>
          <FinishPaymentItem menu={orderDetail} />
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
            spotName: spot?.name!,
            spotPickupName: spotPickup?.name!,
          })}
          {/* <FlexBetweenStart margin="16px 0">
            <TextH5B>배송 예정일시</TextH5B>
            <FlexColEnd>
              <TextB2R>11월 12일 (금) 11:30-12:00</TextB2R>
              <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
              <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          <FlexBetweenStart>
            <TextH5B>베송지</TextH5B>
            <FlexColEnd>
              <TextB2R>헤이그라운드 서울숲점 - 10층 냉장고</TextB2R>
              <TextB3R color={theme.greyScale65}>서울 성동구 왕십리로 115 10층</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart> */}
        </FlexCol>
      </DevlieryInfoWrapper>
      <ButtonGroup
        rightButtonHandler={goToShopping}
        leftButtonHandler={goToOrderDetail}
        rightText="쇼핑 계속하기"
        leftText="  주문 상세보기"
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

const OrderListWrapper = styled.div<{ isShow: boolean }>`
  display: ${({ isShow }) => (isShow ? 'flex' : 'none')};
  flex-direction: column;
`;

const SingleOrderItemWrapper = styled.div`
  margin-top: 24px;
`;

const DevlieryInfoWrapper = styled.div`
  padding: 24px;
`;

const OrderDetailBtn = styled.div`
  display: flex;
  width: 100%;
  ${fixedBottom}
`;

const Col = styled.div`
  position: absolute;
  left: 50%;
  bottom: 25%;
  background-color: ${theme.white};
  width: 1px;
  height: 50%;
`;

export async function getServerSideProps(context: any) {
  const { orderId } = context.query;
  return {
    props: { orderId: +orderId },
  };
}

export default PaymentFinishPage;
