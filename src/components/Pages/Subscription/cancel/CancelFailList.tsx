import { OrderItem } from '@components/Pages/Order/Refund/RefundOrderBox';
import { Button } from '@components/Shared/Button';
import { TextB3R, TextH4B, TextH5B, TextH6B } from '@components/Shared/Text';
import { IMAGE_S3_URL } from '@constants/mock';
import { IResponse } from '@model/index';
import { useDeleteOrderCancel } from '@queries/order';
import { FlexBetween, FlexRow, theme } from '@styles/theme';
import { getFormatDate, getFormatPrice, SVGIcon } from '@utils/common';
import Image from 'next/image';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import styled from 'styled-components';
interface IProps {
  cancelFailList: any;
}
const CancelFailList = ({ cancelFailList }: IProps) => {
  const queryClient = useQueryClient();
  const [detailId, setDetailId] = useState<number>();

  useEffect(() => {
    if (router.isReady) {
      setDetailId(Number(router.query.detailId));
    }
  }, [router.isReady, router.query.detailId]);

  const { mutate: deleteOrderCancel } = useDeleteOrderCancel(['deleteOrderCancel'], {
    onError: (error: IResponse | any) => {
      console.log('error', error);
    },
  });

  const orderCancelHandler = async () => {
    cancelFailList.forEach((subOrder: any) => {
      deleteOrderCancel(subOrder.order.id);
    });
    queryClient.invalidateQueries(['getOrderDetail', 'subscription', detailId]);
  };

  const goToOrderDetail = (id: number) => {
    router.push(`/mypage/order-detail/${id}`);
  };

  return (
    <CancelFailListContainer>
      <TextH4B padding="0 0 24px" color={theme.systemRed}>
        취소실패
      </TextH4B>
      {cancelFailList.map((item: any) => (
        <div key={item.id} className="failItem">
          <FlexBetween padding="0 0 16px">
            <FlexRow>
              <SVGIcon name="delivery" />
              <TextH5B>{getFormatDate(item.deliveryDate)} 도착예정</TextH5B>
            </FlexRow>
            <TextH6B
              pointer
              textDecoration="underline"
              color="#757575"
              onClick={() => {
                goToOrderDetail(item.order.id);
              }}
            >
              주문상세 보기
            </TextH6B>
          </FlexBetween>
          <OrderItem key={item.id}>
            <div className="imgBox">
              <Image
                src={IMAGE_S3_URL + item?.image.url}
                alt="상품이미지"
                width={'100%'}
                height={'100%'}
                layout="responsive"
                className="rounded"
              />
            </div>
            <div className="textBox">
              <TextB3R textHideMultiline>{item?.order?.name}</TextB3R>
              <TextH5B>{getFormatPrice(String(item?.order?.payAmount))}원</TextH5B>
            </div>
          </OrderItem>
        </div>
      ))}
      <Button backgroundColor="#fff" color="#242424" border onClick={orderCancelHandler}>
        다시 주문 취소하기
      </Button>
    </CancelFailListContainer>
  );
};
const CancelFailListContainer = styled.div`
  padding: 24px;
  .failItem {
    padding-bottom: 16px;
  }
`;
export default CancelFailList;
