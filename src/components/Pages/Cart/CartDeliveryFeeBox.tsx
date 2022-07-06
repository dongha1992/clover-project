import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH4B, TextH5B, TextH6B, TextH7B, TextB3R, TextH3B } from '@components/Shared/Text';
import { FlexBetween } from '@styles/theme';
import { getFormatPrice } from '@utils/common';

interface IProps {
  deliveryFee: number;
  deliveryFeeDiscount?: number;
}

const CartDeliveryFeeBox = ({ deliveryFee, deliveryFeeDiscount }: IProps) => {
  return (
    <>
      <FlexBetween>
        <TextH5B>배송비</TextH5B>
        <TextB2R>{deliveryFee ? `${getFormatPrice(String(deliveryFee))}원` : '무료배송'}</TextB2R>
      </FlexBetween>
      {deliveryFeeDiscount !== 0 && (
        <FlexBetween>
          <TextB2R padding="8px 0 0 0">배송비 할인</TextB2R>
          <TextB2R>-{getFormatPrice(String(deliveryFeeDiscount))}원</TextB2R>
        </FlexBetween>
      )}
    </>
  );
};

export default React.memo(CartDeliveryFeeBox);
