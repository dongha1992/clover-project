import React, { useEffect, useState, useCallback } from 'react';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { CATEGORY } from '@constants/search';
import dynamic from 'next/dynamic';
import { breakpoints } from '@utils/getMediaQuery';
import { useDispatch } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import CartSheet from '@components/BottomSheet/CartSheet/CartSheet';
import CartIcon from '@components/Header/Cart';
import { CategoryFilter } from '@components/Pages/Category';

const TabList = dynamic(() => import('../Shared/TabList/TabList'));

type TProps = {
  title?: string;
};

const CategorySubHeader = ({ title }: TProps) => {
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
      setSelectedTab(tabItem.link);
      router.push(`${tabItem.link}`);
    },
    [router]
  );

  const goToCart = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <CartSheet />,
      })
    );
  };

  return (
    <>
      <Container>
        <Wrapper>
          <div className="arrow" onClick={goBack}>
            <SVGIcon name="arrowLeft" />
          </div>
          <TextH4B padding="2px 0 0 0">{title}</TextH4B>
          <CartIcon onClick={goToCart} />
        </Wrapper>
        <TabList onClick={clickTabHandler} selectedTab={selectedTab} tabList={CATEGORY} />
        <CategoryFilter />
      </Container>
    </>
  );
};

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
    left: 0;e
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
