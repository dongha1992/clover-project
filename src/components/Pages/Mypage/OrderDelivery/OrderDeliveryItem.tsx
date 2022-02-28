import { FlexBetween, FlexCol, FlexRow, theme } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH5B, TextB3R, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import SVGIcon from '@utils/SVGIcon';
import { Button } from '@components/Shared/Button';
import router from 'next/router';
import { DeliveryTag } from '@components/Shared/Tag';
import getCustomDate from '@utils/getCustomDate';
import { Obj } from '@model/index';
import { IMAGE_S3_URL } from '@constants/mock';
interface IProps {
  deliveryItem: any;
  buttonHandler: ({ id, isDelivering }: { id: number; isDelivering: boolean }) => void;
}

const OrderDeliveryItem = ({ deliveryItem, buttonHandler }: IProps) => {
  console.log(deliveryItem, 'deliveryItem');

  const deliveryStatusMap: Obj = {
    COMPLETED: '배송완료',
    CANCELED: '주문취소',
    DELIVERING: '배송 중',
    PROGRESS: '프로그레스',
    PREPARING: '상품준비 중',
  };

  const deliveryDetailMap: Obj = {
    LUNCH: '점심',
    DINNER: '저녁',
  };
  const { dayFormatter: paidAt } = getCustomDate(new Date(deliveryItem.paidAt));
  const { dayFormatter: deliverAt } = getCustomDate(new Date(deliveryItem.deliveryDate));

  const isCompleted = deliveryItem.deliveryStatus === 'COMPLETED';
  const isCanceled = deliveryItem.deliveryStatus === 'CANCELED';
  const isDelivering = deliveryItem.deliveryStatus === 'DELIVERING';
  return (
    <Container>
      <Wrapper>
        <FlexBetween>
          <FlexRow margin="0 0 8px 0">
            <TextH5B color={isCanceled ? theme.greyScale65 : theme.black}>
              {deliveryStatusMap[deliveryItem.deliveryStatus]}
            </TextH5B>
            <DeliveryTag deliveryType={deliveryItem.delivery} margin="0 4px 0 8px" />
            {deliveryItem.deliveryDetail && (
              <Tag backgroundColor={theme.white} color={theme.brandColor} border={theme.brandColor}>
                {deliveryDetailMap[deliveryItem.deliveryDetail]}
              </Tag>
            )}
          </FlexRow>
          {!isCompleted && (
            <TextH6B
              textDecoration="underline"
              color="#757575"
              onClick={() => router.push(`/mypage/order-detail/${deliveryItem.id}`)}
            >
              주문상세 보기
            </TextH6B>
          )}
        </FlexBetween>
        <FlexRow padding="0 0 8px 0">
          <SVGIcon name="deliveryTruckIcon" />
          <TextH5B padding="2px 0 0 4px">{deliverAt} 도착예정</TextH5B>
        </FlexRow>
        <FlexRow padding="0 0 16px 0">
          <ImageWrapper>
            <ItemImage src={IMAGE_S3_URL + deliveryItem.image.url} alt="상품이미지" />
          </ImageWrapper>
          <FlexCol width="70%" margin="0 0 0 16px">
            <TextB2R padding="0 0 4px 0">{deliveryItem.name}</TextB2R>
            <FlexBetween>
              <TextH5B>{deliveryItem.payAmount}원</TextH5B>
              <TextB3R color={theme.greyScale65}>{paidAt} 결제</TextB3R>
            </FlexBetween>
          </FlexCol>
        </FlexRow>
        <FlexRow>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            margin="0 8px 0 0"
            onClick={() => buttonHandler({ id: deliveryItem.id, isDelivering })}
          >
            {isDelivering ? '배송조회하기' : '장바구니 담기'}
          </Button>
        </FlexRow>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  width: 75px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

export default OrderDeliveryItem;
