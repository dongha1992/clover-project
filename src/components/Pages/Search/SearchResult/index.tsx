import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextH6B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import Item from '@components/Item';
import SpotItem from '@components/Pages/Spot/SpotItem';
import { useDispatch } from 'react-redux';
import { setBottomSheet } from '@store/bottomSheet';
import FilterGroup from '@components/Filter/FilterGroup';

function SearchResult({ searchResult, goToOrder, isSpot }: any) {
  const dispatch = useDispatch();

  const clickFilterHandler = () => {
    dispatch(
      setBottomSheet({
        content: <FilterGroup isSpot />,
        buttonTitle: '스팟필터',
      })
    );
  };
  return (
    <>
      <FilterRow>
        <TextH5B>검색결과 {searchResult.length}개</TextH5B>
        <FilterWrapper onClick={clickFilterHandler}>
          <SVGIcon name="filter" />
          <TextH6B padding="0 0 0 4px">필터 및 정렬</TextH6B>
        </FilterWrapper>
      </FilterRow>
      <ItemListWrapper isSpot={isSpot}>
        {searchResult.length > 0 ? (
          searchResult.map((item: any, index: number) => {
            return !isSpot ? (
              <Item item={item} key={index} />
            ) : (
              <SpotItem item={item} key={index} onClick={goToOrder} />
            );
          })
        ) : (
          <div>검색결과가 없습니다.</div>
        )}
      </ItemListWrapper>
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

const ItemListWrapper = styled.div<{ isSpot?: boolean }>`
  ${({ isSpot }) => {
    if (isSpot) {
      return css`
        display: flex;
        width: 100%;
      `;
    } else {
      return css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 16px;
      `;
    }
  }}
`;

export default React.memo(SearchResult);
