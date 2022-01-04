import React from 'react';
import styled, { css } from 'styled-components';
import { TextH5B, TextH6B, TextB2R } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import { Item } from '@components/Item';
import SpotItem from '@components/Pages/Spot/SpotItem';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setBottomSheet } from '@store/bottomSheet';
import { MenuFilter } from '@components/Filter';
import SpotSearchFilter from '@components/Pages/Spot/SpotSearchFilter';
import { theme } from '@styles/theme';
import Button from '@components/Shared/Button';

const SearchResult = ({ searchResult, goToOrder, isSpot }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const clickFilterHandler = () => {
    if (!isSpot) {
      dispatch(
        setBottomSheet({
          content: <MenuFilter />,
          buttonTitle: '적용하기',
        })
      );
    } else {
      dispatch(
        setBottomSheet({
          content: <SpotSearchFilter />,
          buttonTitle: '스팟필터',
        })
      );
    }
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
                지도로 주변 스팟 찾기
              </Button>
              <Button backgroundColor={theme.white} color={theme.black} border>
                나의 회사•학교를 프코스팟으로 신청하기
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
