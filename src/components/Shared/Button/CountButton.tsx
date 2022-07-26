import React, { useState } from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { theme, verticalCenter } from '@styles/theme';
import { TextH5B } from '@components/Shared/Text';

interface IProps {
  personLimit?: boolean;
  available?: { availability: boolean; remainingQuantity: number; menuDetailAvailabilityMessage: string };
  isSold?: boolean;
  menuDetailId: number;
  quantity: number;
  clickPlusButton: (menuDetailId: number, quantity: number) => void;
  clickMinusButton: (menuDetailId: number, quantity: number) => void;
}

const CountButton = ({
  menuDetailId,
  quantity,
  clickPlusButton,
  clickMinusButton,
  isSold,
  personLimit,
  available,
}: IProps) => {
  return (
    <Container isSold={isSold}>
      <Wrapper>
        <Minus
          onClick={() => {
            if (isSold) {
              return;
            }
            clickMinusButton(menuDetailId, quantity < 2 ? 1 : (quantity = quantity - 1));
          }}
        >
          <SVGIcon name="minus" color={isSold ? theme.greyScale25 : ''} />
        </Minus>
        <Count>
          <TextH5B margin="4px 0 0 0">{quantity}</TextH5B>
        </Count>
        <Plus
          onClick={() => {
            if (isSold) return;
            if (personLimit && quantity === available?.remainingQuantity) {
              return;
            }
            clickPlusButton(menuDetailId, (quantity = quantity + 1));
          }}
        >
          <SVGIcon name="plus" color={isSold ? theme.greyScale25 : ''} />
        </Plus>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div<{ isSold?: boolean }>`
  position: relative;
  width: 72px;
  height: 32px;
  border: 1px solid #dedede;
  box-sizing: border-box;
  background-color: ${theme.white};
  border-radius: 32px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 100%;
`;

const Minus = styled.div`
  ${verticalCenter}
  margin-left: 6px;
`;

const Plus = styled.div`
  ${verticalCenter}
  margin-right: 6px;
`;
const Count = styled.div`
  ${verticalCenter}
`;

export default React.memo(CountButton);
