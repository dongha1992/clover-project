import { OrderItem } from '@components/Pages/Order/Refund/RefundOrderBox';
import SubsCancelDesBox from '@components/Pages/Subscription/cancel/SubsCancelDesBox';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { TextB3R, TextH4B, TextH5B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { useGetOrderDetail } from '@queries/order';
import { theme } from '@styles/theme';
import { getFormatPrice } from '@utils/common';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BtnWrapper } from '..';

const SubOrderCancelCompletePage = () => {
  const router = useRouter();
  const [detailId, setDetailId] = useState<any>();
  const { data: orderDetail, isLoading } = useGetOrderDetail(['getOrderDetail', 'subscription', detailId], detailId!, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!detailId,
  });

  useEffect(() => {
    if (router.isReady) {
      setDetailId(Number(router.query.detailId));
    }
  }, [router.isReady, router.query.detailId]);

  const goToSubscriptionDetail = () => {
    router.push(`/subscription/${detailId}`);
  };

  return (
    <SubOrderCancelCompleteContainer>
      <SubsCancelDesBox />
      <BorderLine height={8} />
      <div className="cancelItemBox">
        <TextH4B padding="0 0 24px 0" color={theme.greyScale65}>
          취소완료
        </TextH4B>
        <OrderItem>
          <div className="imgBox">
            <Image
              src={IMAGE_S3_URL + orderDetail?.image.url}
              alt="상품이미지"
              width={'100%'}
              height={'100%'}
              layout="responsive"
              className="rounded"
            />
          </div>
          <div className="textBox">
            <TextB3R textHideMultiline>{orderDetail?.name}</TextB3R>
            <TextH5B>
              {getFormatPrice(String(orderDetail?.refundMenuAmount + orderDetail?.refundOptionAmount))}원
            </TextH5B>
          </div>
        </OrderItem>
      </div>
      <BtnWrapper>
        <Button height="100%" onClick={goToSubscriptionDetail}>
          구독 상세 보기
        </Button>
      </BtnWrapper>
    </SubOrderCancelCompleteContainer>
  );
};
const SubOrderCancelCompleteContainer = styled.div`
  .cancelItemBox {
    padding: 24px;
  }
`;
export default SubOrderCancelCompletePage;
