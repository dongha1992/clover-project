import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { TextB1R, TextH3B } from '@components/Shared/Text';
import SpotItem, { ISpotItem } from '@components/Pages/Spot/SpotItem';
import axios from 'axios';
import SearchResult from '@components/Pages/Search/SearchResult';
import { homePadding } from '@styles/theme';
import { SPOT_URL } from '@constants/mock';
import { useDispatch } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
import PickupSheet from '@components/BottomSheet/PickupSheet';

function spotSearch() {
  const [spotList, setSpotList] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any>([]);
  const [recentPickedSpotList, setRecentPickedSpotList] = useState<string[]>(
    []
  );
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

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

  const goToOrder = useCallback(() => {
    dispatch(
      setBottomSheet({
        content: <PickupSheet />,
        buttonTitle: '주문하기',
      })
    );
  }, []);

  return (
    <Container>
      <Wrapper>
        <TextInput
          placeholder="도로명, 건물명 또는 지번으로 검색"
          svg="searchIcon"
          keyPressHandler={getSearchResult}
          eventHandler={changeInputHandler}
          ref={inputRef}
        />
      </Wrapper>
      {!searchResult.length ? (
        <DefaultSearchContainer>
          <RecentPickWrapper>
            <TextH3B padding="0 0 24px 0">최근 픽업 이력</TextH3B>
            {recentPickedSpotList.map((item: any, index) => (
              <SpotItem item={item} key={index} onClick={goToOrder} />
            ))}
          </RecentPickWrapper>
        </DefaultSearchContainer>
      ) : (
        <SearchResultContainer>
          <SearchResult
            searchResult={searchResult}
            isSpot
            onClick={goToOrder}
          />
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
