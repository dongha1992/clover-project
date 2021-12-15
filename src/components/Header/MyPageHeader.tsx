import React from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { breakpoints } from '@utils/getMediaQuery';
import CartIcon from '@components/Header/Cart';
import router from 'next/router';

function MyPageHeader() {
  const goToCart = () => {
    router.push('/cart');
  };
  return (
    <Container>
      <Wrapper>
        <Right>
          <NotiWrapper>
            <SVGIcon name="notification" />
          </NotiWrapper>
          <CartWrapper>
            <CartIcon onClick={goToCart} />
          </CartWrapper>
        </Right>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: 56px;
  left: calc(50%);
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;

  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 16px 24px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const CartWrapper = styled.div``;
const NotiWrapper = styled.div`
  padding-right: 26px;
`;

export default MyPageHeader;
