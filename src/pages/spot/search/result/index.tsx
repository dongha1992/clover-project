/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { SpotSearchResult } from '@components/Pages/Search';
import { homePadding } from '@styles/theme';
import { theme, textBody2 } from '@styles/theme';
import { TextH3B } from '@components/Shared/Text';
import { SpotSearchMapPage } from '@components/Pages/Spot';
import { SVGIcon } from '@utils/common';
import { ISpotsDetail } from '@model/index';
import { useQuery } from 'react-query';
import { IParamsSpots } from '@model/index';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import 'swiper/css';
import { destinationForm } from '@store/destination';
import {
  spotSelector,
  INIT_SEARCH_SELECTED_FILTERS,
  SET_SPOT_SEARCH_SORT,
  SET_SPOT_MAP_SWITCH,
  SET_SPOT_POSITIONS,
} from '@store/spot';
import { getDestinationsApi } from '@api/destination';
import { getSpotSearch, getSpotsAllListApi } from '@api/spot';
import { IDestinationsResponse } from '@model/index';
import { SpotSearchKeywordSlider, SpotRecentPickupList } from '@components/Pages/Spot';
import { getFilteredSpotList } from '@utils/spot';
import { SET_ALERT } from '@store/alert';
// import { getCartsApi } from '@api/cart';
// import { INIT_CART_LISTS, SET_CART_LISTS } from '@store/cart';

const SpotSearchResultPage = (): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { orderId, isDelivery, keyword } = router.query;
  const { spotsPosition, spotSearchSelectedFilters, spotSearchSort, isMapSwitch } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);

  const [searchResult, setSearchResult] = useState<ISpotsDetail[]>([]);
  const [defaultSpotList, setDefaultSpotList] = useState<ISpotsDetail[]>([]);
  const [paginatedSpotList, setPaginatedSpotList] = useState<ISpotsDetail[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [inputKeyword, setInputKeyword] = useState<string>('');
  const [size, setSize] = useState<number>(10);
  const [spotListAllCheck, setSpotListAllCheck] = useState<boolean>(false);
  const [isFocusing, setIsFocusing] = useState<boolean>(false);
  const [routerQueries, setRouterQueries] = useState({});

  const userLocationLen = userLocation.emdNm?.length! > 0;
  const latLen = spotsPosition?.latitude !== null;
  const latitude = latLen ? Number(spotsPosition?.latitude) : null;
  const lonLen = spotsPosition?.longitude !== null;
  const longitude = lonLen ? Number(spotsPosition?.longitude) : null;

  useEffect(() => {
    if (router.isReady) {
      setRouterQueries(router.query);
    }
  }, [router.isReady]);

  useEffect(() => {
    inputRef.current?.focus();
    // setKeyword(queryKeyword);
    dispatch(SET_SPOT_MAP_SWITCH(false));
    if (inputKeyword?.length === 0) {
      //   getSpotsAllList();
      setSpotListAllCheck(true);
    }

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (Math.round(scrollTop + clientHeight) >= scrollHeight) {
        setSize((prevSize) => prevSize + 10);
      }
    };
    // scroll event listener 등록
    window.addEventListener('scroll', handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // 지정된 키워드 변경에 따른 api 호출
    if (keyword?.length === 0) {
      getPaginatedSpotList([]);
      getSpotsAllList();
      return;
    }
    if (keyword) {
      startSpotListSearch(keyword);
      getPaginatedSpotList(searchResult);
      setIsSearched(true);
      setSpotListAllCheck(false);
    }
  }, [keyword]);

  useEffect(() => {
    // 정렬및 필터 반영
    const hasSearchResult = searchResult.length > 0;
    if ((spotSearchSort || spotSearchSelectedFilters) && hasSearchResult) {
      spotFiltered(defaultSpotList);
    }
  }, [spotSearchSelectedFilters, spotSearchSort]);

  useEffect(() => {
    // 인피니티 스크롤 반영
    getPaginatedSpotList(searchResult);
  }, [size, searchResult]);

  useEffect(() => {
    if (orderId) {
      if (inputRef.current) {
        inputRef.current.focus();
      } else {
        return;
      }
    }
  }, [orderId]);

  useEffect(() => {
    if (isDelivery) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      return;
    }
  }, [isDelivery]);

  // GPS - 현재위치 가져오기
  const getCurrentPosition = () =>
    new Promise((resolve, error) => navigator.geolocation.getCurrentPosition(resolve, error));

  const getLocation = async () => {
    try {
      const position: any = await getCurrentPosition();
      if (position) {
        // console.log('위치 들어옴', position.coords.latitude + ' ' + position.coords.longitude);
        dispatch(
          SET_SPOT_POSITIONS({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        );
      }
      return { Status: true, position };
    } catch (error) {
      dispatch(
        SET_ALERT({
          alertMessage: '알 수 없는 에러가 발생했습니다.',
          submitBtnText: '확인',
        })
      );
      console.error('getCurrentLatLong::catcherror =>', error);
      return { Status: false };
    }
  };

  // 최근 픽업 이력 조회 api
  const { data: recentPickedSpotList, isLoading: isLoadingPickup } = useQuery<IDestinationsResponse[]>(
    'getDestinationList',
    async () => {
      const params = {
        page: 1,
        size: 10,
        delivery: 'SPOT',
        latitude: latitude,
        longitude: longitude,
      };
      const { data } = await getDestinationsApi(params);
      return data.data.destinations;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  // 스팟 검색 결과 호출
  const getSearchResult = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (e.key === 'Enter') {
      if (!value) {
        getSpotsAllList();
        setSearchResult([]);
        return;
      }
      defaultSortRedioId();
      dispatch(INIT_SEARCH_SELECTED_FILTERS());
      setSpotListAllCheck(false);
      startSpotListSearch(value);
      refetch();
      setInputKeyword(value);
      router.replace({
        query: {...routerQueries, keyword: value},
      });
    }
  };

  //스팟 검색 리스트 api
  const {
    error: spotSearchError,
    refetch,
    isLoading,
    isFetching,
  } = useQuery(
    ['spotSearchList'],
    async () => {
      const params = {
        keyword: inputKeyword,
        latitude: latitude,
        longitude: longitude,
      };
      const { data } = await getSpotSearch(params);
      return data.data;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!isSearched,
      onError: () => {},
      onSuccess: (data) => {
        spotFiltered(data.spots);
        setDefaultSpotList(data.spots);
        setSize(10);
      },
    }
  );

  // 스팟 전체 리스트 api
  const getSpotsAllList = async () => {
    try {
      const params = {
        latitude: latitude,
        longitude: longitude,
      };
      const { data } = await getSpotsAllListApi(params);
      if (data.code === 200) {
        const list = data.data;
        setSearchResult(list);
        setSpotListAllCheck(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const spotFiltered = (spotList: ISpotsDetail[]) => {
    // 스팟 검색 결과 정렬및필터
    const isFiltered = spotSearchSelectedFilters || spotSearchSort;
    const spotsFilterdList = isFiltered
      ? getFilteredSpotList({ spotList: spotList, sort: spotSearchSort, filter: spotSearchSelectedFilters })
      : spotList;
    setSearchResult(spotsFilterdList);
  };

  const getPaginatedSpotList = (searchResults: ISpotsDetail[]) => {
    const list = searchResults?.slice(0, size);
    setPaginatedSpotList(list);
  };

  const startSpotListSearch = (keyword: any) => {
    setInputKeyword(keyword);
    setIsSearched(true);
  };

  const selectedSelectedKeywordVaule = (keyword: string) => {
    setInputKeyword(keyword);
    startSpotListSearch(keyword);
    defaultSortRedioId();
    dispatch(INIT_SEARCH_SELECTED_FILTERS());
    router.replace({
      query: {...routerQueries, keyword: keyword},
    });
  };

  const changeInputHandler = (e: any) => {
    const value = e.target.value;
    setInputKeyword(value);
    defaultSortRedioId();
    dispatch(INIT_SEARCH_SELECTED_FILTERS());
    if (!value) {
      setIsSearched(false);
      setInputKeyword('');
    }
  };

  const clearInputHandler = () => {
    if (inputRef.current?.value.length! > 0) {
      defaultSortRedioId();
      dispatch(INIT_SEARCH_SELECTED_FILTERS());
      initInputHandler();
      setIsSearched(false);
      setInputKeyword('');
    }
  };

  const initInputHandler = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const defaultSortRedioId = () => {
    // 검색 결과 정렬 초기화
    if (userLocationLen) {
      return dispatch(SET_SPOT_SEARCH_SORT('nearest'));
    } else if (!userLocationLen) {
      return dispatch(SET_SPOT_SEARCH_SORT('frequency'));
    }
  };

  const goToSwitchMap = () => {
    // 검색 결과 없는 경우, 내 주변 프코스팟 찾기 버튼
    getSpotsAllList();
    dispatch(SET_SPOT_MAP_SWITCH(true));
  };

  const goToSpotsRegistrations = () => {
    router.push('/spot/join');
  };

  if (isFetching) {
    return <div>로딩</div>;
  }

  // 검색바 활성화 된 상테
  // 위치 정보 있는 경우
  // -> 추천 스팟 노출
  // -> 추천 스팟 없으면 픽업 이력 노출
  // -> 픽업 이력 없으면 빈 화면 노출

  // 위치 정보 없는 경우
  // -> 픽업 이력 노출
  // -> 픽업 이력 없는 경우 빈 화면 노출
  return (
    <Container>
      {isMapSwitch ? (
        <SpotSearchMapPage spotListAllCheck={spotListAllCheck} spotSearchList={searchResult} isSearched={isSearched} />
      ) : (
        <>
          <SearchBarWrapper>
            <label className="textLabel">
              {inputKeyword.length === 0 && <span className="textPlaceholde">도로명, 건물명 또는 지번으로 검색</span>}
              <TextInput
                inputType="text"
                svg="searchIcon"
                fontSize="14px"
                keyPressHandler={getSearchResult}
                eventHandler={changeInputHandler}
                value={inputKeyword}
                ref={inputRef}
                withValue
              />
            </label>
            {inputKeyword.length > 0 && (
              <div className="removeSvg" onClick={clearInputHandler}>
                <SVGIcon name="removeItem" />
              </div>
            )}
          </SearchBarWrapper>
          {!isSearched && <SpotSearchKeywordSlider onChange={selectedSelectedKeywordVaule} />}
          {!isSearched &&
            (recentPickedSpotList?.length! > 0 ? (
              <DefaultSearchContainer>
                <RecentPickWrapper>
                  <TextH3B padding="0 0 12px 0">최근 픽업 이력</TextH3B>
                  {recentPickedSpotList?.map((item: any, index) => (
                    // 스팟 최근 픽업 이력 리스트
                    <SpotRecentPickupList item={item} key={index} hasCart={true} />
                  ))}
                </RecentPickWrapper>
              </DefaultSearchContainer>
            ) : null)}
          {isSearched && ( // 검색 결과
            <SearchResultContainer>
              <SpotSearchResult
                searchResult={paginatedSpotList}
                orderId={orderId}
                hasCart={true}
                getLocation={getLocation}
                goToSwitchMap={goToSwitchMap}
                goToSpotsRegistrations={goToSpotsRegistrations}
                totalCount={searchResult.length}
              />
            </SearchResultContainer>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.section``;

const SearchBarWrapper = styled.div`
  position: relative;
  margin: 0 24px 0 24px;
  padding-top: 8px;
  .textLabel {
    width: 100%;
    .textPlaceholde {
      position: absolute;
      top: 22px;
      left: 49px;
      z-index: 100;
      color: ${theme.greyScale45};
      ${textBody2};
    }
  }
  .removeSvg {
    position: absolute;
    right: 0;
    top: 0;
    padding: 23px 14px 0 0;
  }
`;

const RecentPickWrapper = styled.div`
  margin-bottom: 16px;
  ${homePadding};
`;

const DefaultSearchContainer = styled.section<{ empty?: boolean }>`
  ${({ empty }) => {
    if (empty) {
      return css`
        height: 32vh;
        display: flex;
        justify-content: center;
        align-items: end;
      `;
    }
  }}
`;

const SearchResultContainer = styled.section`
  display: flex;
  flex-direction: column;
  ${homePadding}
`;

export default SpotSearchResultPage;
