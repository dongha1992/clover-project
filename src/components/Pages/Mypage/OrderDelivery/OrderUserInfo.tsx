import React from 'react';
import { FlexCol, FlexBetween } from '@styles/theme';
import { TextH5B, TextB2R } from '@components/Shared/Text';

interface IProps {
  orderId: number;
  deliveryStatus: string;
  paidAt: string;
}
const OrderUserInfo = ({ orderId, deliveryStatus, paidAt }: IProps) => {
  return (
    <FlexCol padding="24px 0 0 0">
      <FlexBetween>
        <TextH5B>주문 번호</TextH5B>
        <TextB2R>{orderId}</TextB2R>
      </FlexBetween>
      <FlexBetween margin="16px 0">
        <TextH5B>주문 상태</TextH5B>
        <TextB2R>{deliveryStatus}</TextB2R>
      </FlexBetween>
      <FlexBetween>
        <TextH5B>주문(결제)일시</TextH5B>
        <TextB2R>{paidAt}</TextB2R>
      </FlexBetween>
    </FlexCol>
  );
};

export default OrderUserInfo;
