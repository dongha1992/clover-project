import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CATEGORY } from '@constants/search';
import { TextB1R, TextH3B, TextH6B } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';
import { Item } from '@components/Item';
import { homePadding, textBody2, theme, FlexBetween } from '@styles/theme';
import Link from 'next/link';
import { SVGIcon } from '@utils/common';
import { useQuery } from 'react-query';
import { getExhibitionMdRecommendApi } from '@api/promotion';
import { useDispatch } from 'react-redux';
import { INIT_MENU_KEYWORD } from '@store/menu';
import { IMenus } from '@model/index';
import router from 'next/router';
import TextInput from '@components/Shared/TextInput';
import { show, hide } from '@store/loading';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { SET_ALERT } from '@store/alert';
import * as ga from 'src/lib/ga';

const SearchPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState<string>('');

  const {
    data: mdMenus,
    error: mdMenuError,
    isLoading: mdIsLoading,
  } = useQuery(
    'getExhibitionMenus',
    async () => {
      dispatch(show());
      const { data } = await getExhibitionMdRecommendApi();
      return checkIsSold(data.data.menus);
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onSuccess: () => {},
      onSettled: () => {
        dispatch(hide());
      },
      onError: () => {
        dispatch(SET_ALERT({ alertMessage: '알 수 없는 에러가 발생했습니다.' }));
      },
    }
  );

  useEffect(() => {
    dispatch(INIT_MENU_KEYWORD());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIsSold = (menuList: IMenus[]) => {
    return menuList?.sort((a: any, b: any) => {
      return a.isSold - b.isSold;
    });
  };

  const getSearchResult = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (e.key === 'Enter') {
      ga.setEvent({
        action: 'search', 
        params : {
          search_term: keyword,
        }
      });

      router.push({
        pathname: '/search/result',
        query: { keyword: keyword },
      });
    }
  };

  const changeInputHandler = (e: any) => {
    const value = e.target.value;
    setKeyword(value);
    if (!value) {
      // setIsSearched(false);
      setKeyword('');
    }
  };

  const clearInputHandler = () => {
    if (inputRef.current?.value.length! > 0) {
      initInputHandler();
      // setIsSearched(false);
      setKeyword('');
    }
  };

  const initInputHandler = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const goToMore = () => {};

  return (
    <Container>
      <SearchBarWrapper>
        <label className="textLabel">
          {keyword.length === 0 && <span className="textPlaceholde">원하시는 상품을 검색해보세요.</span>}
          <TextInput
            inputType="text"
            svg="searchIcon"
            fontSize="14px"
            keyPressHandler={getSearchResult}
            eventHandler={changeInputHandler}
            value={keyword}
            ref={inputRef}
          />
        </label>
        {keyword.length > 0 && (
          <div className="removeSvg" onClick={clearInputHandler}>
            <SVGIcon name="removeItem" />
          </div>
        )}
      </SearchBarWrapper>
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
          <TextH3B padding="0 0 0 24px">MD 추천</TextH3B>
          <SliderWrapper className="swiper-container" slidesPerView={'auto'} spaceBetween={16} speed={500}>
            {mdMenus?.map((item, index) => {
              if (index > 9) return;
              return (
                <SwiperSlide className="swiper-slide" key={index}>
                  <Item item={item} isHorizontal />
                </SwiperSlide>
              );
            })}
          </SliderWrapper>
        </MdRecommendationWrapper>
      </DefaultSearchContainer>
    </Container>
  );
};

const Container = styled.main``;

const SliderWrapper = styled(Swiper)`
  width: auto;
  padding: 24px 24px 0 24px;
  .swiper-slide {
    width: 132px;
  }
`;

const SearchBarWrapper = styled.div`
  position: relative;
  padding-top: 8px;
  margin: 0 24px;
  .textLabel {
    width: 100%;
    .textPlaceholde {
      position: absolute;
      top: 22px;
      left: 49px;
      z-index: 100;
      color: ${theme.greyScale45};
      ${textBody2};
    }
  }
  .removeSvg {
    position: absolute;
    right: 0;
    top: 0;
    padding: 23px 14px 0 0;
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

const MdRecommendationWrapper = styled.section`
  width: 100%;
  padding: 24px 0;
  margin-bottom: 48px;
`;

const FlexSpace = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 24px 24px 24px;
`;


export default SearchPage;
