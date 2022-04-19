import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@components/Shared/Button';
import { fixedBottom, homePadding, FlexBetween, FlexCol, FlexRow, FlexEnd } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { TextH4B, TextH2B, TextB3R, TextH5B, TextH6B, TextB2R } from '@components/Shared/Text';
import router from 'next/router';
import { theme } from '@styles/theme';
import getCustomDate from '@utils/getCustomDate';
import BorderLine from '@components/Shared/BorderLine';
import { ItemInfo } from '@components/Pages/Mypage/OrderDelivery';
import { getOrderDetailApi, deleteDeliveryApi } from '@api/order';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Tag } from '@components/Shared/Tag';
import { SET_ALERT } from '@store/alert';
import { useDispatch } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { OrderCancelSheet } from '@components/BottomSheet/OrderCancelSheet';

interface IProps {
  orderId: number;
}

interface IRefund {
  refundPayAmount: number;
  refundPoint: number;
  refundCoupon: number;
}

const orderCancelPage = ({ orderId }: IProps) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

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

      if (data.code === 200) {
        dispatch(
          SET_BOTTOM_SHEET({
            content: <OrderCancelSheet url={url} name={name} payAmount={orderDetail?.payAmount!} />,
          })
        );
      } else {
        dispatch(SET_ALERT({ alertMessage: '앗, 잠시 문제가 생겼어요! 다시 시도해 주세요.' }));
      }
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getOrderDetail');
        router.push('/mypage/order-delivery-history');
      },
      onError: async () => {
        dispatch(SET_ALERT({ alertMessage: '앗, 잠시 문제가 생겼어요! 다시 시도해 주세요.' }));
      },
    }
  );

  console.log(orderDetail);
  const subOrder = orderDetail?.orderDeliveries[0].subOrderDelivery;

  const { dayFormatter: deliverAt } = getCustomDate(new Date(subOrder?.deliveryDate!));

  const cancelOrderHandler = () => {
    const deliveryId = orderDetail?.orderDeliveries[0]?.subOrderDelivery.id!;
    deleteOrderMutation(deliveryId);
  };

  const getTotalRefund = ({ refundPayAmount, refundCoupon, refundPoint }: IRefund): number => {
    return refundPoint + refundPayAmount + refundCoupon;
  };

  useEffect(() => {
    const isSubOrderCanceled = orderDetail?.orderDeliveries[0].subOrderDelivery?.status === 'CANCELED';
    console.log(orderDetail?.orderDeliveries[0].subOrderDelivery?.status);
    if (isSubOrderCanceled) {
      router.replace('/mypage/order-delivery-history');
    }
  }, []);

  if (isLoading) {
    return <div>로딩</div>;
  }

  const {
    refundCoupon,
    refundPoint,
    refundPayAmount,
    optionQuantity,
    deliveryFee,
    deliveryFeeDiscount,
    eventDiscount,
    menuAmount,
    menuDiscount,
    point,
    optionAmount,
    payAmount,
    coupon,
  } = orderDetail!;

  return (
    <Container>
      <Wrapper>
        <FlexCol padding="24px">
          <FlexCol margin="0 0 16px 0 ">
            <FlexRow>
              <TextH2B color={theme.brandColor}>함께배송</TextH2B>
              <TextH2B>주문을</TextH2B>
            </FlexRow>
            <TextH2B>먼저 취소해 주세요</TextH2B>
          </FlexCol>
          <FlexCol>
            <TextB3R>함께배송이 있는 기존 주문을 취소하시려면</TextB3R>
            <TextB3R>함께배송 주문을 먼저 취소해 주셔야 해요.</TextB3R>
          </FlexCol>
        </FlexCol>
        <BorderLine height={8} margin="72px 0 24px 0" />
        <Header>
          <TextH4B padding="0 0 24px 0">주문상품</TextH4B>
          <FlexBetween margin="0 0 16px 0">
            <FlexRow padding="0 0 8px 0">
              <SVGIcon name="deliveryTruckIcon" />
              <TextH5B padding="2px 0 0 4px">{deliverAt} 도착예정</TextH5B>
            </FlexRow>
            <TextH6B
              textDecoration="underline"
              color="#757575"
              onClick={() =>
                router.push({
                  pathname: `/mypage/order-detail/${orderId}`,
                })
              }
            >
              주문상세 보기
            </TextH6B>
          </FlexBetween>
          <ItemInfo url={subOrder?.image.url!} name={subOrder?.order?.name!} amount={subOrder?.order?.amount!} />
        </Header>
        <RefundInfoWrapper>
          <FlexBetween>
            <TextH4B>총 결제 금액</TextH4B>
            <TextB2R>
              {getTotalRefund({
                refundPayAmount,
                refundCoupon,
                refundPoint,
              })}
              원
            </TextB2R>
          </FlexBetween>
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>환불 금액</TextB2R>
            <TextB2R>{refundPayAmount}원</TextB2R>
          </FlexBetween>
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>환불 쿠폰</TextB2R>
            <TextB2R>{refundCoupon}원</TextB2R>
          </FlexBetween>
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>환불 포인트</TextB2R>
            <TextB2R>{refundPoint}원</TextB2R>
          </FlexBetween>
          <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
          <FlexBetween>
            <TextH4B>최종 환불금액</TextH4B>
            <TextH4B>
              {getTotalRefund({
                refundPayAmount,
                refundCoupon,
                refundPoint,
              })}
              원
            </TextH4B>
          </FlexBetween>
          <FlexEnd padding="11px 0 0 0">
            <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
              프코 회원
            </Tag>
            <TextB3R padding="0 0 0 3px">구매 시</TextB3R>
            <TextH6B>n 포인트 (n%) 취소 예정</TextH6B>
          </FlexEnd>
        </RefundInfoWrapper>
      </Wrapper>
      <BtnWrapper onClick={cancelOrderHandler}>
        <Button height="100%">주문 취소하기</Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.div``;
const Header = styled.div`
  padding: 0 24px;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div``;

const RefundInfoWrapper = styled.div`
  padding: 24px;
  margin-top: 24px;
  background-color: ${theme.greyScale3};
`;

const BtnWrapper = styled.div`
  ${fixedBottom}
`;

export async function getServerSideProps(context: any) {
  const { orderId } = context.query;

  return {
    props: { orderId },
  };
}

export default orderCancelPage;
