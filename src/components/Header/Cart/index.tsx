import React from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { useSelector } from 'react-redux';
import { cartForm } from '@store/cart';
import { theme } from '@styles/theme';

const CartIcon = ({ onClick }: any) => {
  const { cartLists } = useSelector(cartForm);

  return (
    <Container onClick={onClick}>
      <div className="cart">
        <SVGIcon name="cart" />
      </div>
      <CountWrapper>
        <Count>{cartLists.length}</Count>
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
  bottom: 12px;
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
  padding-top: 2px;
  color: ${theme.white};
`;

export default React.memo(CartIcon);
