import React, { useEffect, useState, useRef } from 'react';
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

function index() {
  const [itemList, setItemList] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any>([]);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    const { data } = await axios.get(
      'https://gist.githubusercontent.com/dongha1992/7780e6a89c3feb8ffab266a8b9e34f12/raw/2088b0c308d7f0c9350e0109b4c78cee8bcfb73e/items.json'
    );
    setItemList(data);
  };

  const getSearchResult = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const keyword = (e.target as HTMLInputElement).value;

    if (e.key === 'Enter') {
      if (!keyword) {
        setSearchResult('');
        return;
      }
      const filtered = itemList.filter((c) => {
        return c.name.replace(/ /g, '').indexOf(keyword) > -1;
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
        <Header title="검색" />
        <TextInput
          placeholder="원하시는 상품을 검색해보세요."
          svg="searchIcon"
          keyPressHandler={debounce(getSearchResult, 300)}
        />
      </Wrapper>
      {!searchResult.length ? (
        <DefaultSearchContainer>
          <CategoryWrapper>
            <TextH3B>카테고리</TextH3B>
            <CatetoryList>
              {CATEGORY.map((item, index) => {
                return (
                  <TextB1R key={index} width="148px" padding="8px 0">
                    {item.title}
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
        <SearchResultContainer>
          <SearchResult searchResult={searchResult} />
        </SearchResultContainer>
      )}
    </Container>
  );
}

const Container = styled.main`
  margin-top: 56px;
`;

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

const MdRecommendationWrapper = styled.div`
  margin-bottom: 48px;
  padding: 8px 24px;
`;

export default index;
