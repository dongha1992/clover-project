import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FlexRow, theme, FlexBetween, FlexCol, FlexBetweenStart, FlexColEnd, FlexEnd } from '@styles/theme';
import { TextH4B, TextB3R, TextB1R, TextB2R, TextH5B, TextH6B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import PaymentItem from '@components/Pages/Payment/PaymentItem';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { Obj } from '@model/index';
import { useToast } from '@hooks/useToast';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { Tag } from '@components/Shared/Tag';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { DeliveryInfoSheet } from '@components/BottomSheet/DeliveryInfoSheet';
import { CalendarSheet } from '@components/BottomSheet/CalendarSheet';
import { orderForm } from '@store/order';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { IOrderMenus } from '@model/index';
import { deliveryStatusMap, deliveryDetailMap } from '@pages/mypage/order-delivery-history';
import getCustomDate from '@utils/getCustomDate';
import { OrderDetailInfo } from '@components/Pages/Mypage/OrderDelivery';
import { getOrderDetailApi, deleteDeliveryApi } from '@api/order';
import { DELIVERY_TYPE_MAP } from '@constants/payment';
import dayjs from 'dayjs';
import OrderUserInfo from '@components/Pages/Mypage/OrderDelivery/OrderUserInfo';
// temp

const disabledDates = ['2022-01-24', '2022-01-25', '2022-01-26', '2022-01-27', '2022-01-28'];

const OrderDetailPage = ({ orderId }: { orderId: number }) => {
  const [isShowOrderItemSection, setIsShowOrderItemSection] = useState<boolean>(false);

  const { showToast } = useToast();
  const { deliveryDate } = useSelector(orderForm);
  const dispatch = useDispatch();

  const router = useRouter();

  const { data: orderDetail, isLoading } = useQuery(
    'getOrderDetail',
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

  const paidAt = dayjs(orderDetail?.paidAt).format('YYYY-MM-DD HH:mm');
  const { dateFormatter: deliveryAt } = getCustomDate(new Date(orderDetail?.orderDeliveries[0]?.deliveryDate!));
  const { dayFormatter: deliveryAtWithDay } = getCustomDate(new Date(orderDetail?.orderDeliveries[0]?.deliveryDate!));

  const deliveryStatus = orderDetail && deliveryStatusMap[orderDetail?.orderDeliveries[0]?.status];
  const deliveryDetail = orderDetail && deliveryDetailMap[orderDetail?.deliveryDetail];
  const isCompleted = orderDetail?.orderDeliveries[0].status === 'COMPLETED';
  const isCanceled = orderDetail?.orderDeliveries[0].status === 'CANCELED';
  const isDelivering = orderDetail?.orderDeliveries[0].status === 'DELIVERING';
  const canChangeDelivery = orderDetail?.orderDeliveries[0].status === 'RESERVED';

  const isSpot = orderDetail?.delivery === 'SPOT';
  const isParcel = orderDetail?.delivery === 'PARCEL';

  const showSectionHandler = () => {
    setIsShowOrderItemSection(!isShowOrderItemSection);
  };

  const deliveryInfoSheetHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerText } = e.target as HTMLDivElement;
    dispatch(
      SET_BOTTOM_SHEET({
        content: <DeliveryInfoSheet title="운송장번호" copiedValue={innerText} />,
      })
    );
  };

  const deliveryDescription = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERING': {
        return (
          <FlexBetween width="100%">
            <FlexRow>
              <SVGIcon name="delivery" />
              <TextB2R color={theme.greyScale65} padding="4px 0 0 4px">
                운송장번호
              </TextB2R>
              <TextH5B
                color={theme.brandColor}
                padding="4px 0 0 4px"
                textDecoration="underline"
                onClick={deliveryInfoSheetHandler}
              >
                복사복사
              </TextH5B>
            </FlexRow>
          </FlexBetween>
        );
      }
      case 'PREPARING': {
        return (
          <>
            <SVGIcon name="delivery" />
            <TextB3R color={theme.greyScale65} padding="4px 0 0 4px">
              배송중 단계부터 배송상태 확인이 가능합니다.
            </TextB3R>
          </>
        );
      }
      default:
        return;
    }
  };

  const changeDeliveryInfoHandler = () => {
    // if (!canChangeDelivery) {
    //   return;
    // }

    router.push({
      pathname: '/mypage/order-detail/edit/[orderId]',
      query: { orderId },
    });
  };

  const cancelOrderHandler = () => {
    if (!canChangeDelivery) {
      return;
    }

    dispatch(
      SET_ALERT({
        alertMessage: '주문을 취소하시겠어요?',
        onSubmit: () => cancelOrder(),
        closeBtnText: '취소',
      })
    );
  };

  const cancelOrder = async () => {
    const { data } = await deleteDeliveryApi(orderId);
  };

  const changeDevlieryDateHandler = () => {
    if (!canChangeDelivery) {
      return;
    }
    dispatch(
      SET_BOTTOM_SHEET({
        content: <CalendarSheet title="배송일 변경" disabledDates={disabledDates} deliveryDate="2022-02-24" isSheet />,
      })
    );
  };

  const getTotalPayment = (): number => {
    return 1;
  };

  if (isLoading) {
    return <div>로딩</div>;
  }
  const {
    refundDeliveryFee,
    refundDeliveryFeeDiscount,
    refundEventDiscount,
    refundMenuAmount,
    refundMenuDiscount,
    deliveryFee,
    deliveryFeeDiscount,
    eventDiscount,
    menuAmount,
    menuDiscount,
    point,
    optionAmount,
    coupon,
  } = orderDetail!;

  const {
    receiverName,
    receiverTel,
    location,
    orderMenus,
    delivery,
    status,
    deliveryMessageType,
    deliveryMessage,
    spot,
    spotPickup,
  } = orderDetail?.orderDeliveries[0]!;

  return (
    <Container>
      <DeliveryStatusWrapper>
        <FlexRow padding="0 0 13px 0">
          <TextH4B color={isCanceled ? theme.greyScale65 : theme.black}>{deliveryStatus}</TextH4B>
          <TextB1R padding="0 0 0 4px" color={isCanceled ? theme.greyScale25 : ''}>
            {deliveryAt} 도착예정
          </TextB1R>
        </FlexRow>
        <FlexRow>{deliveryDescription(status)}</FlexRow>
      </DeliveryStatusWrapper>
      <BorderLine height={8} />
      <OrderItemsWrapper>
        <FlexBetween>
          <TextH4B>주문상품</TextH4B>
          <FlexRow onClick={() => showSectionHandler()}>
            <SVGIcon name={isShowOrderItemSection ? 'triangleUp' : 'triangleDown'} />
          </FlexRow>
        </FlexBetween>
        <OrderListWrapper isShow={isShowOrderItemSection} status={deliveryStatus}>
          {orderMenus?.map((menu: IOrderMenus, index: number) => {
            return <PaymentItem menu={menu} key={index} isDeliveryComplete={isCompleted} isCanceled={isCanceled} />;
          })}
          <Button backgroundColor={theme.white} color={theme.black} border margin="8px 0 0 0">
            재주문하기
          </Button>
        </OrderListWrapper>
      </OrderItemsWrapper>
      <BorderLine height={8} />
      <OrderInfoWrapper>
        <TextH4B>주문자 정보</TextH4B>
        <OrderUserInfo orderId={orderDetail?.id!} deliveryStatus={deliveryStatus} paidAt={paidAt} />
        <ButtonWrapper>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            margin="0 16px 0 0"
            disabled={!canChangeDelivery}
            onClick={cancelOrderHandler}
          >
            주문 취소하기
          </Button>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            disabled={!canChangeDelivery}
            onClick={changeDevlieryDateHandler}
          >
            배송일 변경하기
          </Button>
        </ButtonWrapper>
      </OrderInfoWrapper>
      <BorderLine height={8} />
      <DevlieryInfoWrapper>
        <OrderDetailInfo
          receiverName={receiverName}
          receiverTel={receiverTel}
          deliveryAt={deliveryAtWithDay}
          deliveryMessage={deliveryMessage}
          deliveryMessageType={deliveryMessageType}
          delivery={DELIVERY_TYPE_MAP[delivery]}
          deliveryDetail={deliveryDetail}
          location={location}
          spotName={spot?.name}
          spotPickupName={spotPickup?.name}
          status={status}
        />
        <Button
          backgroundColor={theme.white}
          color={theme.black}
          border
          disabled={isCanceled}
          onClick={changeDeliveryInfoHandler}
        >
          배송 정보 변경하기
        </Button>
      </DevlieryInfoWrapper>
      <BorderLine height={8} />
      <TotalPriceWrapper>
        <TextH4B padding="0 0 24px 0">결제정보</TextH4B>
        <FlexBetween>
          <TextH5B>총 상품 금액</TextH5B>
          <TextB2R>{menuAmount}원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween padding="8px 0 0 0">
          <TextH5B>총 할인 금액</TextH5B>
          <TextB2R>{menuDiscount + eventDiscount + coupon}원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>상품 할인</TextB2R>
          <TextB2R>{menuDiscount}원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>스팟 이벤트 할인</TextB2R>
          <TextB2R>{eventDiscount}원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>쿠폰 사용</TextB2R>
          <TextB2R>{coupon}원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="8px 0" />
        <FlexBetween padding="8px 0 0 0">
          <TextH5B>환경부담금 (일회용품)</TextH5B>
          <TextB2R>{optionAmount}원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween>
          <TextH5B>배송비</TextH5B>
          <TextB2R>{deliveryFee}원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>배송비 할인</TextB2R>
          <TextB2R>{deliveryFeeDiscount}원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween padding="8px 0 0 0">
          <TextH5B>포인트 사용</TextH5B>
          <TextB2R>{point}원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
        <FlexBetween>
          <TextH4B>최종 결제금액</TextH4B>
          <TextH4B>
            {menuAmount -
              (menuDiscount + eventDiscount + coupon) -
              (deliveryFee - deliveryFeeDiscount) -
              point -
              optionAmount}
            원
          </TextH4B>
        </FlexBetween>
        <FlexEnd padding="11px 0 0 0">
          <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
            프코 회원
          </Tag>
          <TextB3R padding="0 0 0 3px">구매 시</TextB3R>
          <TextH6B>n 포인트 (n%) 적립 예정</TextH6B>
        </FlexEnd>
      </TotalPriceWrapper>
      {isCanceled && (
        <>
          <BorderLine height={8} />
          <RefundInfoWrapper>
            <TextH4B padding="0 0 24px 0">환불정보</TextH4B>
            <FlexBetween>
              <TextH5B>총 상품 금액</TextH5B>
              <TextB2R>{menuAmount}원</TextB2R>
            </FlexBetween>
            <FlexBetween padding="8px 0 0 0">
              <TextH5B>총 할인 금액</TextH5B>
              <TextB2R>{menuDiscount}원</TextB2R>
            </FlexBetween>
            <BorderLine height={1} margin="8px 0" />
            <FlexBetween padding="8px 0 0 0">
              <TextH5B>환경부담금 (일회용품)</TextH5B>
              <TextB2R>12312원</TextB2R>
            </FlexBetween>
            <BorderLine height={1} margin="16px 0" />
            <FlexBetween>
              <TextH5B>배송비</TextH5B>
              <TextB2R>{refundDeliveryFee}원</TextB2R>
            </FlexBetween>
            <BorderLine height={1} margin="16px 0" />
            <FlexBetween>
              <TextH5B>총 결제 금액</TextH5B>
              <TextB2R>12312원</TextB2R>
            </FlexBetween>
            <FlexBetween padding="8px 0 0 0">
              <TextB2R>환불 포인트</TextB2R>
              <TextB2R>12312원</TextB2R>
            </FlexBetween>
            <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
            <FlexBetween>
              <TextH4B>최종 환불금액</TextH4B>
              <TextH4B>12312원</TextH4B>
            </FlexBetween>
            <FlexEnd padding="11px 0 0 0">
              <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
                프코 회원
              </Tag>
              <TextB3R padding="0 0 0 3px">구매 시</TextB3R>
              <TextH6B>n 포인트 (n%) 취소 예정</TextH6B>
            </FlexEnd>
          </RefundInfoWrapper>
        </>
      )}
    </Container>
  );
};

const Container = styled.div``;

const DeliveryStatusWrapper = styled.div`
  padding: 24px;
`;

const OrderItemsWrapper = styled.div`
  padding: 24px;
`;

const OrderListWrapper = styled.div<{ isShow: boolean; status: string }>`
  display: ${({ isShow }) => (isShow ? 'flex' : 'none')};
  flex-direction: column;
  padding: 24px 0 0 0;
  color: ${({ status }) => (status === 'cancel' ? theme.greyScale25 : '')};
  .percent {
    color: ${({ status }) => (status === 'cancel' ? theme.greyScale25 : '')};
  }
`;

const OrderInfoWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 24px;
`;

const DevlieryInfoWrapper = styled.div`
  padding: 24px;
`;

const TotalPriceWrapper = styled.div`
  padding: 24px;
`;

const RefundInfoWrapper = styled.div`
  padding: 24px;
`;

/* TODO: getServerSideProps아니라 static인 거 같은데  */
export async function getServerSideProps(context: any) {
  const { orderId } = context.query;

  return {
    props: { orderId },
  };
}

export default OrderDetailPage;
