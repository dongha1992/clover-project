import React, { useEffect, useState, useCallback } from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';
import { TextH4B } from '@components/Text';
import { useRouter } from 'next/router';
import { CATEGORY } from '@constants/search';
import { MENU_DETAIL_INFORMATION } from '@constants/menu';
import dynamic from 'next/dynamic';
import { breakpoints } from '@utils/getMediaQuery';
import { useDispatch } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
import CartSheetGroup from '@components/CartSheet/CartSheetGroup';
import CartIcon from '@components/Header/Cart';

const TabList = dynamic(() => import('../TabList'));

type TProps = {
  title?: string;
};

function CategorySubHeader({ title }: TProps) {
  const [selectedTab, setSelectedTab] = useState<string>('/category');

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const queryString = router.asPath;
    setSelectedTab(queryString);
  }, [router]);

  const goBack = (): void => {
    router.back();
  };

  const clickTabHandler = useCallback(
    (tabItem: any) => {
      setSelectedTab(tabItem.text);
      router.push(`${tabItem.link}`);
    },
    [router]
  );

  const goToCart = () => {
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
        {title ? (
          <>
            <TextH4B padding="2px 0 0 0">{title}</TextH4B>
            <CartIcon onClick={goToCart} />
          </>
        ) : null}
      </Wrapper>
      <TabList
        onClick={clickTabHandler}
        selectedTab={selectedTab}
        tabList={title ? CATEGORY : MENU_DETAIL_INFORMATION}
      />
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

export default React.memo(CategorySubHeader);
