/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement, useEffect, useState, useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { SpotSearchResult } from '@components/Pages/Search';
import { homePadding } from '@styles/theme';
import { theme, FlexBetween, textBody2 } from '@styles/theme';
import { TextH3B, TextB3R, TextH6B, TextH2B, TextB2R } from '@components/Shared/Text';
import { SpotList, SpotRecommendList, SpotRecentPickupList, SpotSearchMapPage } from '@components/Pages/Spot';
import { SVGIcon } from '@utils/common';
import { getSpotSearchRecommend, getSpotSearch } from '@api/spot';
import { ISpotsDetail } from '@model/index';
import { useQuery } from 'react-query';
import { IParamsSpots } from '@model/index';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Swiper } from 'swiper/react';
import 'swiper/css';
import { destinationForm } from '@store/destination';
import {
  spotSelector,
  INIT_SEARCH_SELECTED_FILTERS,
  SET_SPOT_SEARCH_SORT,
  SET_SPOT_POSITIONS,
  SET_SEARCH_KEYWORD,
  SET_SERACH_MAP_SPOT,
  SET_SPOT_MAP_SWITCH,
  SET_SPOT_SEARCH_ALL_LIST_CHECKED,
} from '@store/spot';
import { getDestinationsApi } from '@api/destination';
import { IDestinationsResponse } from '@model/index';
import { SpotSearchKeywordSlider } from '@components/Pages/Spot';
import { getFilteredSpotList } from '@utils/spot';
// import { getCartsApi } from '@api/cart';
// import { INIT_CART_LISTS, SET_CART_LISTS } from '@store/cart';

const SpotSearchMainPage = (): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { orderId, isDelivery } = router.query;
  const { 
    spotsPosition, 
    spotSearchSelectedFilters, 
    spotSearchSort,
    spotKeyword,
    isMapSwitch,
  } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);

  const [searchResult, setSearchResult] = useState<ISpotsDetail[]>([]);
  const [defaultSpotList, setDefaultSpotList] = useState<ISpotsDetail[]>([]);
  const [paginatedSpotList, setPaginatedSpotList] = useState<ISpotsDetail[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>(0);
  const [size, setSize] = useState<number>(10);

  const userLocationLen = userLocation.emdNm?.length! > 0;
  const latLen = spotsPosition?.latitude !== null;
  const latitude = latLen ? Number(spotsPosition?.latitude) : null;
  const lonLen = spotsPosition?.longitude !== null;
  const longitude = lonLen ? Number(spotsPosition?.longitude) : null;

  useEffect(() => {
    inputRef.current?.focus();
    defaultRedioId();
    setKeyword(spotKeyword);
    dispatch(SET_SPOT_MAP_SWITCH(false));
  }, []);

  useEffect(() => {
    if (spotKeyword?.length > 0) {
      getSpotList({ keyword: spotKeyword });
      getPaginatedSpotList(searchResult); 
      setIsSearched(true); 
      // setInputFocus(true);
    }
  }, [spotsPosition.latitude, spotsPosition.longitude]);

  useEffect(() => {
    if (spotKeyword?.length > 0) {
      getSpotList({ keyword: spotKeyword });
      getPaginatedSpotList(searchResult); 
      dispatch(INIT_SEARCH_SELECTED_FILTERS());
      setIsSearched(true); 
      // setInputFocus(true);
    }
  }, [spotKeyword]);

  useEffect(() => { // 정렬및 필터 반영
    const hasSearchResult = searchResult.length > 0;
    if ((spotSearchSort ||spotSearchSelectedFilters) && hasSearchResult) {
      spotFiltered(defaultSpotList);
    };
  }, [spotSearchSelectedFilters, spotSearchSort]);

  useEffect(() => { // 정렬필터값 초기화
    defaultRedioId();
    dispatch(INIT_SEARCH_SELECTED_FILTERS()); 
  }, [isSearched]);

  useEffect(() => { // 리스트 결과에 따라 지도에 반영
    getPaginatedSpotList(searchResult); 
    dispatch(SET_SERACH_MAP_SPOT(searchResult!)); 
  }, [searchResult]);

  useEffect(()=> { // 인피니티 스크롤 반영
    getPaginatedSpotList(searchResult); 
  }, [size]);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if ((Math.round(scrollTop + clientHeight) >= scrollHeight)) {
        setSize((prevPage) => prevPage + 10);
      };
    };
    // scroll event listener 등록
    window.addEventListener('scroll', handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      console.error('getCurrentLatLong::catcherror =>', error);
      return { Status: false };
    }
  };

  // 스팟 검색 - 추천 스팟 api
  const { data: spotRecommend, isLoading: isLoadingRecomand } = useQuery(
    ['spotRecommendList'],
    async () => {
      const params: IParamsSpots = {
        latitude: latitude,
        longitude: longitude,
        size: 3,
      };
      const response = await getSpotSearchRecommend(params);
      const listSort = response.data.data.spots.sort((a, b) => a.distance - b.distance);
      return {
        data: response.data.data,
        spotList: listSort,
      }
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

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
      const totalList = data.data.destinations;
      return totalList;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  // 스팟 검색 결과 api
  const getSearchResult = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;

    if (e.key === 'Enter') {
      if (inputRef.current) {
        // setKeyWord(inputRef.current?.value);
        let keyword = inputRef.current?.value;
        if (!keyword) {
          setSearchResult([]);
          inputRef.current.blur();
        };
        getSpotList({ keyword });
        setIsSearched(true); 
        // setInputFocus(true);
      }
    }
  }, []);

  const getSpotList = async ({ keyword }: { keyword: string }) => {
    try {
      const params = {
        keyword: keyword,
        latitude: latitude,
        longitude: longitude,
      };
      const { data } = await getSpotSearch(params);
      if (data.code === 200) {
        const spotList = data.data.spots;
        setSize(10);
        if( inputRef.current?.value.length! > 0 ) {
          spotFiltered(spotList);
          setDefaultSpotList(spotList);
          dispatch(SET_SPOT_SEARCH_ALL_LIST_CHECKED(false));
        } else {
          dispatch(SET_SERACH_MAP_SPOT(spotList));
          dispatch(SET_SPOT_SEARCH_ALL_LIST_CHECKED(true));
        }
      };
    } catch (err) {
      console.error(err);
    }
  };

  const spotFiltered = (spotList: ISpotsDetail[]) => { // 스팟 검색 결과 정렬및필터
    const isFiltered = spotSearchSelectedFilters || spotSearchSort;
    const spotSearchResult = isFiltered ? getFilteredSpotList({spotList: spotList, sort: spotSearchSort, filter: spotSearchSelectedFilters}) : spotList;
    setTotalCount(spotSearchResult?.length);
    setSearchResult(spotSearchResult);
  };

  const getPaginatedSpotList = (searchResults: ISpotsDetail[]) => {
    const list = searchResults.slice(0, size);
    setPaginatedSpotList(list);
  };

  const handleSelectedKeywordVaule = (value: string) => {
    setKeyword(value);
    dispatch(SET_SEARCH_KEYWORD(value));
  };

  const changeInputHandler = (e: any) => {
    const value = e.target.value;
    setKeyword(value);
    const inputText = inputRef.current?.value?.length! > 0;
    if (!inputText) {
      // setSearchResult([]);
      setIsSearched(false);
      setKeyword('');
      dispatch(SET_SEARCH_KEYWORD(''));
    }
  };

  const clearInputHandler = () => {
    if (inputRef.current?.value.length! > 0) {
      initInputHandler();
      setIsSearched(false);
      setKeyword('');
      dispatch(SET_SEARCH_KEYWORD(''));
      // dispatch(SET_SPOT_SEARCH_ALL_LIST_CHECKED(true));
    };
  };

  const initInputHandler = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const defaultRedioId = () => { // 검색 결과 정렬 초기화
    if (userLocationLen) {
      return dispatch(SET_SPOT_SEARCH_SORT('nearest'));
    } else if (!userLocationLen) {
      return dispatch(SET_SPOT_SEARCH_SORT('frequency'));
    }
  };

  const goToSwitchMap = () => { // 검색 결과 없는 경우, 내 주변 프코스팟 찾기 버튼 
    setKeyword('');
    getSpotList({keyword: ''});
    dispatch(SET_SPOT_MAP_SWITCH(true));
    dispatch(SET_SPOT_SEARCH_ALL_LIST_CHECKED(true));
  };

  if (isLoadingRecomand && isLoadingPickup) {
    return <div>로딩</div>;
  };

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
      {
        isMapSwitch ? 
        (
          <SpotSearchMapPage isSearched={isSearched} searchListLen={searchResult?.length} />
        ) : (
          <>
            <SearchBarWrapper>
              <label className='textLabel'>
                {
                  keyword.length < 0 &&
                    <span className='textPlaceholde'>도로명, 건물명 또는 지번으로 검색</span>
                }
                <TextInput
                  name="input"
                  inputType="text"
                  svg="searchIcon"
                  fontSize='14px'
                  keyPressHandler={getSearchResult}
                  eventHandler={changeInputHandler}
                  value={keyword}
                  ref={inputRef}
                  withValue
                />
              </label>
              {
                keyword.length > 0 && (
                  <div className="removeSvg" onClick={clearInputHandler}>
                    <SVGIcon name="removeItem" />
                  </div>
                )
              }
            </SearchBarWrapper>
            {
             !isSearched && (
                <SpotSearchKeywordSlider onChange={handleSelectedKeywordVaule} />
              )
            }
            <>
              {!isSearched && (  // 검색바 활성화 
                userLocationLen ? // 위치 정보 있는 경우
                    spotRecommend?.spotList.length! > 0 ? ( // 추천 스팟 있는 경우
                      <SpotRecommendWrapper>
                        <FlexBetween margin="0 0 24px 0">
                          <TextH2B>{spotRecommend?.data.title}</TextH2B>
                          {
                            // 사용자 위치 설정 했을 경우 노출
                            userLocationLen && <TextB3R color={theme.greyScale65}>3km 이내 프코스팟</TextB3R>
                          }
                        </FlexBetween>
                        {spotRecommend?.spotList?.map((item, index) => {
                          return <SpotRecommendList item={item} key={index} />;
                        })}
                      </SpotRecommendWrapper>
                    ) : (
                      recentPickedSpotList?.length! > 0 ? ( // 추천 스팟 없고, 픽업 이력 있는 경우
                        <DefaultSearchContainer>
                        <RecentPickWrapper>
                          <TextH3B padding="0 0 24px 0">최근 픽업 이력</TextH3B>
                          {recentPickedSpotList?.map((item, index) => (
                            // 스팟 최근 픽업 이력 리스트
                            <SpotRecentPickupList item={item} key={index} hasCart={true} />
                          ))}
                        </RecentPickWrapper>
                      </DefaultSearchContainer>
  
                      ) : (
                        null // 추천 스팟 없고, 픽업 이력 없는 경우 빈화면 노출
                      )
                    )
                 : // 위치 정보 없는 경우
                  recentPickedSpotList?.length! > 0 ? ( // 최근 픽업 이력이 있는 경우, 픽업 이력 노출
                    <DefaultSearchContainer>
                      <RecentPickWrapper>
                        <TextH3B padding="0 0 24px 0">최근 픽업 이력</TextH3B>
                        {recentPickedSpotList?.map((item, index) => (
                          // 스팟 최근 픽업 이력 리스트
                          <SpotRecentPickupList item={item} key={index} hasCart={true} />
                        ))}
                      </RecentPickWrapper>
                    </DefaultSearchContainer>
                    ) : (
                      null // 픽업 이력 없는 경우 빈화면 노출
                    )
              )}
              {
                isSearched && ( // 검색 결과
                <SearchResultContainer>
                  <SpotSearchResult searchResult={paginatedSpotList} orderId={orderId} hasCart={true} getLocation={getLocation} goToSwitchMap={goToSwitchMap} totalCount={totalCount} />
                </SearchResultContainer>
                )
              }
            </>
          </>
        )
      }
    </Container>
  );
};

const Container = styled.main``;

const SearchBarWrapper = styled.div`
  margin: 8px 24px 0 24px;
  position: relative;
  .textLabel {
    width: 100%;
    .textPlaceholde{
      position: absolute;
      top: 13px;
      left: 50px;
      z-index: 100;
      color: ${theme.greyScale45};
      ${textBody2};    
    }
  }
  .removeSvg {
    position: absolute;
    right: 0;
    top: 0;
    margin: 15px 14px 0 0;
  }
`;


const KeyWordWrapper = styled.div`
  padding: 16px 24px 24px 24px;
`;

const SpotRecommendWrapper = styled.section`
  margin-bottom: 16px;
  ${homePadding};
`;

const RecentPickWrapper = styled.div`
  margin-top: 24px;
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

const EventSlider = styled(Swiper)`
  padding: 0 24px;
  .swiper-slide {
    width: 299px;
  }
`;

const Row = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.greyScale3};
`;

const BottomContentWrapper = styled.section`
  width: 100%;
  position: relative;
  bottom: 0px;
  right: 0px;
  background-color: ${theme.white};
`;

export default SpotSearchMainPage;
