import React from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { useSelector } from 'react-redux';
import { cartForm } from '@store/cart';

function CartIcon({ onClick }: any) {
  const { cartLists } = useSelector(cartForm);

  return (
    <Container>
      <div className="cart" onClick={onClick}>
        <SVGIcon name="cart" />
      </div>
      <Count>{cartLists.length}</Count>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;
const Count = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;

export default React.memo(CartIcon);
