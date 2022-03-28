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
import { IGetOtherDeliveries } from '@model/index';
import { deliveryStatusMap, deliveryDetailMap } from '@pages/mypage/order-delivery-history';
interface IProps {
  orderDeliveryItem: any;
  buttonHandler: ({ id, isDelivering }: { id: number; isDelivering: boolean }) => void;
}

const OrderDeliveryItem = ({ orderDeliveryItem, buttonHandler }: IProps) => {
  const { deliveryDate, status } = orderDeliveryItem.orderDeliveries[0];

  const { dayFormatter: paidAt } = getCustomDate(new Date(orderDeliveryItem.paidAt));
  const { dayFormatter: deliverAt } = getCustomDate(new Date(deliveryDate));
  /* TODO: 아래 중복 코드 많음 헬퍼함수? */

  const deliveryStatus = deliveryStatusMap[status];
  const deliveryDetail = deliveryDetailMap[orderDeliveryItem.deliveryDetail];
  const isCompleted = deliveryStatus === '배송완료';
  const isCanceled = deliveryStatus === '주문취소';
  const isDelivering = deliveryStatus === '배송중';
  // const hasOtherDeliveries = orderDeliveryItem.orderDeliveries.length > 0;

  return (
    <Container>
      <Wrapper>
        <DeliveryStatusInfo
          isCanceled={isCanceled}
          isCompleted={isCompleted}
          deliveryStatus={deliveryStatus}
          deliveryDetail={deliveryDetail}
          id={orderDeliveryItem.id}
          deliveryType={orderDeliveryItem.delivery}
        />
        <FlexRow padding="0 0 8px 0">
          {!isCanceled && (
            <>
              <SVGIcon name="deliveryTruckIcon" />
              <TextH5B padding="2px 0 0 4px">{deliverAt} 도착예정</TextH5B>
            </>
          )}
        </FlexRow>
        <ItemInfo
          url={orderDeliveryItem.image.url}
          name={orderDeliveryItem.name}
          payAmount={orderDeliveryItem.payAmount}
          paidAt={paidAt}
        />
        <FlexRow>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            margin="0 8px 0 0"
            onClick={() => buttonHandler({ id: orderDeliveryItem.id, isDelivering })}
          >
            {isDelivering ? '배송조회하기' : '장바구니 담기'}
          </Button>
        </FlexRow>
      </Wrapper>
      {/* {hasOtherDeliveries &&
        orderDeliveryItem.orderDeliveries.map((otherItem: IGetOtherDeliveries, index: number) => {
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
                  url={otherItem?.image?.url || ''}
                  name={otherItem?.name || 'test'}
                  payAmount={otherItem?.payAmount || 0}
                  paidAt={paidAt}
                />
              </OtherDeliveryWrapper>
            </FlexRowStart>
          );
        })} */}
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
