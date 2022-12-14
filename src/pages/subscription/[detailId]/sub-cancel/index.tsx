import RefundOrderBox from '@components/Pages/Order/Refund/RefundOrderBox';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { TextB2R, TextB3R, TextH2B, TextH5B } from '@components/Shared/Text';
import { IOrderDetail, IResponse } from '@model/index';
import { useDeleteOrderCancel, useGetOrderDetail } from '@queries/order';
import { hide } from '@store/loading';
import { theme } from '@styles/theme';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { BtnWrapper } from '../cancel';

const SubOrderCancelPage = () => {
  const router = useRouter();
  const [detailId, setDetailId] = useState<number>();
  const [subDeliveries, setSubDeliveries] = useState([]);
  const dispatch = useDispatch();

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
    onSettled: () => {
      dispatch(hide());
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

  if (isLoading) return <div>...?????????</div>;

  return (
    <SubOrderCancelContainer>
      <DescriptionBox>
        <TextH2B>
          <b>????????????</b> ????????? <br />
          ?????? ????????? ?????????!
        </TextH2B>
        <TextB2R color={theme.greyScale65} padding="16px 0 0">
          ???????????? ????????? ?????? ????????? ?????????????????? <br />
          ???????????? ?????? ?????? ????????? ????????? ??????. <br />
          (?????? ?????? ????????? ?????? ????????? ??????????????? ??????)
        </TextB2R>
      </DescriptionBox>
      <BorderLine height={8} />
      {subDeliveries?.map((subOrder: any) => (
        <RefundOrderBox subOrder={subOrder} key={subOrder.id} />
      ))}
      <div className="orderCancelDescription">
        <TextH5B color={theme.greyScale65} padding="0 0 16px">
          ???????????? ??? ????????? ??????????????????!
        </TextH5B>
        <BorderLine height={1} />
        <TextB3R color={theme.greyScale65} padding="16px 0 0">
          ???????????? ??? ????????? ?????? ????????? ?????? ????????? ????????? ?????? ?????? ??? ?????? ????????? ??? ????????????.
        </TextB3R>
      </div>
      <BtnWrapper>
        <Button height="100%" onClick={orderCancelHandler}>
          ???????????? ?????? ????????????
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
