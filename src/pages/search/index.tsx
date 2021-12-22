import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { CATEGORY } from '@constants/search';
import { TextB1R, TextH3B } from '@components/Shared/Text';
import BorderLine from '@components/Shared/BorderLine';
import { ItemListCol } from '@components/Home';
import Item from '@components/Item';
import axios from 'axios';
import debounce from 'lodash-es/debounce';
import SearchResult from '@components/Pages/Search/SearchResult';
import { homePadding } from '@styles/theme';
import RecentSearch from '@components/Pages/Search/RecentSearch';
import Link from 'next/link';
import { BASE_URL } from '@constants/mock';

function SearchPage() {
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
    const { data } = await axios.get(`${BASE_URL}`);
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
          keyPressHandler={getSearchResult}
          eventHandler={changeInputHandler}
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
