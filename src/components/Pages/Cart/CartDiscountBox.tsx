import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH4B, TextH5B, TextH6B, TextH7B, TextB3R, TextH3B } from '@components/Shared/Text';
import { FlexBetween } from '@styles/theme';
import { getFormatPrice } from '@utils/common';

interface IProps {
  isSpot?: boolean;
  hasSpotEvent: boolean;
  totalDiscountPrice: number;
  itemDiscountPrice: number;
  spotDiscountPrice: number;
}

const CartDiscountBox = ({
  totalDiscountPrice,
  itemDiscountPrice,
  spotDiscountPrice,
  isSpot,
  hasSpotEvent,
}: IProps) => {
  return (
    <>
      <FlexBetween>
        <TextH5B>총 할인 금액</TextH5B>
        <TextB2R>-{getFormatPrice(String(totalDiscountPrice))}원</TextB2R>
      </FlexBetween>
      <FlexBetween padding="8px 0 0 0">
        <TextB2R>상품 할인</TextB2R>
        <TextB2R>-{getFormatPrice(String(itemDiscountPrice))}원</TextB2R>
      </FlexBetween>
      {isSpot && hasSpotEvent && (
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>스팟 이벤트 할인</TextB2R>
          <TextB2R>-{getFormatPrice(String(spotDiscountPrice))}원</TextB2R>
        </FlexBetween>
      )}
    </>
  );
};

export default CartDiscountBox;
