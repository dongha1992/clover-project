/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { SearchResult, RecentSearch } from '@components/Pages/Search';
import { homePadding } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { useQuery } from 'react-query';
import { getMenusApi } from '@api/menu';
import { useDispatch, useSelector } from 'react-redux';
import { filterSelector, INIT_CATEGORY_FILTER } from '@store/filter';
import { menuSelector, SET_MENU_KEYWORD } from '@store/menu';
import { IMenus, Obj } from '@model/index';
import { getFilteredMenus, reorderedMenusBySoldout } from '@utils/menu';
import { useRouter } from 'next/router';
import { show, hide } from '@store/loading';

const LIMIT = 20;

const MenuSearchResultPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { keyword }: any = router.query;

  const [defaultMenus, setDefaultMenus] = useState<IMenus[]>();
  const [searchResult, setSearchResult] = useState<IMenus[]>([]);
  const [inputKeyword, setInputKeyword] = useState<string>('');
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);

  const { categoryFilters, type } = useSelector(filterSelector);
  const { menuKeyword } = useSelector(menuSelector);
  const isFilter = categoryFilters?.order || categoryFilters?.filter;

  useEffect(() => {
    initLocalStorage();
  }, []);

  useEffect(() => {
    return () => {
      dispatch(INIT_CATEGORY_FILTER());
    };
  }, []);

  useEffect(() => {
    if (menuKeyword) {
      startMenuSearch(menuKeyword);
    }
  }, [menuKeyword]);

  useEffect(() => {
    setLocalStorage();
  }, [recentKeywords]);

  useEffect(() => {
    const hasSearchResult = searchResult.length > 0;
    if ((categoryFilters?.order || categoryFilters?.filter) && hasSearchResult) {
      checkIsFiltered(defaultMenus!);
    }
  }, [categoryFilters]);

  useEffect(() => {
    if (keyword?.length === 0) {
      setSearchResult([]);
      return;
    }

    if (keyword) {
      startMenuSearch(keyword);
      dispatch(SET_MENU_KEYWORD(keyword));
      dispatch(INIT_CATEGORY_FILTER());
      reOrderRecentKeywords(keyword);
      // refetch();
    }
  }, [keyword]);

  const getSearchResult = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (e.key === 'Enter') {
      if (!value) {
        setSearchResult([]);
        return;
      }
      dispatch(SET_MENU_KEYWORD(value));
      dispatch(INIT_CATEGORY_FILTER());
      startMenuSearch(value);
      reOrderRecentKeywords(value);
      setInputKeyword(value);
      refetch();
      router.replace({
        query: { keyword: value },
      });
    }
  };

  const {
    error: menuError,
    refetch,
    isLoading,
    isFetching,
  } = useQuery(
    ['getMenus'],
    async () => {
      dispatch(show());
      const params = {
        keyword: inputKeyword,
        type: '',
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
        setDefaultMenus(data);
        checkIsFiltered(data);
      },
      onSettled: () => {
        dispatch(hide());
      },
    }
  );

  const checkIsFiltered = (menuList: IMenus[]) => {
    const searchResult = isFilter ? getFilteredMenus({ menus: menuList, categoryFilters }) : menuList;
    const reOrderedSearchResult = reorderedMenusBySoldout(searchResult!);
    setSearchResult(reOrderedSearchResult!);
  };

  const startMenuSearch = (keyword: string) => {
    setInputKeyword(keyword);
    setIsSearched(true);
  };

  const deleteAllRecentKeyword = () => {
    localStorage.removeItem('recentSearch');
    setRecentKeywords([]);
  };

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputKeyword(value);
    dispatch(INIT_CATEGORY_FILTER());
    if (!value) {
      setSearchResult([]);
      setIsSearched(false);
    }
  };

  const reOrderRecentKeywords = (value: string) => {
    const deletedDuplicateKeywords = findDuplicate(value);
    const mergedKeywords = [value, ...deletedDuplicateKeywords];
    const isLimit = mergedKeywords.length === LIMIT + 1;

    const deleteLastKeywords = isLimit ? findLastKeyword(mergedKeywords) : mergedKeywords;
    setRecentKeywords(deleteLastKeywords);
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
    setInputKeyword('');
    setIsSearched(false);
    setSearchResult([]);
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
    dispatch(SET_MENU_KEYWORD(keyword));
    startMenuSearch(keyword);
    router.replace({
      query: { keyword: keyword },
    });
  };

  if (isFetching) {
    return <></>;
  }

  return (
    <Container>
      <Wrapper>
        <TextInput
          inputType="text"
          placeholder="???????????? ????????? ??????????????????."
          svg="searchIcon"
          keyPressHandler={getSearchResult}
          eventHandler={changeInputHandler}
          value={inputKeyword}
        />
        {inputKeyword.length > 0 && (
          <div className="removeSvg" onClick={clearInputHandler}>
            <SVGIcon name="removeItem" />
          </div>
        )}
      </Wrapper>
      {inputKeyword && isSearched && (
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
    right: 9%;
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

export default MenuSearchResultPage;
