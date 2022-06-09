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
import { INIT_CATEGORY_FILTER, filterSelector } from '@store/filter';

type TProps = {
  title?: string;
};

const CategorySubHeader = ({ title }: TProps) => {
  const [selectedTab, setSelectedTab] = useState<string>('/category/all');
  const categoryRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const {
    categoryFilters: { order, filter },
  } = useSelector(filterSelector);
  const router = useRouter();

  useEffect(() => {
    const queryString = router.asPath;
    setSelectedTab(queryString);
  }, [router]);

  const goBack = (): void => {
    if (router.pathname.indexOf('category') > -1) {
      router.push('/');
    } else {
      router.back();
    }
  };

  const scrollToAllMenusItemOffsetLeft = (targetOffset: number) => {
    categoryRef?.current?.scrollTo(targetOffset - 10, 0);
  };

  const clickTabHandler = useCallback(
    (tabItem: any, e: any) => {
      const targetOffset = e.target.offsetLeft;
      scrollToAllMenusItemOffsetLeft(targetOffset);
      setSelectedTab(tabItem.link);
      new Promise((res, err) => res(dispatch(INIT_CATEGORY_FILTER()))).then(() =>
        router.push(`/category/${tabItem.value}`)
      );
    },
    [router.pathname]
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
        <TabList onClick={clickTabHandler} selectedTab={selectedTab} tabList={CATEGORY} ref={categoryRef} />
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
