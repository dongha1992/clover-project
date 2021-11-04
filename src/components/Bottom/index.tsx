import SVGIcon from '@utils/SVGIcon';
import React from 'react';
import styled, { css } from 'styled-components';
import { TextH7B } from '@components/Text';

function Bottom() {
  return (
    <Container>
      <MenuWrapper>
        <MenuItem>
          <SVGIcon name="home" />
          <TextH7B padding="4px 0 0 0">간편주문</TextH7B>
        </MenuItem>
        <SVGIcon name="home" />
        <SVGIcon name="home" />
        <SVGIcon name="home" />
        <SVGIcon name="home" />
      </MenuWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 504px;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 10;
  height: 56px;
  left: 50%;
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 50%;
    margin-left: -252px;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0
  `};
`;

const MenuWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
`;

const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Bottom;
