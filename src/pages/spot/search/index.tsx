import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@components/TextInput';
import { TextB1R, TextH3B } from '@components/Text';
import SpotItem, { ISpotItem } from '@components/Spot/SpotItem';
import axios from 'axios';
import debounce from 'lodash-es/debounce';
import SearchResult from '@components/SearchResult';
import { homePadding } from '@styles/theme';
import { SPOT_URL } from '@constants/mock';

function spotSearch() {
  const [spotList, setSpotList] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any>([]);
  const [recentPickedSpotList, setRecentPickedSpotList] = useState<string[]>(
    []
  );
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSpotList();
  }, []);

  const getSpotList = async () => {
    const { data } = await axios.get(`${SPOT_URL}`);
    setSpotList(data);
    const temp = data.slice();
    temp.pop();
    setRecentPickedSpotList(temp);
  };

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
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

      const filtered = spotList.filter((c) => {
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

  return (
    <Container>
      <Wrapper>
        <TextInput
          placeholder="도로명, 건물명 또는 지번으로 검색"
          svg="searchIcon"
          keyPressHandler={debounce(getSearchResult, 300)}
          eventHandler={debounce(changeInputHandler, 300)}
          ref={inputRef}
        />
      </Wrapper>
      {!searchResult.length ? (
        <DefaultSearchContainer>
          <RecentPickWrapper>
            <TextH3B padding="0 0 24px 0">최근 픽업 이력</TextH3B>
            {recentPickedSpotList.map((item: any, index) => (
              <SpotItem item={item} key={index} />
            ))}
          </RecentPickWrapper>
        </DefaultSearchContainer>
      ) : (
        <SearchResultContainer>
          <SearchResult searchResult={searchResult} isSpot />
        </SearchResultContainer>
      )}
    </Container>
  );
}

const Container = styled.main``;

const Wrapper = styled.div`
  padding: 8px 24px;
`;

const RecentPickWrapper = styled.div`
  margin-top: 24px;
  margin-bottom: 16px;
  ${homePadding};
`;

const DefaultSearchContainer = styled.div``;

const SearchResultContainer = styled.div`
  ${homePadding}
`;

const RecentSearchContainer = styled.div``;

export default spotSearch;
