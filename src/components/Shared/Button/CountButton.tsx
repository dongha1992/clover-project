import React, { useState } from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { theme, verticalCenter } from '@styles/theme';
import { TextH6B } from '@components/Shared/Text';

interface IProps {
  menuDetailId: number;
  quantity: number;
  clickPlusButton: (menuDetailId: number, quantity: number) => void;
  clickMinusButton: (menuDetailId: number, quantity: number) => void;
}

const CountButton = ({ menuDetailId, quantity, clickPlusButton, clickMinusButton }: IProps) => {
  return (
    <Container>
      <Wrapper>
        <Minus onClick={() => clickMinusButton(menuDetailId, quantity < 2 ? 1 : (quantity = quantity - 1))}>
          <SVGIcon name="minus" />
        </Minus>
        <Count>
          <TextH6B margin="4px 0 0 0">{quantity}</TextH6B>
        </Count>
        <Plus onClick={() => clickPlusButton(menuDetailId, (quantity = quantity + 1))}>
          <SVGIcon name="plus" />
        </Plus>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 64px;
  height: 32px;
  background-color: ${theme.white};
  border: 1px solid #dedede;
  box-sizing: border-box;
  border-radius: 32px;
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
