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
import { getCookie, getFormatDate } from '@utils/common';
import { useDispatch, useSelector } from 'react-redux';
import { SET_IS_LOADING } from '@store/common';
import { SubsOrderItem } from '@components/Pages/Subscription/payment';
import { subscriptionForm } from '@store/subscription';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');
interface IProps {
  orderId: number;
  pgToken?: string;
  payToken?: number;
  pg: string;
}

/* TODO: deliveryDateRenderer, cancelOrderInfoRenderer 컴포넌트로 분리 */

const OrderFinishPage = () => {
  const router = useRouter();
  const { subsInfo } = useSelector(subscriptionForm);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false);
  const [pickupDay, setPickupDay] = useState<unknown[]>([]);

  const dispatch = useDispatch();
  const { pg_token: pgToken, orderId, pg } = router.query;

  const { data: orderDetail, isLoading } = useQuery(
    ['getOrderDetail'],
    async () => {
      const { data } = await getOrderDetailApi(Number(orderId));

      // orderDeliveries 날짜 순서대로 정렬
      data.data.orderDeliveries.sort(
        (a, b) => Number(a.deliveryDate.replaceAll('-', '')) - Number(b.deliveryDate.replaceAll('-', ''))
      );
      return data.data;
    },
    {
      onSuccess: (data) => {
        // ex) [화·목] 형태로 pickupDay에 저장
        let pickupDayObj = new Set();
        data.orderDeliveries.forEach((item) => {
          pickupDayObj.add(dayjs(item.deliveryDate).format('dd'));
        });
        setPickupDay(Array.from(pickupDayObj));

        dispatch(SET_IS_LOADING(false));
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!isPaymentSuccess,
    }
  );

  const checkPg = async () => {
    try {
      if (pg === 'kakao') {
        const kakaoTid = getCookie({ name: 'kakao-tid-clover' });
        if (pgToken && kakaoTid) {
          const reqBody = { pgToken: pgToken.toString(), tid: kakaoTid };
          const { data } = await postKakaoApproveApi({ orderId: Number(orderId), data: reqBody });
          console.log(data, 'AFTER KAKAO PAY');
          if (data.code === 200) {
            setIsPaymentSuccess(true);
          }
        } else {
          // 카카오 결제 에러
        }
      } else if (pg === 'toss') {
        const payToken = getCookie({ name: 'toss-tid-clover' });
        if (payToken) {
          const reqBody = { payToken };
          const { data } = await postTossApproveApi({ orderId: Number(orderId), data: reqBody });

          if (data.code === 200) {
            setIsPaymentSuccess(true);
          }
        } else {
          // 토스 페이 에러
        }
      } else {
        setIsPaymentSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const goToOrderDetail = () => {
    if (orderDetail?.type === 'SUBSCRIPTION') {
      router.push('/subscription/detail');
    } else {
      router.push({ pathname: `/mypage/order-detail/${orderId}` });
    }
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
    console.log(router.query.orderId, '(router.query.orderId in useEffect');
    if (router.query.orderId) {
      checkPg();
    }
  }, [router.query.orderId]);

  if (isLoading || !isPaymentSuccess) {
    return <div>로딩중</div>;
  }

  const {
    delivery,
    deliveryDetail,
    name,
    type,
    subscriptionPeriod,
    subscriptionRound,
    menuAmount,
    menuDiscount,
    eventDiscount,
    deliveryFeeDiscount,
    coupon,
    point,
    optionAmount,
    optionQuantity,
    deliveryFee,
    orderDeliveries,
  } = orderDetail!;

  const { orderMenus, spotName, spotPickupName, location, deliveryDate, deliveryEndTime, deliveryStartTime } =
    orderDetail?.orderDeliveries[0]!;
  const { dayFormatter } = getCustomDate(new Date(deliveryDate));
  const isSpot = delivery === 'SPOT';
  const isSubOrder = orderDetail?.orderDeliveries[0]!.type === 'SUB';

  const getTotalPrice = () => {
    return (
      menuAmount -
      (menuDiscount + eventDiscount + deliveryFeeDiscount + coupon + point) +
      optionAmount * optionQuantity +
      deliveryFee
    );
  };

  return (
    <Container>
      <PlaceInfoWrapper>
        <div className="title">
          {type === 'SUBSCRIPTION' ? (
            <TextH2B color={theme.brandColor}>
              {DELIVERY_TYPE_MAP[delivery]} - {subscriptionPeriod === 'UNLIMITED' ? '정기구독' : '단기구독'}
            </TextH2B>
          ) : (
            <TextH2B color={theme.brandColor}>{isSubOrder ? '함께배송' : DELIVERY_TYPE_MAP[delivery]}</TextH2B>
          )}

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
        <FlexBetween>
          <TextH4B>주문상품</TextH4B>
        </FlexBetween>
        <SingleOrderItemWrapper>
          {type === 'SUBSCRIPTION' ? (
            <SubsOrderItem
              deliveryType={delivery}
              deliveryDetail={deliveryDetail}
              subscriptionPeriod={'ONE_WEEK'}
              name={name}
              menuImage={subsInfo?.menuImage!}
              price={getTotalPrice()}
            />
          ) : (
            <FinishOrderItem menu={orderDetail} getTotalPrice={getTotalPrice} />
          )}
        </SingleOrderItemWrapper>
      </OrderItemsWrapper>
      <BorderLine height={8} />
      {type === 'SUBSCRIPTION' ? (
        <SubsInfoWrapper>
          <TextH4B padding="0 0 24px">구독정보</TextH4B>
          <FlexBetweenStart padding="0 0 16px">
            <TextH5B>구독기간</TextH5B>
            <FlexColEnd>
              <TextB2R>정기구독 {subscriptionRound}회차</TextB2R>
              <TextB3R color="#717171">
                {getFormatDate(orderDeliveries[0].deliveryDate)} ~{' '}
                {getFormatDate(orderDeliveries[orderDeliveries.length - 1].deliveryDate)}
              </TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          <FlexBetweenStart padding="0 0 16px">
            <TextH5B>구독 시작일시</TextH5B>
            <FlexColEnd>
              <TextB2R>
                {getFormatDate(orderDeliveries[0].deliveryDate)} {orderDeliveries[0].deliveryStartTime}-
                {orderDeliveries[0].deliveryEndTime}
              </TextB2R>
              <TextB3R color="#717171" className="textRight">
                예정보다 빠르게 배송될 수 있습니다.{`\n`}(배송 후 문자 안내)
              </TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          <FlexBetweenStart>
            <TextH5B>배송주기</TextH5B>
            <FlexColEnd>
              <TextB2R>
                주 {pickupDay.length}회 / {pickupDay?.join('·')}
              </TextB2R>
              <TextB3R color="#717171">공휴일, 배송휴무일 제외</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          {isSpot && (
            <FlexBetweenStart padding="16px 0 0">
              <TextH5B>픽업장소</TextH5B>
              <FlexColEnd>
                <TextB2R>
                  {spotName} - {spotPickupName}
                </TextB2R>
                <TextB3R color="#717171">{location.address}</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
          )}
        </SubsInfoWrapper>
      ) : (
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
      )}
      <ButtonGroup
        rightButtonHandler={goToShopping}
        leftButtonHandler={goToOrderDetail}
        rightText="쇼핑 계속하기"
        leftText={type === 'SUBSCRIPTION' ? '구독 상세보기' : '주문 상세보기'}
      />
    </Container>
  );
};

const Container = styled.main``;

const PlaceInfoWrapper = styled.div`
  padding: 24px 24px 72px 24px;
  display: flex;
  flex-direction: column;

  .discription {
    width: 100%;
  }
`;

const OrderItemsWrapper = styled.div`
  padding: 24px;
`;

const SingleOrderItemWrapper = styled.div`
  margin-top: 24px;
`;

const DevlieryInfoWrapper = styled.div`
  padding: 24px;
`;

const SubsInfoWrapper = styled.div`
  padding: 24px;
  .textRight {
    text-align: right;
  }
`;

// export async function getServerSideProps(context: any) {
//   const { orderId } = context.query;
//   console.log(context.query, 'context.query');
//   return {
//     props: {
//       orderId: +orderId,
//     },
//   };
// }

export default OrderFinishPage;
