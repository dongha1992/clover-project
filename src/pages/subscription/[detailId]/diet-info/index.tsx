import EntireDietList from '@components/Pages/Subscription/detail/EntireDietList';
import { TextB2R } from '@components/Shared/Text';
import { periodMapper } from '@constants/subscription';
import { IOrderDetail } from '@model/index';
import { theme } from '@styles/theme';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useGetSubsOrderDetail } from 'src/queries/order';
import styled from 'styled-components';

const DietInfoPage = () => {
  const router = useRouter();
  const [detailId, setDetailId] = useState<number>();
  const [deliveryDay, setDeliveryDay] = useState<any>();

  useEffect(() => {
    if (router.isReady) {
      setDetailId(Number(router.query?.detailId));
    }
  }, [router.isReady]);

  const { data: orderDetail, isLoading } = useGetSubsOrderDetail(
    ['getOrderDetail', 'subscription', detailId],
    detailId!,
    {
      onSuccess: (data: IOrderDetail) => {
        let pickupDayObj = new Set();
        data.orderDeliveries.forEach((o) => {
          pickupDayObj.add(dayjs(o.deliveryDate).format('dd'));
        });
        setDeliveryDay(Array.from(pickupDayObj));
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!detailId,
    }
  );
  if (isLoading) return <div>...로딩중</div>;

  return (
    <Container>
      <TextB2R color={theme.brandColor} padding="16px 0 0 0">
        {orderDetail?.subscriptionPeriod === 'UNLIMITED'
          ? '5주간'
          : `${periodMapper[orderDetail?.subscriptionPeriod!]}간`}
        , 주 {deliveryDay?.length}회씩 ({deliveryDay?.join('·')}) 총 {orderDetail?.orderDeliveries.length}회 배송되는
        식단입니다.
      </TextB2R>
      <EntireDietList list={orderDetail?.orderDeliveries} />
    </Container>
  );
};
const Container = styled.div`
  padding: 0 24px;
`;
export default DietInfoPage;
