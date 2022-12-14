import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@components/Shared/Button';
import { fixedBottom, homePadding, FlexBetween, FlexCol, FlexRow, FlexEnd } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { TextH4B, TextH2B, TextB3R, TextH5B, TextH6B, TextB2R } from '@components/Shared/Text';
import router from 'next/router';
import { theme } from '@styles/theme';
import { getCustomDate } from '@utils/destination';
import BorderLine from '@components/Shared/BorderLine';
import { ItemInfo } from '@components/Pages/Mypage/OrderDelivery';
import { getOrderDetailApi, deleteDeliveryApi } from '@api/order';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Tag } from '@components/Shared/Tag';
import { SET_ALERT } from '@store/alert';
import { useDispatch } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { OrderCancelSheet } from '@components/BottomSheet/OrderCancelSheet';
import { getFormatPrice } from '@utils/common';
import { show, hide } from '@store/loading';
interface IProps {
  orderId: number;
}

interface IRefund {
  payAmount: number;
  coupon: number;
  point: number;
}

const OrderCancelPage = ({ orderId }: IProps) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { data: orderDetail, isLoading } = useQuery(
    'getOrderDetail',
    async () => {
      dispatch(show());
      const { data } = await getOrderDetailApi(orderId);
      return data.data;
    },
    {
      onSuccess: (data) => {
        const isSubOrderCanceled = data?.orderDeliveries[0].subOrderDelivery?.status === 'CANCELED';
        if (isSubOrderCanceled) {
          router.replace('/mypage/order-delivery-history');
        }
      },
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const subOrder = orderDetail?.orderDeliveries[0].subOrderDelivery;

  const { mutate: deleteOrderMutation } = useMutation(
    async (deliveryId: number) => {
      const { data } = await deleteDeliveryApi(deliveryId);

      if (data.code === 200) {
        dispatch(
          SET_BOTTOM_SHEET({
            content: (
              <OrderCancelSheet
                url={subOrder?.image.url!}
                name={subOrder?.order.name!}
                payAmount={subOrder?.order.amount!}
                orderId={orderId}
                isSubOrder
              />
            ),
          })
        );
      } else {
        dispatch(SET_ALERT({ alertMessage: '???, ?????? ????????? ????????????! ?????? ????????? ?????????.' }));
      }
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getOrderDetail');
        router.push('/mypage/order-delivery-history');
      },
      onError: async () => {
        dispatch(SET_ALERT({ alertMessage: '???, ?????? ????????? ????????????! ?????? ????????? ?????????.' }));
      },
    }
  );

  const { dayFormatter: deliverAt } = getCustomDate(subOrder?.deliveryDate!);

  const cancelOrderHandler = () => {
    const deliveryId = orderDetail?.orderDeliveries[0]?.subOrderDelivery.id!;
    deleteOrderMutation(deliveryId);
  };

  const getTotalRefund = ({ payAmount, coupon, point }: IRefund): string => {
    return getFormatPrice(String(payAmount + coupon + point));
  };

  if (isLoading) {
    return <div></div>;
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
              <TextH2B color={theme.brandColor}>????????????</TextH2B>
              <TextH2B>?????????</TextH2B>
            </FlexRow>
            <TextH2B>?????? ????????? ?????????</TextH2B>
          </FlexCol>
          <FlexCol>
            <TextB3R>??????????????? ?????? ?????? ????????? ??????????????????</TextB3R>
            <TextB3R>???????????? ????????? ?????? ????????? ????????? ??????.</TextB3R>
          </FlexCol>
        </FlexCol>
        <BorderLine height={8} margin="72px 0 24px 0" />
        <Header>
          <TextH4B padding="0 0 24px 0">????????????</TextH4B>
          <FlexBetween margin="0 0 16px 0">
            <FlexRow padding="0 0 8px 0">
              <SVGIcon name="deliveryTruckIcon" />
              <TextH5B padding="2px 0 0 4px">{deliverAt} ????????????</TextH5B>
            </FlexRow>
            <TextH6B
              pointer
              textDecoration="underline"
              color="#757575"
              onClick={() =>
                router.push({
                  pathname: `/mypage/order-detail/${subOrder?.id}`,
                })
              }
            >
              ???????????? ??????
            </TextH6B>
          </FlexBetween>
          <ItemInfo url={subOrder?.image.url!} name={subOrder?.order?.name!} amount={subOrder?.order?.amount!} />
        </Header>
        <RefundInfoWrapper>
          <FlexBetween>
            <TextH4B>??? ?????? ??????</TextH4B>
            <TextB2R>
              {getTotalRefund({
                payAmount,
                coupon,
                point,
              })}
              ???
            </TextB2R>
          </FlexBetween>
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>?????? ??????</TextB2R>
            <TextB2R>{getFormatPrice(String(payAmount))}???</TextB2R>
          </FlexBetween>
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>?????? ??????</TextB2R>
            <TextB2R>{getFormatPrice(String(coupon))}???</TextB2R>
          </FlexBetween>
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>?????? ?????????</TextB2R>
            <TextB2R>{getFormatPrice(String(point))}???</TextB2R>
          </FlexBetween>
          <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
          <FlexBetween>
            <TextH4B>?????? ????????????</TextH4B>
            <TextH4B>
              {getTotalRefund({
                payAmount,
                coupon,
                point,
              })}
              ???
            </TextH4B>
          </FlexBetween>
          <FlexEnd padding="11px 0 0 0">
            <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
              ?????? ??????
            </Tag>
            <TextB3R padding="0 0 0 3px">?????? ???</TextB3R>
            <TextH6B>n ????????? (n%) ?????? ??????</TextH6B>
          </FlexEnd>
        </RefundInfoWrapper>
      </Wrapper>
      <BtnWrapper onClick={cancelOrderHandler}>
        <Button height="100%" width="100%">
          ???????????? ?????? ????????????
        </Button>
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

export default OrderCancelPage;
