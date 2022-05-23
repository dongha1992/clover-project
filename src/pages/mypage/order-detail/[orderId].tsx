import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FlexRow, theme, FlexBetween, FlexEnd, FlexRowStart } from '@styles/theme';
import { TextH4B, TextB3R, TextB1R, TextB2R, TextH5B, TextH6B } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { OrderItem } from '@components/Pages/Order';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { Obj } from '@model/index';
import { useToast } from '@hooks/useToast';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { Tag } from '@components/Shared/Tag';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { SET_USER_DELIVERY_TYPE } from '@store/destination';
import { DeliveryInfoSheet } from '@components/BottomSheet/DeliveryInfoSheet';
import { CalendarSheet } from '@components/BottomSheet/CalendarSheet';
import { mypageSelector } from '@store/mypage';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { IOrderMenus } from '@model/index';
import { getCustomDate } from '@utils/destination';
import { OrderDetailInfo, SubOrderInfo, OrderInfo } from '@components/Pages/Mypage/OrderDelivery';
import { getOrderDetailApi, deleteDeliveryApi } from '@api/order';
import { DELIVERY_STATUS_MAP } from '@constants/mypage';
import { DELIVERY_TIME_MAP, DELIVERY_TYPE_MAP } from '@constants/order';
import dayjs from 'dayjs';

import { OrderCancelSheet } from '@components/BottomSheet/OrderCancelSheet';
import { getTotalPayment } from '@utils/getTotalPayment';
import { AxiosError } from 'axios';
// temp

const disabledDates: any = [];

/* TODO: delvieryId의 경우 orderDeliveris[0].id 사용 */
/* 단건의 경우 배열 요소 하나 하지만 정기구독은 배열형태임 */

const OrderDetailPage = ({ orderId }: { orderId: number }) => {
  const [isShowOrderItemSection, setIsShowOrderItemSection] = useState<boolean>(false);

  const { showToast } = useToast();

  const dispatch = useDispatch();

  const router = useRouter();

  const queryClient = useQueryClient();

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

  const { mutate: deleteOrderMutation } = useMutation(
    async (deliveryId: number) => {
      const { data } = await deleteDeliveryApi(deliveryId);
    },
    {
      onSuccess: async () => {
        if (orderDeliveries?.type === 'SUB') {
          dispatch(
            SET_BOTTOM_SHEET({
              content: (
                <OrderCancelSheet
                  name={orderDetail?.name!}
                  url={orderDetail?.image.url!}
                  payAmount={orderDetail?.payAmount!}
                  orderId={orderDetail?.id!}
                />
              ),
            })
          );
        } else {
          router.push('/mypage/order-delivery-history');
        }

        await queryClient.refetchQueries('getOrderDetail');
      },
      onError: async (error: AxiosError) => {},
    }
  );

  const paidAt = dayjs(orderDetail?.paidAt).format('YYYY-MM-DD HH:mm');
  const orderDeliveries = orderDetail && orderDetail?.orderDeliveries[0]!;
  const { dateFormatter: deliveryAt, dayFormatter: deliveryAtWithDay } = getCustomDate(
    new Date(orderDetail?.orderDeliveries[0].deliveryDate!)
  );

  const deliveryStatus = DELIVERY_STATUS_MAP[orderDeliveries?.status!];
  const deliveryDetail = DELIVERY_TIME_MAP[orderDetail?.deliveryDetail!];
  const isCompleted = orderDeliveries?.status === 'COMPLETED';
  const isCanceled = orderDeliveries?.status === 'CANCELED';
  const isDelivering = orderDeliveries?.status === 'DELIVERING';
  const canChangeDelivery = orderDeliveries?.status === 'RESERVED';
  const isSubOrder = orderDeliveries?.type === 'SUB';
  const hasSubOrder = orderDeliveries?.subOrderDelivery;
  const isSubOrderCanceled = orderDeliveries?.subOrderDelivery?.status === 'CANCELED';
  const deliveryId = orderDeliveries?.id!;
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
      case 'RESERVED': {
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
    if (!canChangeDelivery || isCanceled) {
      return;
    }

    if (!isSubOrder) {
      dispatch(
        SET_ALERT({
          alertMessage: '기존 주문 배송정보를 변경하시면 함께배송 주문 배송정보도 함께 변경됩니다. 변경하시겠어요?',
          onSubmit: () =>
            router.push({
              pathname: '/mypage/order-detail/edit/[orderId]',
              query: { orderId },
            }),
          closeBtnText: '취소',
        })
      );
    } else {
      router.push({
        pathname: '/mypage/order-detail/edit/[orderId]',
        query: { orderId },
      });
    }
  };

  const cancelOrderHandler = () => {
    if (!canChangeDelivery || isCanceled) {
      return;
    }

    const deliveryId = orderDeliveries?.id!;

    let alertMessage = '';
    let submitBtnText = '확인';
    let onSubmit = null;

    if (isSubOrder) {
      alertMessage = '함께배송 주문은 취소 후 재주문할 수 없어요. 정말 취소하시겠어요?';
      onSubmit = () => deleteOrderMutation(deliveryId);
    } else if (hasSubOrder && !isSubOrder && !isSubOrderCanceled) {
      alertMessage = '함께배송 주문을 먼저 취소해야 기존 주문을 취소할 수 있어요. 함께배송 주문을 취소하시겠어요?';
      submitBtnText = '주문 취소하기';
      onSubmit = () => router.push(`/mypage/order-detail/cancel/${orderId}`);
    } else if (!hasSubOrder) {
      alertMessage = '정말 주문을 취소하시겠어요?';
      onSubmit = () => deleteOrderMutation(deliveryId);
    } else {
      alertMessage = '정말 주문을 취소하시겠어요?';
      onSubmit = () => deleteOrderMutation(deliveryId);
    }

    dispatch(
      SET_ALERT({
        alertMessage,
        onSubmit,
        submitBtnText,
        closeBtnText: '취소',
      })
    );
  };

  const changeDevlieryDateHandler = () => {
    // if (!canChangeDelivery || isSubOrder) {
    //   return;
    // }

    if (hasSubOrder && !isSubOrder && !isSubOrderCanceled) {
      dispatch(
        SET_ALERT({
          alertMessage: '기존 주문 배송일을 변경하시면 함께배송 주문 배송일도 함께 변경됩니다. 변경하시겠어요?',
          onSubmit: () => {
            dispatch(
              SET_BOTTOM_SHEET({
                content: (
                  <CalendarSheet
                    isSheet
                    title="배송일 변경"
                    disabledDates={disabledDates}
                    deliveryAt={orderDeliveries.deliveryDate!}
                    deliveryId={deliveryId}
                  />
                ),
              })
            );
            dispatch(SET_USER_DELIVERY_TYPE(delivery.toLocaleLowerCase()));
          },
          closeBtnText: '취소',
        })
      );
    } else {
      dispatch(
        SET_BOTTOM_SHEET({
          content: (
            <CalendarSheet
              isSheet
              title="배송일 변경"
              disabledDates={disabledDates}
              deliveryAt={orderDeliveries?.deliveryDate!}
              deliveryId={deliveryId}
            />
          ),
        })
      );
      dispatch(SET_USER_DELIVERY_TYPE(delivery.toLocaleLowerCase()));
    }
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
    refundOptionAmount,
    refundOptionQuantity,
    refundPoint,
    optionQuantity,
    deliveryFee,
    deliveryFeeDiscount,
    eventDiscount,
    menuAmount,
    menuDiscount,
    refundPayAmount,
    payAmount,
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
    spotName,
    spotPickupId,
    spotPickupName,
    spotPickupType,
  } = orderDeliveries!;

  return (
    <Container>
      <DeliveryStatusWrapper>
        <FlexRow padding="0 0 13px 0">
          {isSubOrder && (
            <Tag backgroundColor={theme.brandColor5P} color={theme.brandColor} margin="0 4px 0 0px">
              함께배송
            </Tag>
          )}
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
            return <OrderItem menu={menu} key={index} isDeliveryComplete={isCompleted} isCanceled={isCanceled} />;
          })}
          <Button backgroundColor={theme.white} color={theme.black} border margin="8px 0 0 0">
            재주문하기
          </Button>
        </OrderListWrapper>
      </OrderItemsWrapper>
      <BorderLine height={8} />
      <OrderInfoWrapper>
        <TextH4B>주문정보</TextH4B>
        <OrderInfo orderId={orderDetail?.id!} deliveryStatus={deliveryStatus} paidAt={paidAt} />
        {isSubOrder && <SubOrderInfo isChange />}
        <Button
          backgroundColor={theme.white}
          color={theme.black}
          border
          margin="24px 0 0 0"
          disabled={!canChangeDelivery}
          onClick={cancelOrderHandler}
        >
          주문 취소하기
        </Button>
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
          spotName={spotName}
          spotPickupName={spotPickupName}
          status={status}
        />
        {isSubOrder && <SubOrderInfo isDestinationChange />}
        <ButtonWrapper>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            disabled={!canChangeDelivery || isSubOrder}
            onClick={changeDeliveryInfoHandler}
            margin="0 16px 0 0"
          >
            배송 정보 변경하기
          </Button>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            disabled={!canChangeDelivery || isSubOrder}
            onClick={changeDevlieryDateHandler}
          >
            배송일 변경하기
          </Button>
        </ButtonWrapper>
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
          <TextH4B>{payAmount}원</TextH4B>
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
              <TextB2R>{refundOptionAmount}원</TextB2R>
            </FlexBetween>
            <BorderLine height={1} margin="16px 0" />
            <FlexBetween>
              <TextH5B>배송비</TextH5B>
              <TextB2R>{refundDeliveryFee}원</TextB2R>
            </FlexBetween>
            <BorderLine height={1} margin="16px 0" />
            <FlexBetween>
              <TextH4B>총 결제 금액</TextH4B>
              <TextB2R>{1111}원</TextB2R>
            </FlexBetween>
            <FlexBetween padding="8px 0 0 0">
              <TextB2R>환불 금액</TextB2R>
              <TextB2R>{refundPoint}원</TextB2R>
            </FlexBetween>
            <FlexBetween padding="8px 0 0 0">
              <TextB2R>환불 쿠폰</TextB2R>
              <TextB2R>{11111}원</TextB2R>
            </FlexBetween>
            <FlexBetween padding="8px 0 0 0">
              <TextB2R>환불 포인트</TextB2R>
              <TextB2R>{refundPoint}원</TextB2R>
            </FlexBetween>
            <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
            <FlexBetween>
              <TextH4B>최종 환불금액</TextH4B>
              <TextH4B>{refundPayAmount}원</TextH4B>
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
