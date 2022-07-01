import RefundOrderBox from '@components/Pages/Order/Refund/RefundOrderBox';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { TextB2R, TextB3R, TextH2B, TextH5B } from '@components/Shared/Text';
import { IOrderDetail, IResponse } from '@model/index';
import { useDeleteOrderCancel, useGetOrderDetail } from '@queries/order';
import { theme } from '@styles/theme';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { BtnWrapper } from '../cancel';

const SubOrderCancelPage = () => {
  const router = useRouter();
  const [detailId, setDetailId] = useState<number>();
  const [subDeliveries, setSubDeliveries] = useState([]);

  const { mutate: deleteOrderCancel } = useDeleteOrderCancel(['deleteOrderCancel'], {
    onError: (error: IResponse | any) => {
      console.log('error', error);
    },
  });

  useEffect(() => {
    if (router.isReady) {
      setDetailId(Number(router.query.detailId));
    }
  }, [router.isReady, router.query.detailId]);

  const { isLoading } = useGetOrderDetail(['getOrderDetail', 'subscription', detailId], detailId!, {
    onSuccess: (data: IOrderDetail) => {
      let arr: any = [];
      data.orderDeliveries.forEach((o) => {
        if (
          o?.subOrderDelivery &&
          o?.subOrderDelivery.status !== 'COMPLETED' &&
          o?.subOrderDelivery.status !== 'CANCELED'
        ) {
          arr.push(o?.subOrderDelivery);
        }
        setSubDeliveries(arr);
      });
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!detailId,
  });

  const orderCancelHandler = async () => {
    subDeliveries.forEach((subOrder: any) => {
      deleteOrderCancel(subOrder.order.id);
    });

    router.push(`/subscription/${detailId}/sub-cancel/complete`);
  };

  if (isLoading) return <div>...로딩중</div>;

  return (
    <SubOrderCancelContainer>
      <DescriptionBox>
        <TextH2B>
          <b>함께배송</b> 주문을 <br />
          먼저 취소해 주세요!
        </TextH2B>
        <TextB2R color={theme.greyScale65} padding="16px 0 0">
          함께배송 주문이 있는 구독을 취소하시려면 <br />
          함께배송 주문 먼저 취소해 주셔야 해요. <br />
          (취소 가능 시간이 지난 회차의 함께배송은 제외)
        </TextB2R>
      </DescriptionBox>
      <BorderLine height={8} />
      {subDeliveries?.map((subOrder: any) => (
        <RefundOrderBox subOrder={subOrder} key={subOrder.id} />
      ))}
      <div className="orderCancelDescription">
        <TextH5B color={theme.greyScale65} padding="0 0 16px">
          주문취소 시 반드시 확인해주세요!
        </TextH5B>
        <BorderLine height={1} />
        <TextB3R color={theme.greyScale65} padding="16px 0 0">
          주문취소 시 포인트 또는 쿠폰의 사용 기한이 만료된 경우 환불 후 바로 만료될 수 있습니다.
        </TextB3R>
      </div>
      <BtnWrapper>
        <Button height="100%" onClick={orderCancelHandler}>
          함께배송 주문 취소하기
        </Button>
      </BtnWrapper>
    </SubOrderCancelContainer>
  );
};
const SubOrderCancelContainer = styled.div`
  .orderCancelDescription {
    padding: 32px 24px 52px;
  }
`;
export const DescriptionBox = styled.div`
  padding: 24px 24px 72px;
  b {
    color: ${theme.brandColor};
  }
`;

export default SubOrderCancelPage;
