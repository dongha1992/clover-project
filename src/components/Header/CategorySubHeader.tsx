import React, { useEffect, useState, useRef } from 'react';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { TextH4B } from '@components/Shared/Text';
import { useRouter } from 'next/router';
import { CATEGORY } from '@constants/search';
import { breakpoints } from '@utils/common/getMediaQuery';
import { useDispatch } from 'react-redux';
import CartIcon from '@components/Header/Cart';
import TabList from '@components/Shared/TabList/TabList';
import { INIT_CATEGORY_FILTER, SET_MENU_TAB } from '@store/filter';

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
    new Promise((res, err) => res(initFilters())).then(() => router.replace(`/category/${tabItem.value}`));
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
  width: 100%;
  height: 100%;
  padding: 0 24px;
  /* margin: 16px 24px; */
  /* padding: 16px 24px; */
  background-color: white;
  .arrow {
    cursor: pointer;
    > svg {
    }
  }
`;

export default React.memo(CategorySubHeader);
