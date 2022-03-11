import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextH6B, TextB2R } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import { Item } from '@components/Item';
import { SpotsSearchItem } from '@components/Pages/Spot';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { MenuFilter } from '@components/Filter';
import { SpotSearchFilter } from '@components/Pages/Spot';
import { theme } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { spotSelector } from '@store/spot';

const SearchResult = ({ searchResult, goToOrder, isSpot }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { spotsPosition, spotsSearchResultFiltered } = useSelector(spotSelector);
  console.log(spotsSearchResultFiltered);

  const clickFilterHandler = () => {
    if (!isSpot) {
      dispatch(
        SET_BOTTOM_SHEET({
          content: <MenuFilter />,
        })
      );
    } else {
      dispatch(
        SET_BOTTOM_SHEET({
          content: <SpotSearchFilter />,
        })
      );
    }
  };

  const goToSpotsRegistrations = () => {
    router.push('/spot/regi-list');
  };

  return (
    <>
    {
      !!searchResult.length && (
        <FilterRow>
          <TextH5B>검색결과 {searchResult.length}개</TextH5B>
          <FilterWrapper onClick={clickFilterHandler}>
            <SVGIcon name="filter" />
            <TextH6B padding="0 0 0 4px">필터 및 정렬</TextH6B>
          </FilterWrapper>
        </FilterRow>
      )
    }
      <ItemListWrapper isSpot={isSpot}>
        {searchResult.length ? (
          searchResult.map((item: any, index: number) => {
            return !isSpot ? (
              <Item item={item} key={index} />
            ) : (
              // 스팟 검색 결과 리스트
              <SpotsSearchItem item={item} key={index} onClick={goToOrder} />
            );
          })
        ) : router.pathname === '/spot/search' ? (
          <NoResultWrapper>
            <NoResult>
              <TextB2R margin="0 0 32px 0" color={theme.greyScale65}>
                등록된 스팟이 없어 보이네요.😭
              </TextB2R>
              <Button
                margin="0 0 16px 0"
                backgroundColor={theme.white}
                color={theme.black}
                border
              >
                지도로 주변 프코스팟 찾기
              </Button>
              <Button backgroundColor={theme.white} color={theme.black} border onClick={goToSpotsRegistrations}>
                직접 프코스팟 신청하기
              </Button>
            </NoResult>
          </NoResultWrapper>
        ) : (
          <div>검색결과가 없습니다.</div>
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

const ItemListWrapper = styled.div<{ isSpot?: boolean }>`
  ${({ isSpot }) => {
    if (isSpot) {
      return css`
        display: flex;
        flex-direction: column;
        width: 100%;
      `;
    } else {
      return css`
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
      `;
    }
  }}
`;

const NoResultWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 150px;
`;

const NoResult = styled.div``;
export default React.memo(SearchResult);
