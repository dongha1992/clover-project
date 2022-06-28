import React from 'react';
import styled from 'styled-components';
import { CATEGORY } from '@constants/search';
import { TextB1R, TextH3B, TextB2R } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';
import { Item } from '@components/Item';
import { homePadding, FlexWrapWrapper, theme } from '@styles/theme';
import Link from 'next/link';
import { SVGIcon } from '@utils/common';
import { useQuery } from 'react-query';
import { getMenusApi, getRecommendMenusApi } from '@api/menu';
import { useDispatch, useSelector } from 'react-redux';
import { filterSelector, INIT_CATEGORY_FILTER } from '@store/filter';
import { IMenus, Obj } from '@model/index';
import router from 'next/router';

const SearchPage = () => {
  const {
    data: menus,
    error: mdMenuError,
    isLoading: mdIsLoading,
  } = useQuery(
    'getRecommendMenus',
    async () => {
      const { data } = await getRecommendMenusApi();
      return checkIsSold(data.data);
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const checkIsSold = (menuList: IMenus[]) => {
    return menuList?.sort((a: any, b: any) => {
      return a.isSold - b.isSold;
    });
  };

  const changeInputHandler = () => {
    router.push('/search/main');
  };

  if (mdIsLoading) {
    return <div>로딩중</div>;
  }

  return (
    <Container>
      <Wrapper>
        <TextInputButton onClick={changeInputHandler}>
          <div className="sgv">
            <SVGIcon name="searchIcon" />
          </div>
          <TextB2R color={theme.greyScale45} padding="1px 0 0 0">
            원하시는 상품을 검색해보세요.
          </TextB2R>
        </TextInputButton>
      </Wrapper>
      <DefaultSearchContainer>
        <CategoryWrapper>
          <TextH3B>카테고리</TextH3B>
          <CatetoryList>
            {CATEGORY.map((item, index) => {
              return (
                <TextB1R key={index} width="148px" padding="8px 0">
                  <Link href={item.link}>
                    <a>{item.text}</a>
                  </Link>
                </TextB1R>
              );
            })}
          </CatetoryList>
        </CategoryWrapper>
        <BorderLine padding="0 24px" />
        <MdRecommendationWrapper>
          <TextH3B padding="24px 0">MD 추천</TextH3B>
          {menus?.length! > 0 ? (
            <FlexWrapWrapper>
              {menus?.map((item, index) => {
                return <Item item={item} key={index} />;
              })}
            </FlexWrapWrapper>
          ) : (
            '상품을 준비 중입니다'
          )}
        </MdRecommendationWrapper>
      </DefaultSearchContainer>
    </Container>
  );
};

const Container = styled.main``;

const TextInputButton = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: 1px solid ${theme.greyScale15};
  outline: none;
  cursor: pointer;
  padding: 12px 48px;
  .sgv {
    position: absolute;
    left: 15px;
    top: 11px;
  }
`;

const Wrapper = styled.div`
  padding: 8px 24px;
  position: relative;
  .removeSvg {
    cursor: pointer;
    position: absolute;
    right: 10%;
    top: 35%;
  }
`;

const CategoryWrapper = styled.div`
  margin-top: 24px;
  margin-bottom: 16px;
  ${homePadding};
`;

const CatetoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 16px;
`;

const DefaultSearchContainer = styled.div``;

const MdRecommendationWrapper = styled.div`
  margin-bottom: 48px;
  padding: 8px 24px;
`;

export default SearchPage;
