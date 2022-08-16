import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CATEGORY } from '@constants/search';
import { TextB1R, TextH3B, TextB2R, TextH6B } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';
import { Item } from '@components/Item';
import { homePadding, textBody2, theme, FlexBetween } from '@styles/theme';
import Link from 'next/link';
import { SVGIcon } from '@utils/common';
import { useQuery } from 'react-query';
import { getExhibitionMdRecommendApi } from '@api/promotion';
import { useDispatch, useSelector } from 'react-redux';
import { filterSelector, INIT_CATEGORY_FILTER } from '@store/filter';
import { INIT_MENU_KEYWORD } from '@store/menu';
import { IMenus, Obj } from '@model/index';
import router from 'next/router';
import TextInput from '@components/Shared/TextInput';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

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
      const { data } = await getExhibitionMdRecommendApi();
      return checkIsSold(data.data.menus);
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
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

  if (mdIsLoading) {
    return <div>로딩중</div>;
  }

  return (
    <Container>
      <SearchBarWrapper>
        <label className="textLabel">
          {keyword.length === 0 && <span className="textPlaceholde">도로명, 건물명 또는 지번으로 검색</span>}
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
          <FlexBetween>
            <TextH3B padding="24px 0">MD 추천</TextH3B>
            <TextH6B
              textDecoration="underline"
              color={theme.greyScale65}
              padding="0 24px 0 0"
              onClick={goToMore}
              pointer
            >
              더보기
            </TextH6B>
          </FlexBetween>
          <SliderWrapper className="swiper-container" slidesPerView={'auto'} spaceBetween={25} speed={500}>
            {
              mdMenus?.map((item, index) => {
                if (index > 9) return;
                return(
                  <SwiperSlide className="swiper-slide" key={index}>
                    <Item item={item} isHorizontal />
                  </SwiperSlide>
                ) 
              })
            }
          </SliderWrapper>
        </MdRecommendationWrapper>
      </DefaultSearchContainer>
    </Container>
  );
};

const Container = styled.main``;

const SliderWrapper = styled(Swiper)`
  width: auto;
  .swiper-slide {
    width: 120px;
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
  margin-bottom: 48px;
  padding: 8px 24px;
`;

export default SearchPage;
