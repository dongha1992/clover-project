import React from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { useSelector } from 'react-redux';
import { cartForm } from '@store/cart';
import { theme } from '@styles/theme';
import { userForm } from '@store/user';

const CartIcon = ({ onClick }: any) => {
  const { cartLists, nonMemberCartLists } = useSelector(cartForm);
  const { me } = useSelector(userForm);

  const cartCount = me ? cartLists?.length : nonMemberCartLists.length;
  const displayCount = cartCount > 9 ? '+9' : cartCount;

  console.log(cartLists, 'cartLists');

  return (
    <Container onClick={onClick}>
      <div className="cart">
        <SVGIcon name="cart" />
      </div>
      <CountWrapper>
        <Count> {displayCount}</Count>
      </CountWrapper>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  cursor: pointer;
`;

const CountWrapper = styled.div`
  position: absolute;
  right: -7px;
  bottom: 13px;
  width: 6px;
  height: 12px;
  background-color: ${theme.brandColor};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 10px;
`;

const Count = styled.div`
  font-weight: 700;
  line-height: 11.58px;
  letter-spacing: -0.4px;
  font-size: 8px;
  padding-top: 1px;
  color: ${theme.white};
`;

export default React.memo(CartIcon);
