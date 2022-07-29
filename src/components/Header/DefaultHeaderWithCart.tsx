import React, { useEffect } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/common/getMediaQuery';
import CartIcon from '@components/Header/Cart';

type TProps = {
  title?: string;
};

const DefaultHeaderWithCart = ({ title }: TProps) => {
  const router = useRouter();

  const goBack = (): void => {
    if (router.pathname === '/search') {
      router.push('/');
    } else {
      router.back();
    }
  };

  const goToCart = () => {
    router.push('/cart');
  };

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <TextH4B padding="2px 0 0 0">{title}</TextH4B>
        <CartIcon onClick={goToCart} />
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: ${breakpoints.mobile}px;
  position: absolute;
  top: 0;
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  .arrow {
    width: 24px;
    cursor: pointer;
    > svg {
      position: absolute;
      left: 24px;
      bottom: 16px;
    }
  }
`;

export default DefaultHeaderWithCart;
