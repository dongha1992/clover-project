import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextH6B, TextB2R } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { Item } from '@components/Item';
import { SpotsSearchResultList } from '@components/Pages/Spot';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { MenuFilter } from '@components/Filter';
import { theme } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { spotSelector } from '@store/spot';
import { ISpotsDetail } from '@model/index';

interface IProps {
  searchResult?: ISpotsDetail[] | any | undefined;
  onClick?: () => void;
  orderId?: string | string[];
  hasCart?: boolean;
  getLocation?: any;
  isLoading?: boolean;
}

const SearchResult = ({ searchResult, onClick, orderId, hasCart, getLocation }: IProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const clickFilterHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <MenuFilter />,
      })
    );
  };

  console.log(searchResult, 'searchResult');

  return (
    <>
      {searchResult?.length! > 0 && (
        <FilterRow>
          <TextH5B>검색결과 {searchResult?.length}개</TextH5B>
          <FilterWrapper onClick={clickFilterHandler}>
            <SVGIcon name="filter" />
            <TextH6B padding="0 0 0 4px" pointer>
              정렬 및 필터
            </TextH6B>
          </FilterWrapper>
        </FilterRow>
      )}
      <ItemListWrapper>
        {searchResult.length ? (
          searchResult.map((item: any, index: number) => {
            return <Item item={item} key={index} />;
          })
        ) : (
          <NoResultWrapper>
            <TextB2R color={theme.greyScale65}>
              {'검색하신 상품을 찾을 수 없어요.\n 다른 검색어를 입력해 보세요. 😭'}
            </TextB2R>
          </NoResultWrapper>
        )}
      </ItemListWrapper>
    </>
  );
};

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 17px;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ItemListWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`;

const NoResultWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const NoResult = styled.div``;

export default React.memo(SearchResult);
