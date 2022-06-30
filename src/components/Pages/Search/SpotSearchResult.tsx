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
import { SpotSearchFilter } from '@components/Pages/Spot';
import { theme } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import { spotSelector } from '@store/spot';
import { ISpotsDetail } from '@model/index';

interface IProps {
  searchResult?: ISpotsDetail[];
  onClick?: () => void;
  orderId?: string | string[];
  hasCart?: boolean;
  getLocation?: any;
}

const SpotSearchResult = ({ searchResult, onClick, orderId, getLocation, hasCart}: IProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { spotsPosition } = useSelector(spotSelector);

  const clickFilterHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <SpotSearchFilter getLocation={getLocation} />,
      })
    );
  };

  const goToSpotsRegistrations = () => {
    router.push('/spot/join');
  };

  return (
    <>
      {!!searchResult?.length && (
        <FilterRow>
          <TextH5B>검색결과 {searchResult.length}개</TextH5B>
          <FilterWrapper onClick={clickFilterHandler}>
            <SVGIcon name="filter" />
            <TextH6B padding="0 0 0 4px">필터 및 정렬</TextH6B>
          </FilterWrapper>
        </FilterRow>
      )}
      <ItemListWrapper>
        {searchResult?.length ? (
          searchResult?.map((item, index) => {
            return (
              // 스팟 검색 결과 리스트
              <SpotsSearchResultList item={item} key={index} hasCart={hasCart} />
            );
          })
        ) :  (
          <NoResultWrapper>
            <NoResult>
              <TextB2R margin="0 0 32px 0" color={theme.greyScale65}>
                등록된 스팟이 없어 보이네요.😭
              </TextB2R>
              <Button margin="0 0 16px 0" backgroundColor={theme.white} color={theme.black} border>
                지도로 주변 프코스팟 찾기
              </Button>
              {!orderId && (
                <Button backgroundColor={theme.white} color={theme.black} border onClick={goToSpotsRegistrations}>
                  직접 프코스팟 신청하기
                </Button>
              )}
            </NoResult>
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
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ItemListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const NoResultWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 150px;
`;

const NoResult = styled.div``;


export default SpotSearchResult;
