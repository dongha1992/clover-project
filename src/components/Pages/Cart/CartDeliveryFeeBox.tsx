import React from 'react';
import { TextB2R, TextH6B, TextH5B } from '@components/Shared/Text';
import { FlexBetween, theme } from '@styles/theme';
import { getFormatPrice } from '@utils/common';

interface IProps {
  deliveryFee: number;
  deliveryFeeDiscount?: number;
  isLogin: boolean;
}

const CartDeliveryFeeBox = ({ deliveryFee, deliveryFeeDiscount, isLogin }: IProps) => {
  return (
    <>
      <FlexBetween>
        <TextH5B>배송비</TextH5B>
        {!isLogin ? (
          <TextB2R>{deliveryFee ? `${getFormatPrice(String(deliveryFee))}원` : '무료배송'}</TextB2R>
        ) : (
          <TextH6B color={theme.brandColor}>배송방법에 따라 배송비가 부과돼요.</TextH6B>
        )}
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
