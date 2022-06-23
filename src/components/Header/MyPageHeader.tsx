import React from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { breakpoints } from '@utils/common/getMediaQuery';
import CartIcon from '@components/Header/Cart';
import router from 'next/router';
import { userForm } from '@store/user';
import { useSelector } from 'react-redux';

const MyPageHeader = () => {
  const { isLoginSuccess } = useSelector(userForm);
  const goToCart = () => {
    router.push('/cart');
  };
  const goToNoti = () => {
    router.push('/mypage/noti');
  };
  return (
    <Container>
      <Wrapper>
        <Right>
          {isLoginSuccess && (
            <NotiWrapper onClick={goToNoti}>
              <SVGIcon name="notification" />
            </NotiWrapper>
          )}
          <CartWrapper>
            <CartIcon onClick={goToCart} />
          </CartWrapper>
        </Right>
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
  cursor: pointer;
`;

export default MyPageHeader;
