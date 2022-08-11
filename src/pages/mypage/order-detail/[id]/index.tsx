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
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { IOrderMenus } from '@model/index';
import { getCustomDate } from '@utils/destination';
import { OrderDetailInfo, SubOrderInfo, OrderInfo } from '@components/Pages/Mypage/OrderDelivery';
import { getOrderDetailApi, deleteDeliveryApi } from '@api/order';
import { postCartsApi } from '@api/cart';
import { DELIVERY_STATUS_MAP } from '@constants/mypage';
import { DELIVERY_TIME_MAP, DELIVERY_TYPE_MAP } from '@constants/order';
import dayjs from 'dayjs';
import { getFormatPrice } from '@utils/common';
import { calculatePoint } from '@utils/menu';
import { userForm } from '@store/user';
import { INIT_TEMP_ORDER_INFO, INIT_TEMP_EDIT_DESTINATION, INIT_TEMP_EDIT_SPOT } from '@store/mypage';

import { OrderCancelSheet } from '@components/BottomSheet/OrderCancelSheet';
import { getTotalPayment } from '@utils/getTotalPayment';
import { AxiosError } from 'axios';
import { INIT_ACCESS_METHOD } from '@store/common';
// temp

const disabledDates: any = [];

/* delvieryId의 경우 orderDeliveris[0].id 사용 */
/* 단건의 경우 배열 요소 하나 하지만 정기구독은 배열형태임 */

const OrderDetailPage = () => {
  const [isShowOrderItemSection, setIsShowOrderItemSection] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<number>();
  const { showToast } = useToast();

  const dispatch = useDispatch();

  const router = useRouter();
  const { me } = useSelector(userForm);

  const queryClient = useQueryClient();

  const { data: orderDetail, isLoading } = useQuery(
    ['getOrderDetail'],
    async () => {
      const { data } = await getOrderDetailApi(orderId!);
      return data?.data;
    },
    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!orderId,
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

        await queryClient.refetchQueries('getOrderLists');
      },
      onError: async (error: AxiosError) => {},
    }
  );

  const { mutateAsync: mutateAddCartItem } = useMutation(
    async () => {
      const reqBody = orderDeliveries?.orderMenus.map((item) => {
        return {
          menuId: item.menuId,
          menuDetailId: item.menuDetailId,
          quantity: item.menuQuantity,
          main: true,
        };
      });

      const { data } = await postCartsApi(reqBody!);
    },
    {
      onError: (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '장바구니 담기에 실패했어요' }));
      },
      onSuccess: async () => {
        showToast({ message: '상품을 장바구니에 담았어요! 😍' });
        await queryClient.refetchQueries('getCartList');
        await queryClient.refetchQueries('getCartCount');
      },
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
                {orderDeliveries?.invoiceNumber}
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

  const goToCart = () => {
    mutateAddCartItem();
  };

  const changeDeliveryInfoHandler = () => {
    if (!canChangeDelivery || isCanceled) {
      return;
    }

    if (isSubOrder) {
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
    let alertSubMessage = '';
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
      alertSubMessage = '(사용 기한이 만료된 포인트, 쿠폰은 환불 후 바로 만료될 수 있어요.)';
      onSubmit = () => deleteOrderMutation(deliveryId);
    } else {
      alertMessage = '정말 주문을 취소하시겠어요?';
      alertSubMessage = '(사용 기한이 만료된 포인트, 쿠폰은 환불 후 바로 만료될 수 있어요.)';
      onSubmit = () => deleteOrderMutation(deliveryId);
    }

    dispatch(
      SET_ALERT({
        alertMessage,
        onSubmit,
        alertSubMessage,
        submitBtnText,
        closeBtnText: '취소',
      })
    );
  };

  const changeDevlieryDateHandler = () => {
    if (!canChangeDelivery || isSubOrder) {
      return;
    }

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

  useEffect(() => {
    if (router.isReady) {
      setOrderId(Number(router.query?.id));
    }
  }, [router.isReady]);

  useEffect(() => {
    dispatch(INIT_TEMP_ORDER_INFO());
    dispatch(INIT_TEMP_EDIT_DESTINATION());
    dispatch(INIT_ACCESS_METHOD());
    dispatch(INIT_TEMP_EDIT_SPOT());
  }, []);

  if (!orderDetail) {
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
    payMethod,
    refundCoupon,
    refundMenuQuantity,
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
    name,
    orderOptions,
  } = orderDeliveries!;

  const totalDiscount =
    menuDiscount + eventDiscount + coupon > 0
      ? `-${getFormatPrice(String(menuDiscount + eventDiscount + coupon))}원`
      : '0원';

  const totalRefundDiscount =
    refundMenuDiscount + refundEventDiscount + refundCoupon > 0
      ? `-${getFormatPrice(String(refundMenuDiscount + refundEventDiscount + refundCoupon))}원`
      : '0원';

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
        <FlexBetween onClick={() => showSectionHandler()}>
          <TextH4B>주문상품</TextH4B>
          <FlexRow>
            <SVGIcon name={isShowOrderItemSection ? 'triangleUp' : 'triangleDown'} />
          </FlexRow>
        </FlexBetween>
        <OrderListWrapper isShow={isShowOrderItemSection} status={deliveryStatus}>
          {orderMenus?.map((menu: IOrderMenus, index: number) => {
            return <OrderItem menu={menu} key={index} isDeliveryComplete={isCompleted} isCanceled={isCanceled} />;
          })}
          <Button backgroundColor={theme.white} color={theme.black} border margin="8px 0 0 0" onClick={goToCart}>
            장바구니 담기
          </Button>
        </OrderListWrapper>
      </OrderItemsWrapper>
      <BorderLine height={8} />
      <OrderInfoWrapper>
        <TextH4B>주문정보</TextH4B>
        <OrderInfo orderId={orderDetail?.id!} deliveryStatus={deliveryStatus} paidAt={paidAt} payMethod={payMethod} />
        {isSubOrder && <SubOrderInfo isChange />}
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
          name={name!}
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
          <TextB2R>{getFormatPrice(String(menuAmount))}원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween padding="8px 0 0 0">
          <TextH5B>총 할인 금액</TextH5B>
          <TextB2R>{totalDiscount}</TextB2R>
        </FlexBetween>
        {menuDiscount > 0 && (
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>상품 할인</TextB2R>
            <TextB2R>{getFormatPrice(String(menuDiscount))}원</TextB2R>
          </FlexBetween>
        )}
        {eventDiscount > 0 && (
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>스팟 이벤트 할인</TextB2R>
            <TextB2R>{getFormatPrice(String(eventDiscount))}원</TextB2R>
          </FlexBetween>
        )}
        {coupon > 0 && (
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>쿠폰 사용</TextB2R>
            <TextB2R>{getFormatPrice(String(coupon))}원</TextB2R>
          </FlexBetween>
        )}
        <BorderLine height={1} margin="8px 0" />
        <FlexBetween padding="8px 0 0 0">
          <TextH5B>환경부담금 (일회용품)</TextH5B>
          <TextB2R>{getFormatPrice(String(optionAmount))}원</TextB2R>
        </FlexBetween>
        {orderOptions.map((item) => {
          return (
            <FlexBetween padding="8px 0 0 0" key={item.id}>
              <TextB2R>{item.optionName}</TextB2R>
              <TextB2R>
                {item.optionQuantity}개 / {getFormatPrice(String(item.optionPrice * item.optionQuantity))}원
              </TextB2R>
            </FlexBetween>
          );
        })}

        <BorderLine height={1} margin="16px 0" />
        <FlexBetween>
          <TextH5B>배송비</TextH5B>
          <TextB2R>{getFormatPrice(String(deliveryFee))}원</TextB2R>
        </FlexBetween>
        {deliveryFeeDiscount > 0 && (
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>배송비 할인</TextB2R>
            <TextB2R>{getFormatPrice(String(deliveryFeeDiscount))}원</TextB2R>
          </FlexBetween>
        )}
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween padding="8px 0 0 0">
          <TextH5B>포인트 사용</TextH5B>
          <TextB2R>{getFormatPrice(String(point))}원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
        <FlexBetween>
          <TextH4B>최종 결제금액</TextH4B>
          <TextH4B>{getFormatPrice(String(payAmount))}원</TextH4B>
        </FlexBetween>
        <FlexEnd padding="11px 0 0 0">
          <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
            {me?.grade?.name!}
          </Tag>
          <TextB3R padding="0 0 0 3px">구매 시 </TextB3R>
          <TextH6B>
            {calculatePoint({
              rate: me?.grade.benefit.accumulationRate!,
              total: payAmount + point,
            })}
            P ({me?.grade.benefit.accumulationRate}%) 적립 예정
          </TextH6B>
        </FlexEnd>
      </TotalPriceWrapper>
      {isCanceled && (
        <>
          <BorderLine height={8} />
          <RefundInfoWrapper>
            <TextH4B padding="0 0 24px 0">환불정보</TextH4B>
            <FlexBetween>
              <TextH5B>총 상품 금액</TextH5B>
              <TextB2R>{getFormatPrice(String(refundMenuAmount))}원</TextB2R>
            </FlexBetween>
            <FlexBetween padding="8px 0 0 0">
              <TextH5B>총 할인 금액</TextH5B>
              <TextB2R>{totalRefundDiscount}</TextB2R>
            </FlexBetween>
            {refundMenuDiscount > 0 && (
              <FlexBetween padding="8px 0 0 0">
                <TextB2R>상품 할인</TextB2R>
                <TextB2R>{getFormatPrice(String(refundMenuDiscount))}원</TextB2R>
              </FlexBetween>
            )}
            {refundEventDiscount > 0 && (
              <FlexBetween padding="8px 0 0 0">
                <TextB2R>스팟 이벤트 할인</TextB2R>
                <TextB2R>{getFormatPrice(String(refundEventDiscount))}원</TextB2R>
              </FlexBetween>
            )}
            {refundCoupon > 0 && (
              <FlexBetween padding="8px 0 0 0">
                <TextB2R>쿠폰 사용</TextB2R>
                <TextB2R>{getFormatPrice(String(refundCoupon))}원</TextB2R>
              </FlexBetween>
            )}
            <BorderLine height={1} margin="8px 0" />
            <FlexBetween padding="8px 0 0 0">
              <TextH5B>환경부담금 (일회용품)</TextH5B>
              <TextB2R>{getFormatPrice(String(refundOptionAmount))}원</TextB2R>
            </FlexBetween>
            <BorderLine height={1} margin="16px 0" />
            <FlexBetween>
              <TextH5B>배송비</TextH5B>
              <TextB2R>{getFormatPrice(String(refundDeliveryFee))}원</TextB2R>
            </FlexBetween>
            <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
            <FlexBetween>
              <TextH4B>최종 환불합계</TextH4B>
              <TextH4B>{getFormatPrice(String(refundCoupon + refundPoint + refundPayAmount))}원</TextH4B>
            </FlexBetween>
            <RefundContainer>
              {refundPayAmount > 0 && (
                <FlexBetween padding="8px 0 0 0">
                  <TextB2R>환불 금액</TextB2R>
                  <TextB2R>{getFormatPrice(String(refundPayAmount))}원</TextB2R>
                </FlexBetween>
              )}
              {refundCoupon > 0 && coupon > 0 && (
                <FlexBetween padding="8px 0 0 0">
                  <TextB2R>환불 쿠폰</TextB2R>
                  <TextB2R>1개</TextB2R>
                </FlexBetween>
              )}
              {refundPoint > 0 && (
                <FlexBetween padding="8px 0 0 0">
                  <TextB2R>환불 포인트</TextB2R>
                  <TextB2R>{getFormatPrice(String(refundPoint))}원</TextB2R>
                </FlexBetween>
              )}
            </RefundContainer>
            <FlexEnd padding="11px 0 0 0">
              <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
                {me?.grade?.name!}
              </Tag>
              <TextB3R padding="0 0 0 3px">환불 시 </TextB3R>
              <TextH6B>
                {calculatePoint({
                  rate: me?.grade.benefit.accumulationRate!,
                  total: refundCoupon + refundPoint + refundPayAmount,
                })}
                P ({me?.grade.benefit.accumulationRate}%) 환불 예정
              </TextH6B>
            </FlexEnd>
          </RefundInfoWrapper>
        </>
      )}
      <CancelButtonContainer>
        <CancelInfo>
          <FlexRow>
            <SVGIcon name="exclamationMark" />
            <TextB3R padding="0 0 0 4px">주문 변경 및 취소 시 반드시 확인해주세요!</TextB3R>
          </FlexRow>
          <TextB3R>
            주문 변경 및 취소는 수령일 하루 전 오후 3시까지 가능합니다. 단, 오전 7시~9시 반 사이에는 주문 직후 5분 뒤
            제조가 시작되어 취소 불가합니다.
          </TextB3R>
        </CancelInfo>
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
      </CancelButtonContainer>
    </Container>
  );
};

const Container = styled.div``;

const DeliveryStatusWrapper = styled.div`
  padding: 24px;
`;

const OrderItemsWrapper = styled.div`
  padding: 24px;
  cursor: pointer;
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

const CancelInfo = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.greyScale3};
  margin-bottom: 24px;
`;

const CancelButtonContainer = styled.div`
  padding: 24px;
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

const RefundContainer = styled.div`
  padding: 16px;
  margin-top: 16px;
  background: ${theme.greyScale3};
`;

export default OrderDetailPage;
