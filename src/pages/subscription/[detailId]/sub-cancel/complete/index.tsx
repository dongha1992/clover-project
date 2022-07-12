import CancelFailList from '@components/Pages/Subscription/cancel/CancelFailList';
import CancelItemList from '@components/Pages/Subscription/cancel/CancelItemList';
import OrderCancelDesBox from '@components/Pages/Subscription/cancel/OrderCancelDesBox';
import OrderPartCancelDesBox from '@components/Pages/Subscription/cancel/OrderPartCancelDesBox';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { IOrderDetail } from '@model/index';
import { useGetOrderDetail } from '@queries/order';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BtnWrapper } from '../../cancel';

const SubOrderCancelCompletePage = () => {
  const router = useRouter();
  const [detailId, setDetailId] = useState<number>();
  const [subDeliveries, setSubDeliveries] = useState([]);

  useEffect(() => {
    setDetailId(Number(router.query.detailId));
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

  const goToSubscriptionDetail = () => {
    router.push(`/subscription/${detailId}`);
  };

  return (
    <SubOrderCancelCompleteContainer>
      {subDeliveries.length === 0 ? <OrderCancelDesBox /> : <OrderPartCancelDesBox />}
      <BorderLine height={8} />
      {subDeliveries.filter((d: any) => d.status !== 'CANCEL').length !== 0 && (
        <CancelFailList cancelFailList={subDeliveries.filter((d: any) => d.status !== 'CANCEL')} />
      )}
      {subDeliveries.filter((d: any) => d.status === 'CANCEL').length !== 0 && (
        <>
          <BorderLine height={8} />
          <CancelItemList cancelList={subDeliveries.filter((d: any) => d.status === 'CANCEL')} />
        </>
      )}
      <BtnWrapper>
        <Button height="100%" onClick={goToSubscriptionDetail}>
          구독 상세 보기
        </Button>
      </BtnWrapper>
    </SubOrderCancelCompleteContainer>
  );
};
const SubOrderCancelCompleteContainer = styled.div``;
export default SubOrderCancelCompletePage;
