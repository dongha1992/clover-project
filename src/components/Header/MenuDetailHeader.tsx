import React, { useEffect } from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';
import { TextH4B } from '@components/Text';
import { useRouter } from 'next/router';
import { breakpoints } from '@utils/getMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { setBottomSheet, initBottomSheet } from '@store/bottomSheet';
import { menuSelector } from '@store/menu';
import { SET_CART_SHEET_OBJ } from '@store/cart';
import CartSheetGroup from '@components/CartSheet/CartSheetGroup';
import CartIcon from '@components/Header/Cart';
import ShareSheet from '@components/ShareSheet';

type TProps = {
  title?: string;
};

/* TODO: Header props으로 svg만 추가 */

function MenuDetailHeader({ title }: TProps) {
  const dispatch = useDispatch();
  const { menuItem } = useSelector(menuSelector);

  const router = useRouter();

  useEffect(() => {
    return () => {
      dispatch(initBottomSheet());
    };
  }, []);

  const goBack = (): void => {
    router.back();
  };

  const goToShare = () => {
    dispatch(initBottomSheet());
    console.log('D');
    dispatch(
      setBottomSheet({
        content: <ShareSheet />,
        buttonTitle: '',
      })
    );
  };

  const goToCart = () => {
    dispatch(SET_CART_SHEET_OBJ(menuItem));
    dispatch(
      setBottomSheet({
        content: <CartSheetGroup />,
        buttonTitle: '장바구니에 담기',
      })
    );
  };

  return (
    <Container>
      <Wrapper>
        <div className="arrow" onClick={goBack}>
          <SVGIcon name="arrowLeft" />
        </div>
        <TextH4B padding="2px 0 0 0">{title}</TextH4B>
        <BtnWrapper>
          <div className="share" onClick={goToShare}>
            <SVGIcon name="share" />
          </div>
          <CartIcon onClick={goToCart} />
        </BtnWrapper>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: auto;
  left: calc(50%);
  background-color: white;
  z-index: 100000;

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
  padding: 14px 27px;
  .arrow {
    cursor: pointer;
    > svg {
    }
  }
`;

const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  .cart {
    padding-left: 24px;
  }
`;

export default React.memo(MenuDetailHeader);
