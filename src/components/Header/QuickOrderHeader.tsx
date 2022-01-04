import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import CartIcon from '@components/Header/Cart';
import { breakpoints } from '@utils/getMediaQuery';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
import { orderForm } from '@store/order';
import { OrderSheet } from '@components/BottomSheet/OrderSheet';
import { TextH4B } from '@components/Shared/Text';
import { TabList } from '@components/Shared/TabList';
import { useCallback, useState } from 'react';
import { QUICK_CATEGORY } from '@constants/search';
import { Button } from '@components/Shared/Button';

const QuickOrderHeader: React.FC = () => {
  const { orderType } = useSelector(orderForm);
  const router = useRouter();
  const { pathname } = router;
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState<string>(
    '/quickorder/category'
  );

  const goBack = (): void => {
    router.back();
  };

  const goToCart = () => {
    router.push('/cart');
  };

  const onClick = () => {
    dispatch(
      setBottomSheet({
        content: <OrderSheet />,
      })
    );
  };

  const clickTabHandler = useCallback(
    (tabItem: any) => {
      setSelectedTab(`${tabItem.link}`);
      router.push(`${tabItem.link}`);
    },
    [router]
  );

  return (
    <Container>
      <Wrapper className={pathname !== '/quickorder' ? 'type1' : 'type2'}>
        {pathname !== '/quickorder' && (
          <>
            <Left className="arrow" onClick={goBack}>
              <SVGIcon name="arrowLeft" />
            </Left>
            <OrderType onClick={onClick}>
              <TextH4B>{orderType}</TextH4B>
              <SVGIcon name="arrowDown" />
            </OrderType>
          </>
        )}

        <Right>
          <CartWrapper>
            <CartIcon onClick={goToCart} />
          </CartWrapper>
        </Right>
      </Wrapper>
      {pathname !== '/quickorder' && (
        <>
          <TabList
            onClick={clickTabHandler}
            selectedTab={selectedTab}
            tabList={QUICK_CATEGORY}
          />
          <ButtonContainer onClick={goToCart}>
            <Button height="100%" width="100%" borderRadius="0">
              주문하기
            </Button>
          </ButtonContainer>
        </>
      )}
    </Container>
  );
};

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

  padding: 14px 27px;
  &.type1 {
    justify-content: space-between;
  }
  &.type2 {
    justify-content: flex-end;
  }
`;

const Left = styled.div`
  cursor: pointer;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const CartWrapper = styled.div``;

const OrderType = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > div {
    margin-top: 3px;
  }
  svg {
    margin-left: 6px;
  }
`;

const ButtonContainer = styled.div`
  z-index: 100;
  position: fixed;
  display: flex;
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  bottom: 0;
  right: 0;
  left: calc(50%);
  height: 56px;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;

  `};
  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

export default QuickOrderHeader;
