import React, { useState } from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { theme, verticalCenter } from '@styles/theme';
import { TextH6B } from '@components/Shared/Text';

interface IProps {
  isSold?: boolean;
  menuDetailId: number;
  quantity: number;
  clickPlusButton: (menuDetailId: number, quantity: number) => void;
  clickMinusButton: (menuDetailId: number, quantity: number) => void;
}

const CountButton = ({ menuDetailId, quantity, clickPlusButton, clickMinusButton, isSold }: IProps) => {
  return (
    <Container isSold={isSold}>
      <Wrapper>
        <Minus
          onClick={() => {
            if (isSold) return;
            clickMinusButton(menuDetailId, quantity < 2 ? 1 : (quantity = quantity - 1));
          }}
        >
          <SVGIcon name="minus" color={isSold ? theme.greyScale25 : ''} />
        </Minus>
        <Count>
          <TextH6B margin="4px 0 0 0">{quantity}</TextH6B>
        </Count>
        <Plus
          onClick={() => {
            if (isSold) return;
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
  width: 64px;
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
  position: relative;
  height: 100%;
`;

const Minus = styled.div`
  padding-left: 12px;
  ${verticalCenter}
`;

const Plus = styled.div`
  padding-right: 12px;
  ${verticalCenter}
`;
const Count = styled.div`
  ${verticalCenter}
`;

export default React.memo(CountButton);
