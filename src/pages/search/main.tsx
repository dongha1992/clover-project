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
import debounce from 'lodash-es/debounce';

const LIMIT = 20;

const SearchMainPage = () => {
  const [defaultMenus, setDefaultMenus] = useState<IMenus[]>();
  const [searchResult, setSearchResult] = useState<any>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { categoryFilters, type } = useSelector(filterSelector);
  const isFilter = categoryFilters?.order || categoryFilters?.filter;

  /* TODO: [category] 쪽이랑 코드 중복 */

  const {
    error: menuError,
    refetch,
    isLoading,
    isFetching,
  } = useQuery(
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
    // setIsLoading(false);
  };

  useEffect(() => {
    const hasSearchResult = searchResult.length > 0;
    if ((categoryFilters?.order || categoryFilters?.filter) && hasSearchResult) {
      checkIsFiltered(defaultMenus!);
    }
  }, [categoryFilters]);

  useEffect(() => {
    initLocalStorage();
  }, []);

  useEffect(() => {
    setLocalStorage();
  }, [recentKeywords]);

  const deleteAllRecentKeyword = () => {
    localStorage.removeItem('recentSearch');
    setRecentKeywords([]);
  };

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setKeyword(value);
    dispatch(INIT_CATEGORY_FILTER());
    if (!value) {
      setSearchResult([]);
      setIsSearched(false);
    }
  };

  const getSearchResult = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    // setIsLoading(true);
    const { value } = e.target as HTMLInputElement;
    if (e.key === 'Enter') {
      if (!value) {
        setSearchResult([]);
        return;
      }

      const deletedDuplicateKeywords = findDuplicate(value);
      const mergedKeywords = [value, ...deletedDuplicateKeywords];
      if (mergedKeywords.length === LIMIT + 1) {
        const deleteLastKeywords = findLastKeyword(mergedKeywords);
        setRecentKeywords(deleteLastKeywords);
      } else {
        setRecentKeywords(mergedKeywords);
      }
      // setIsLoading(false);
      setIsSearched(true);
      dispatch(INIT_CATEGORY_FILTER());
      refetch();
    }
  };

  const findDuplicate = (value: string) => {
    return recentKeywords.filter((item) => item !== value);
  };

  const findLastKeyword = (list: string[]) => {
    return list.filter((item, index) => index < list.length - 1);
  };

  const clearInputHandler = () => {
    initInputHandler();
  };

  const initInputHandler = () => {
    setKeyword('');
    setIsSearched(false);
  };

  const removeRecentSearchItemHandler = useCallback(
    (keyword: string, index: number) => {
      const filtedRecentList = recentKeywords.filter((k, i) => i !== index);
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

  const selectRecentSearchItemHandler = (keyword: string) => {
    setKeyword(keyword);
    setIsSearched(true);
  };

  const filteredMenus = (menuList: IMenus[]) => {
    try {
      let copiedMenuList = cloneDeep(menuList);
      const hasCategory = categoryFilters?.filter && categoryFilters?.filter?.filter((i) => i).length !== 0;
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

  console.log(isLoading, 'isLoading', searchResult, isSearched, 'isSearched');
  if (isFetching) {
    return <div>로딩중</div>;
  }

  return (
    <Container>
      <Wrapper>
        <TextInput
          placeholder="원하시는 상품을 검색해보세요."
          svg="searchIcon"
          keyPressHandler={getSearchResult}
          eventHandler={changeInputHandler}
          // onFocus={onFocusHandler}
          // onBlur={onBlurHandler}
          value={keyword || ''}
        />
        {keyword.length > 0 && (
          <div className="removeSvg" onClick={clearInputHandler}>
            <SVGIcon name="removeItem" />
          </div>
        )}
      </Wrapper>
      {keyword && isSearched && (
        <SearchResultContainer>
          <SearchResult searchResult={searchResult} />
        </SearchResultContainer>
      )}
      {!isSearched && (
        <RecentSearchContainer>
          <RecentSearch
            recentKeywords={recentKeywords}
            removeRecentSearchItemHandler={removeRecentSearchItemHandler}
            deleteAllRecentKeyword={deleteAllRecentKeyword}
            selectRecentSearchItemHandler={selectRecentSearchItemHandler}
          />
        </RecentSearchContainer>
      )}
    </Container>
  );
};

const Container = styled.main``;

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

export default SearchMainPage;
