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
} from '@store/spot';
import { getDestinationsApi } from '@api/destination';
import { IDestinationsResponse } from '@model/index';
import { SpotSearchKeyword } from '@components/Pages/Spot';
// import { getCartsApi } from '@api/cart';
// import { INIT_CART_LISTS, SET_CART_LISTS } from '@store/cart';

const SpotSearchMainPage = (): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
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
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState<boolean>(true);
  const [currentValueLen, setCurrentValurLen] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const userLocationLen = !!userLocation.emdNm?.length;

  useEffect(() => {
    defaultRedioId();
    inputRef.current?.focus();
    setKeyword(spotKeyword);
    dispatch(SET_SPOT_MAP_SWITCH(false));
  }, []);

  useEffect(() => {
    if (spotKeyword?.length > 0) {
      getSpotList({ keyword: spotKeyword });
    }
  }, [spotsPosition.latitude, spotsPosition.longitude]);

  useEffect(() => {
    if (spotKeyword?.length > 0) {
      getSpotList({ keyword: spotKeyword });
      dispatch(INIT_SEARCH_SELECTED_FILTERS());
    }
  }, [spotKeyword]);

  useEffect(() => {
    filteredItem();
  }, [searchResult, spotSearchSort]);

  useEffect(() => {
    defaultRedioId();
    dispatch(INIT_SEARCH_SELECTED_FILTERS());
  }, [isSearched]);

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

  // 장바구니 조회
  /* TODO: 장바구니 params 변경돼서 주석 */

  // let {
  //   data: cartList,
  //   isLoading: isLoadingCart,
  //   isError,
  // } = useQuery(
  //   'getCartList',
  //   async () => {
  //     const { data } = await getCartsApi();
  //     return data.data;
  //   },
  //   {
  //     refetchOnMount: true,
  //     refetchOnWindowFocus: false,
  //     cacheTime: 0,
  //     onSuccess: (data) => {
  //       try {
  //         dispatch(INIT_CART_LISTS());
  //         dispatch(SET_CART_LISTS(data));
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     },
  //   }
  // );

  // cartList = ['!1'];

  const latLen = spotsPosition?.latitude !== null;
  const latitude = latLen ? Number(spotsPosition?.latitude) : 37.50101118367814;
  const lonLen = spotsPosition?.longitude !== null;
  const longitude = lonLen ? Number(spotsPosition?.longitude) : 127.03525895821902;

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
      return response.data.data;
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
    if (value.length > 0) {
      setCurrentValurLen(true);
    }

    if (e.key === 'Enter') {
      if (inputRef.current) {
        // setKeyWord(inputRef.current?.value);
        let keyword = inputRef.current?.value;
        if (!keyword) {
          setSearchResult([]);
          return;
        }
        getSpotList({ keyword });
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
        const fetchData = data.data;
        setSearchResult(fetchData?.spots);
        setIsSearched(true); 
        setInputFocus(true);
      };
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectedKeywordVaule = (value: string) => {
    setKeyword(value);
    dispatch(SET_SEARCH_KEYWORD(value));
  };

  const changeInputHandler = (e: any) => {
    setKeyword(e.target.value);
    const inputText = inputRef.current?.value.length;
    if (!inputText) {
      setSearchResult([]);
      setIsSearched(false);
    }
  };

  const defaultRedioId = () => {
    if (userLocationLen) {
      return dispatch(SET_SPOT_SEARCH_SORT('nearest'));
    } else if (!userLocationLen) {
      return dispatch(SET_SPOT_SEARCH_SORT('frequency'));
    }
  };

  const filteredItem = () => {
    const list = searchResult ?? [];
    const sort = spotSearchSort;
    switch (sort) {
      case undefined:
        return list;
      case 'nearest':
        return searchResult.sort((a: ISpotsDetail, b: ISpotsDetail): number => {
          return a.distance - b.distance;
        });
      case 'frequency':
        return searchResult.sort((a: ISpotsDetail, b: ISpotsDetail): number => {
          return b.score - a.score;
        });
      case 'user':
        return searchResult.sort((a: ISpotsDetail, b: ISpotsDetail): number => {
          return b.userCount - a.userCount;
        });
    }
  };

  // 스팟 필터
  let filterResult = filteredItem();
  filterResult = filterResult?.filter(spot => spotSearchSelectedFilters.every(filterItem => spot[filterItem]));

  useEffect(() => {
    dispatch(SET_SERACH_MAP_SPOT(filterResult!));
  }, [searchResult]);

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
      console.log('getCurrentLatLong::catcherror =>', error);
      return { Status: false };
    }
  };

  const clearInputHandler = () => {
    if (inputRef.current?.value.length! > 0) {
      initInputHandler();
      setIsSearched(false);
      setCurrentValurLen(false);
      setKeyword('')
    };
  };

  const initInputHandler = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  if (isLoadingRecomand && isLoadingPickup) {
    return <div>로딩</div>;
  };

  return (
    <Container>
      {
        isMapSwitch ? 
        (
          <SpotSearchMapPage isSearched={isSearched} searchListLen={filterResult?.length} />
        ) : (
          <>
            <SearchBarWrapper>
              <label className='textLabel'>
                {
                  !inputRef.current?.value &&
                    <span className='textPlaceholde'>도로명, 건물명 또는 지번으로 검색</span>
                }
                <TextInput
                  name="input"
                  inputType="text"
                  svg="searchIcon"
                  fontSize='14px'
                  keyPressHandler={getSearchResult}
                  eventHandler={changeInputHandler}
                  onFocus={() => {
                    setInputFocus(true);
                  }}
                  value={keyword}
                  ref={inputRef}
                  withValue
                />
              </label>
              {
                inputRef.current?.value.length! > 0 && (
                  <div className="removeSvg" onClick={clearInputHandler}>
                    <SVGIcon name="removeItem" />
                  </div>
                )
              }
            </SearchBarWrapper>
            {
              (!inputFocus || !isSearched) && (
                <KeyWordWrapper>
                  <SpotSearchKeyword onChange={handleSelectedKeywordVaule} />
                </KeyWordWrapper>
              )
            }
            {/* 스팟 검색 메인 - 검색바 포커싱 o  */}
            <>
              {!isSearched && (
                recentPickedSpotList?.length! > 0 ? (
                  // 최근 픽업 이력이 있는 경우, 픽업 이력 노출
                  <DefaultSearchContainer>
                    <RecentPickWrapper>
                      <TextH3B padding="0 0 24px 0">최근 픽업 이력</TextH3B>
                      {recentPickedSpotList?.map((item: any, index) => (
                        // 스팟 최근 픽업 이력 리스트
                        <SpotRecentPickupList item={item} key={index} hasCart={true} />
                      ))}
                    </RecentPickWrapper>
                  </DefaultSearchContainer>
                  ) : (
                  <>
                  {
                    // 픽업 이력 없는 경우, 추천 스팟 노출
                    spotRecommend?.spots.length! > 0 ?(
                      <SpotRecommendWrapper>
                      <FlexBetween margin="0 0 24px 0">
                        <TextH2B>{spotRecommend?.title}</TextH2B>
                        {
                          // 사용자 위치 설정 했을 경우 노출
                          userLocationLen && <TextB3R color={theme.greyScale65}>500m이내 프코스팟</TextB3R>
                        }
                      </FlexBetween>
                      {spotRecommend?.spots.map((item: any, index: number) => {
                        return <SpotRecommendList item={item} key={index} />;
                      })}
                    </SpotRecommendWrapper>
                    ) : (
                      // 픽업 이력 없고, 추천 스팟도 없는 경우
                      null
                    )
                  }
                  </>
                  )
                )
              }
              {
                isSearched && (
                // 검색 결과
                <SearchResultContainer>
                  <SpotSearchResult searchResult={filterResult} orderId={orderId} hasCart={true} getLocation={getLocation} />
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
