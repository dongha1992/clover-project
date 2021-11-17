import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Header from '@components/Header';
import TextInput from '@components/TextInput';
import { CATEGORY } from '@constants/search';
import { TextB1R, TextH3B } from '@components/Text';
import BorderLine from '@components/BorderLine';
import { ItemListCol } from '@components/Home';
import Item from '@components/Item';
import axios from 'axios';
import debounce from 'lodash-es/debounce';
import SearchResult from '@components/SearchResult';
import { homePadding } from '@styles/theme';
import { useLocalStorage } from '@hooks/useLocalStorage';
import RecentSearch from '@components/RecentSearch';
import Link from 'next/link';

function search() {
  /* TODO: useLocalStorage 정리해야함 */
  // const [storedValue, setLocalStorageValue] = useLocalStorage(
  //   'recentSearch',
  //   []
  // );

  const [itemList, setItemList] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getBanners();
    initLocalStorage();
  }, []);

  useEffect(() => {
    setLocalStorage();
  }, [recentKeywords]);

  const getBanners = async () => {
    const { data } = await axios.get(
      'https://gist.githubusercontent.com/dongha1992/7780e6a89c3feb8ffab266a8b9e34f12/raw/2088b0c308d7f0c9350e0109b4c78cee8bcfb73e/items.json'
    );
    setItemList(data);
  };

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setKeyword(value);
    setIsSearched(false);

    if (!value) {
      setSearchResult([]);
    }
  };

  const getSearchResult = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const { value } = e.target as HTMLInputElement;

    if (e.key === 'Enter') {
      if (!value) {
        setSearchResult([]);
        return;
      }

      setIsSearched(true);
      setRecentKeywords([...recentKeywords, value]);

      const filtered = itemList.filter((c) => {
        return c.name.replace(/ /g, '').indexOf(value) > -1;
      });
      if (filtered.length > 0) {
        setSearchResult(filtered);
      } else {
        // 검색 결과 없음
        setSearchResult('');
      }
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

  return (
    <Container>
      <Wrapper>
        <TextInput
          placeholder="원하시는 상품을 검색해보세요."
          svg="searchIcon"
          keyPressHandler={debounce(getSearchResult, 300)}
          eventHandler={debounce(changeInputHandler, 300)}
          ref={inputRef}
        />
      </Wrapper>
      {keyword && isSearched ? (
        <SearchResultContainer>
          <SearchResult searchResult={searchResult} />
        </SearchResultContainer>
      ) : (
        <>
          {!keyword.length ? (
            <DefaultSearchContainer>
              <CategoryWrapper>
                <TextH3B>카테고리</TextH3B>
                <CatetoryList>
                  {CATEGORY.map((item, index) => {
                    return (
                      <TextB1R key={index} width="148px" padding="8px 0">
                        <Link href={item.link}>
                          <a>{item.title}</a>
                        </Link>
                      </TextB1R>
                    );
                  })}
                </CatetoryList>
              </CategoryWrapper>
              <BorderLine />
              <MdRecommendationWrapper>
                <TextH3B padding="24px 0">MD 추천</TextH3B>
                <ItemListCol>
                  {itemList.map((item, index) => {
                    return <Item item={item} key={index} />;
                  })}
                </ItemListCol>
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
}

const Container = styled.main``;

const Wrapper = styled.div`
  padding: 8px 24px;
`;

const CategoryWrapper = styled.div`
  margin-top: 24px;
  ${homePadding}
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

export default search;
