import React, { useEffect, useState, useCallback, useRef } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { CATEGORY } from '@constants/search';
import { breakpoints } from '@utils/common/getMediaQuery';
import { useDispatch } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import CartSheet from '@components/BottomSheet/CartSheet/CartSheet';
import CartIcon from '@components/Header/Cart';
import { CategoryFilter } from '@components/Pages/Category';
import TabList from '@components/Shared/TabList/TabList';
import { useSelector } from 'react-redux';
import { INIT_CATEGORY_FILTER, filterSelector, SET_MENU_TAB } from '@store/filter';

type TProps = {
  title?: string;
};

const CategorySubHeader = ({ title }: TProps) => {
  const [selectedTab, setSelectedTab] = useState<string>('/category/all');
  const categoryRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const goBack = (): void => {
    router.back();
  };

  const scrollToAllMenusItemOffsetLeft = (targetOffset: number) => {
    categoryRef?.current?.scrollTo(targetOffset - 10, 0);
  };

  const clickTabHandler = (tabItem: any, e: any) => {
    const targetOffset = e.target.offsetLeft;
    scrollToAllMenusItemOffsetLeft(targetOffset);
    setSelectedTab(tabItem.link);
    dispatch(SET_MENU_TAB(tabItem.value));
    new Promise((res, err) => res(initFilters())).then(() => router.push(`/category/${tabItem.value}`));
  };

  const initFilters = () => {
    dispatch(INIT_CATEGORY_FILTER());
  };

  const goToCart = () => {
    router.push('/cart');
  };

  const getQuery = (path: string) => {
    return path.split('?')[0];
  };

  useEffect(() => {
    const { category }: any = router.query;
    const queryString = router.asPath;
    setSelectedTab(getQuery(queryString));
    dispatch(SET_MENU_TAB(category));
  }, [router.query]);

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
        <TabList onClick={clickTabHandler} selectedTab={selectedTab} tabList={CATEGORY} ref={categoryRef} />
        <CategoryFilter />
      </Container>
    </>
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
