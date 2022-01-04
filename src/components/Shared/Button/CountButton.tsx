import React from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { theme, verticalCenter } from '@styles/theme';
import { TextH6B } from '@components/Shared/Text';

const CountButton = ({ quantity }: any) => {
  const clickMinusButton = () => {};
  const clickPlusButton = () => {};
  return (
    <Container>
      <Wrapper>
        <Minus onClick={clickMinusButton}>
          <SVGIcon name="minus" />
        </Minus>
        <Count>
          <TextH6B margin="4px 0 0 0">{quantity ? quantity : 1}</TextH6B>
        </Count>
        <Plus onClick={clickPlusButton}>
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

export default CountButton;
