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
import { DELIVERY_STATUS_MAP } from '@constants/mypage';
import { DELIVERY_TIME_MAP } from '@constants/order';
interface IProps {
  orderDeliveryItem: any;
  buttonHandler: ({ id, isDelivering }: { id: number; isDelivering: boolean }) => void;
}

const OrderDeliveryItem = ({ orderDeliveryItem, buttonHandler }: IProps) => {
  const { deliveryDate, status } = orderDeliveryItem;

  const { dayFormatter: paidAt } = getCustomDate(new Date(orderDeliveryItem.order.paidAt));
  const { dayFormatter: deliverAt } = getCustomDate(new Date(deliveryDate));
  /* TODO: 아래 중복 코드 많음 헬퍼함수? */

  const deliveryStatus = DELIVERY_STATUS_MAP[status];
  const deliveryDetail = DELIVERY_TIME_MAP[orderDeliveryItem.deliveryDetail];
  const isCompleted = deliveryStatus === '배송완료';
  const isCanceled = deliveryStatus === '주문취소';
  const isDelivering = deliveryStatus === '배송중';
  const hasSubOrder = orderDeliveryItem.subOrderDelivery;

  return (
    <Container>
      <Wrapper>
        <DeliveryStatusInfo
          isCanceled={isCanceled}
          isCompleted={isCompleted}
          deliveryStatus={deliveryStatus}
          deliveryDetail={deliveryDetail}
          id={orderDeliveryItem.order.id}
          deliveryType={orderDeliveryItem.delivery}
          isSubOrder={hasSubOrder ? 'main' : 'false'}
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
          url={orderDeliveryItem.image?.url}
          name={orderDeliveryItem.order.name}
          payAmount={orderDeliveryItem.order.payAmount}
          paidAt={paidAt}
        />
        <FlexRow>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            margin="16px 8px 0 0"
            onClick={() => buttonHandler({ id: orderDeliveryItem.order.id, isDelivering })}
          >
            {isDelivering ? '배송조회하기' : '장바구니 담기'}
          </Button>
        </FlexRow>
      </Wrapper>
      {hasSubOrder && (
        <FlexRowStart margin="19px 0 0 0">
          <SVGIcon name="otherDeliveryArrow" />
          <OtherDeliveryWrapper>
            <DeliveryStatusInfo
              isCanceled={DELIVERY_STATUS_MAP[orderDeliveryItem.subOrderDelivery.status] === '주문취소'}
              isCompleted={DELIVERY_STATUS_MAP[orderDeliveryItem.subOrderDelivery.status] === '배송완료'}
              deliveryDetail={deliveryDetail}
              deliveryStatus={DELIVERY_STATUS_MAP[orderDeliveryItem.subOrderDelivery.status]}
              id={orderDeliveryItem.subOrderDelivery.order.id}
              deliveryType={orderDeliveryItem.subOrderDelivery.delivery}
              isSubOrder="sub"
            />
            <ItemInfo
              url={orderDeliveryItem.subOrderDelivery?.image?.url}
              name={orderDeliveryItem.subOrderDelivery?.order.name}
              payAmount={orderDeliveryItem.subOrderDelivery?.order.payAmount}
              paidAt={paidAt}
            />
          </OtherDeliveryWrapper>
        </FlexRowStart>
      )}
    </Container>
  );
};

const Container = styled.div``;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const OtherDeliveryWrapper = styled.div`
  width: 100%;
  margin-left: 16px;
`;

export default OrderDeliveryItem;
