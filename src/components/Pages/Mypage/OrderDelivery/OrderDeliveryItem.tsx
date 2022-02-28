import { FlexRow, FlexRowStart, theme } from '@styles/theme';
import React from 'react';
import styled from 'styled-components';
import { TextH5B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import { Button } from '@components/Shared/Button';
import getCustomDate from '@utils/getCustomDate';
import { Obj } from '@model/index';
import DeliveryStatusInfo from './DeliveryStatusInfo';
import ItemInfo from './ItemInfo';
import { IOrderDeliveries } from '@model/index';
interface IProps {
  deliveryItem: any;
  buttonHandler: ({ id, isDelivering }: { id: number; isDelivering: boolean }) => void;
}

const OrderDeliveryItem = ({ deliveryItem, buttonHandler }: IProps) => {
  // console.log(deliveryItem, 'deliveryItem');

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

  const deliveryStatus = deliveryStatusMap[deliveryItem.deliveryStatus];
  const deliveryDetail = deliveryDetailMap[deliveryItem.deliveryDetail];
  const isCompleted = deliveryItem.deliveryStatus === 'COMPLETED';
  const isCanceled = deliveryItem.deliveryStatus === 'CANCELED';
  const isDelivering = deliveryItem.deliveryStatus === 'DELIVERING';
  const hasOtherDeliveries = deliveryItem.orderDeliveries.length > 0;

  return (
    <Container>
      <Wrapper>
        <DeliveryStatusInfo
          isCanceled={isCanceled}
          isCompleted={isCompleted}
          deliveryStatus={deliveryStatus}
          deliveryDetail={deliveryDetail}
          id={deliveryItem.id}
          deliveryType={deliveryItem.delivery}
        />
        <FlexRow padding="0 0 8px 0">
          <SVGIcon name="deliveryTruckIcon" />
          <TextH5B padding="2px 0 0 4px">{deliverAt} 도착예정</TextH5B>
        </FlexRow>
        <ItemInfo
          url={deliveryItem.image.url}
          name={deliveryItem.name}
          payAmount={deliveryItem.payAmount}
          paidAt={paidAt}
        />
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
      {hasOtherDeliveries &&
        deliveryItem.orderDeliveries.map((otherItem: IOrderDeliveries, index: number) => {
          const isFirst = !index;
          return (
            <FlexRowStart margin="19px 0 0 0" key={index}>
              {isFirst && <SVGIcon name="otherDeliveryArrow" />}
              <OtherDeliveryWrapper isFirst={isFirst}>
                <DeliveryStatusInfo
                  deliveryDetail={deliveryDetail}
                  deliveryStatus={deliveryStatusMap[otherItem.status]}
                  id={otherItem.id}
                  deliveryType={otherItem.delivery}
                />
                <ItemInfo
                  url={otherItem.image.url}
                  name={otherItem.name || 'test'}
                  payAmount={otherItem.payAmount || 0}
                  paidAt={paidAt}
                />
              </OtherDeliveryWrapper>
            </FlexRowStart>
          );
        })}
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const OtherDeliveryWrapper = styled.div<{ isFirst: boolean }>`
  width: 100%;
  margin-left: ${({ isFirst }) => (isFirst ? 0 : 16)}px;
`;

export default OrderDeliveryItem;
