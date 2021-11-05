import React from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';
import { TextH4B } from '@components/Text';

type TProps = {
  title: string;
};

function Header({ title }: TProps) {
  return (
    <Container>
      <Wrapper>
        <SVGIcon name="arrowLeft" />
        <TextH4B padding="2px 0 0 0">{title}</TextH4B>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 504px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: 56px;
  left: calc(50% + 29px);
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 50%;
    margin-left: -252px;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;

  > svg {
    position: absolute;
    left: 0px;
  }
`;

export default Header;
