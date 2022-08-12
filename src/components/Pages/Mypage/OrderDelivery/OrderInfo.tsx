import React from 'react';
import { FlexCol, FlexBetween } from '@styles/theme';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import { PAYMENT_METHOD } from '@constants/order';
interface IProps {
  orderId: number;
  deliveryStatus: string;
  paidAt: string;
  payMethod?: string;
}
const OrderInfo = ({ orderId, deliveryStatus, paidAt, payMethod }: IProps) => {
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
      <FlexBetween margin="0 0 16px 0">
        <TextH5B>결제일시</TextH5B>
        <TextB2R>{paidAt}</TextB2R>
      </FlexBetween>
      {PAYMENT_METHOD[payMethod!] && (
        <FlexBetween margin="0 0 16px 0">
          <TextH5B>결제수단</TextH5B>
          <TextB2R>{PAYMENT_METHOD[payMethod!]}</TextB2R>
        </FlexBetween>
      )}
    </FlexCol>
  );
};

export default OrderInfo;
