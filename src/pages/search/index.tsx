import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { CATEGORY } from '@constants/search';
import { TextB1R, TextH3B } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';
import { Item } from '@components/Item';
import { SearchResult, RecentSearch } from '@components/Pages/Search';
import { homePadding, FlexWrapWrapper } from '@styles/theme';
import Link from 'next/link';
import { SVGIcon } from '@utils/common';
import { useQuery } from 'react-query';
import { getMenusApi, getRecommendMenusApi } from '@api/menu';
import { useDispatch, useSelector } from 'react-redux';
import { filterSelector, INIT_CATEGORY_FILTER } from '@store/filter';
import { IMenus, Obj } from '@model/index';
import cloneDeep from 'lodash-es/cloneDeep';
import { debounce } from 'lodash-es';

const SearchPage = () => {
  const [defaultMenus, setDefaultMenus] = useState<IMenus[]>();
  const [searchResult, setSearchResult] = useState<any>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { categoryFilters, type } = useSelector(filterSelector);
  const isFilter = categoryFilters?.order || categoryFilters?.filter;

  const {
    data: menus,
    error: mdMenuError,
    isLoading: mdIsLoading,
  } = useQuery(
    ['getMenus', type],
    async () => {
      const { data } = await getRecommendMenusApi();
      return data.data.sort((a: any, b: any) => a.isSold - b.isSold);
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  /* TODO: [category] 쪽이랑 코드 중복 */

  const { error: menuError, isLoading } = useQuery(
    ['getMenus', type],
    async ({ queryKey }) => {
      const params = {
        type: '',
        searchKeyword: keyword,
      };

      const { data } = await getMenusApi(params);
      return data.data;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!isSearched,
      onError: () => {},
      onSuccess: (data) => {
        const reOrdered = checkIsSold(data);
        setDefaultMenus(reOrdered);
        checkIsFiltered(reOrdered);
      },
    }
  );

  const checkIsFiltered = (menuList: IMenus[]) => {
    if (isFilter) {
      const filered = filteredMenus(menuList);
      setSearchResult(filered!);
    } else {
      setSearchResult(menuList);
    }
  };

  useEffect(() => {
    if (categoryFilters?.order || categoryFilters?.filter) {
      checkIsFiltered(defaultMenus!);
    }
  }, [categoryFilters]);

  useEffect(() => {
    initLocalStorage();
  }, []);

  useEffect(() => {
    setLocalStorage();
  }, [recentKeywords]);

  const changeInputHandler = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setKeyword(value);
    setIsSearched(false);
    dispatch(INIT_CATEGORY_FILTER());

    if (!value) {
      setSearchResult([]);
    }
  }, 300);

  const getSearchResult = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;

    if (e.key === 'Enter') {
      if (!value) {
        setSearchResult([]);
        return;
      }

      setIsSearched(true);
      setRecentKeywords([...recentKeywords, value]);

      // const params = { searchKeyword: keyword, type: '' };
      // try {
      //   const { data } = await getMenusApi(params);
      //   if (data.code === 200) {
      //     if (data.data?.length! > 0) {
      //       setSearchResult(data.data);
      //     } else {
      //       // 검색 결과 없음
      //       setSearchResult('');
      //     }
      //   }
      // } catch (error) {}
    }
  };

  const onFocusHandler = () => {
    setIsFocus(true);
  };

  const onBlurHandler = () => {
    setIsFocus(false);
    initInputHandler();
  };

  const clearInputHandler = () => {
    initInputHandler();
  };

  const initInputHandler = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const removeRecentSearchItemHandler = useCallback(
    (keyword: string) => {
      const filtedRecentList = recentKeywords.filter((k) => k !== keyword);
      setRecentKeywords(filtedRecentList);
    },
    [recentKeywords]
  );

  const initLocalStorage = () => {
    try {
      const data = localStorage.getItem('recentSearch');
      return data ? setRecentKeywords(JSON.parse(data)) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const setLocalStorage = () => {
    localStorage.setItem('recentSearch', JSON.stringify(recentKeywords));
  };

  const filteredMenus = (menuList: IMenus[]) => {
    try {
      let copiedMenuList = cloneDeep(menuList);
      const hasCategory = categoryFilters?.filter?.filter((i) => i).length !== 0;

      if (hasCategory) {
        copiedMenuList = copiedMenuList.filter((menu: Obj) => categoryFilters?.filter.includes(menu.category));
      }

      if (!categoryFilters?.order) {
        return copiedMenuList;
      } else {
        switch (categoryFilters?.order) {
          case '': {
            return menuList;
          }
          case 'ORDER_COUNT_DESC': {
            return copiedMenuList.sort((a, b) => b.orderCount - a.orderCount);
          }
          case 'LAUNCHED_DESC': {
            return copiedMenuList.sort((a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime());
          }
          case 'PRICE_DESC': {
            return getPriceOrder(copiedMenuList, 'max');
          }
          case 'PRICE_ASC': {
            return getPriceOrder(copiedMenuList, 'min');
          }
          case 'REVIEW_COUNT_DESC': {
            return copiedMenuList.sort((a, b) => b.reviewCount - a.reviewCount);
          }
          default:
            return menuList;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPriceOrder = (list: IMenus[], order: 'max' | 'min') => {
    const mapped = list?.map((menu: IMenus) => {
      const prices = menu?.menuDetails?.map((item) => item.price);
      return { ...menu, [order]: Math[order](...prices) };
    });

    return mapped.sort((a: any, b: any) => {
      const isMin = order === 'min';
      return isMin ? a[order] - b[order] : b[order] - a[order];
    });
  };

  const checkIsSold = (menuList: IMenus[]) => {
    return menuList?.sort((a: any, b: any) => {
      return a.isSold - b.isSold;
    });
  };

  return (
    <Container>
      <Wrapper>
        <TextInput
          placeholder="원하시는 상품을 검색해보세요."
          svg="searchIcon"
          keyPressHandler={getSearchResult}
          eventHandler={changeInputHandler}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          ref={inputRef}
        />
        {inputRef.current && inputRef.current?.value.length > 0 && (
          <div className="removeSvg" onClick={clearInputHandler}>
            <SVGIcon name="removeItem" />
          </div>
        )}
      </Wrapper>
      {keyword && isSearched ? (
        <SearchResultContainer>
          <SearchResult searchResult={searchResult} />
        </SearchResultContainer>
      ) : (
        <>
          {!isFocus ? (
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
                <TextH3B padding="24px">MD 추천</TextH3B>
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
          ) : (
            <RecentSearchContainer>
              <RecentSearch
                recentKeywords={recentKeywords}
                removeRecentSearchItemHandler={removeRecentSearchItemHandler}
              />
            </RecentSearchContainer>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.main``;

const Wrapper = styled.div`
  padding: 8px 24px;
  position: relative;
  .removeSvg {
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const DefaultSearchContainer = styled.div``;

const SearchResultContainer = styled.div`
  ${homePadding}
`;

const RecentSearchContainer = styled.div``;

const MdRecommendationWrapper = styled.div`
  margin-bottom: 48px;
  padding: 8px 24px;
`;

export default SearchPage;
