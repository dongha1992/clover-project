import React from 'react';
import styled from 'styled-components';
import { TextH5B, TextH6B } from '@components/Text';
import SVGIcon from '@utils/SVGIcon';
import Item from '@components/Item';
import { ItemListCol } from '@components/Home';

function index({ searchResult }: any) {
  console.log(searchResult);
  return (
    <>
      <FilterRow>
        <TextH5B>검색결과 {searchResult.length}개</TextH5B>
        <FilterWrapper>
          <SVGIcon name="filter" />
          <TextH6B padding="0 0 0 4px">필터 및 정렬</TextH6B>
        </FilterWrapper>
      </FilterRow>
      <ItemListCol>
        {searchResult.map((item: any, index: number) => {
          return <Item item={item} key={index} />;
        })}
      </ItemListCol>
    </>
  );
}

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 17px;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default index;
