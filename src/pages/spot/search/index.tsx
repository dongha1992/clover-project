import React, { ReactElement, useEffect, useState, useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { SearchResult } from '@components/Pages/Search';
import { homePadding } from '@styles/theme';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { theme, FlexBetween, FlexEnd } from '@styles/theme';
import { TextH3B, TextB3R, TextH6B, TextH2B, TextB2R } from '@components/Shared/Text';
import { SpotList, SpotRecommendList, SpotRecentPickupList } from '@components/Pages/Spot';
import { SVGIcon } from '@utils/common';
import { getSpotSearchRecommend, getSpotEvent, getSpotSearch, getSpotsFilter } from '@api/spot';
import { ISpots, ISpotsDetail } from '@model/index';
import { useQuery } from 'react-query';
import { IParamsSpots } from '@model/index';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { destinationForm } from '@store/destination';
import { 
  spotSelector, 
  INIT_SEARCH_SELECTED_FILTERS, 
  INIT_SPOT_SEARCH_SORT,
  SET_SPOT_SEARCH_SORT,
  INIT_SPOT_POSITIONS,
  SET_SPOT_POSITIONS,
} from '@store/spot';
import { getDestinationsApi } from '@api/destination';
import { IDestinationsResponse } from '@model/index';
import { SpotSearchKeyword } from '@components/Pages/Spot';
import { MenuFilter } from '@components/Filter';
import { SpotSearchFilter } from '@components/Pages/Spot';
// import { getCartsApi } from '@api/cart';
// import { INIT_CART_LISTS, SET_CART_LISTS } from '@store/cart';

const SpotSearchPage = (): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orderId, isDelivery } = router.query;
  const { 
    spotsPosition, 
    spotSearchSelectedFilters, 
    spotSearchSort 
  } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);
  const [searchResult, setSearchResult] = useState<ISpotsDetail[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [keyword, setKeyWord] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const userLocationLen = !!userLocation.emdNm?.length;

  useEffect(()=> {
    defaultRedioId();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=> {
    if (keyword.length > 0) {
        fetchSpotSearchData({keyword});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotsPosition.latitude, spotsPosition.longitude]);

  useEffect(()=> {
    if (keyword.length > 0) {
      fetchSpotSearchData({keyword});
      dispatch(INIT_SEARCH_SELECTED_FILTERS());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  useEffect(()=> {
    filteredItem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResult, spotSearchSort]);

  useEffect(() => {
    defaultRedioId();
    dispatch(INIT_SEARCH_SELECTED_FILTERS());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearched]);

  useEffect(() => {
    if (orderId) {
      setInputFocus(true);
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
  const lonLen = spotsPosition?.longitude !== null;

  // 스팟 검색 - 추천 스팟 api
  const { data: spotRecommend, isLoading: isLoadingRecomand } = useQuery(
    ['spotRecommendList'],
    async () => {
      const params: IParamsSpots = {
        latitude: latLen ? Number(spotsPosition?.latitude) : null,
        longitude: lonLen ? Number(spotsPosition?.longitude) : null,
        size: 3,
      };
      const response = await getSpotSearchRecommend(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );
  
  // 스팟 검색 - 이벤트 스팟 api
  const { data: eventSpotList, isLoading: isLoadingEventSpot } = useQuery(
    ['spotEvetnList'],
    async () => {
      const params: IParamsSpots = {
        latitude: latLen ? Number(spotsPosition?.latitude) : null,
        longitude: lonLen ? Number(spotsPosition.longitude) : null,
        size: 6,
      };
      const response = await getSpotEvent(params);
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
        latitude: latLen ? Number(spotsPosition.latitude) : null,
        longitude: lonLen ? Number(spotsPosition.longitude) : null,
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
          return;
        }
        fetchSpotSearchData({keyword});
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSpotSearchData = async({keyword} : {keyword: string}) => {
    try {
      const params = {
        keyword: keyword,
        latitude: latLen ? Number(spotsPosition.latitude) : null,
        longitude: lonLen ? Number(spotsPosition.longitude) : null,
      };
      const { data } = await getSpotSearch(params);
      if (data.code === 200) {
        const fetchData = data.data;
        setSearchResult(fetchData?.spots);
        setIsSearched(true); 
        setInputFocus(true); 
        setIsLoading(true);
      };
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectedKeywordVaule = (value: string) => {
    setKeyWord(value);
  };

  const changeInputHandler = (e: any) => {
    const inputText = inputRef.current?.value.length;
    if (!inputText) {
      setSearchResult([]);
      setIsSearched(false);
    };
  };


  const defaultRedioId = () => {
    if (userLocationLen) {
      return dispatch(SET_SPOT_SEARCH_SORT('nearest'))
    } else if (!userLocationLen) {
      return dispatch(SET_SPOT_SEARCH_SORT('frequency'))
    } 
  };

  const filteredItem = () => {
    const sort = spotSearchSort;
    switch (sort) {
      case undefined:
        return searchResult;
      case 'nearest':
        return (
          searchResult.sort((a: ISpotsDetail, b: ISpotsDetail): number => { return  a.distance - b.distance })
          );
      case 'frequency':
        return searchResult.sort((a: ISpotsDetail, b: ISpotsDetail): number => { return  b.score - a.score });
      case 'user':
        return searchResult.sort((a: ISpotsDetail, b: ISpotsDetail): number => { return  b.userCount - a.userCount });
    }
  };

  // 스팟 필터
  let filterResult = filteredItem();
  filterResult = filterResult?.filter(spot => spotSearchSelectedFilters.every(filterItem => spot[filterItem]))

  // GPS - 현재위치 가져오기
  const getCurrentPosition = () => new Promise((resolve, error) => navigator.geolocation.getCurrentPosition(resolve, error));

  const getLocation = async () => {
      try {
        const position: any = await getCurrentPosition();
        if(position) {
          // console.log('위치 들어옴', position.coords.latitude + ' ' + position.coords.longitude);
          dispatch(
            SET_SPOT_POSITIONS({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          );  
        }
       return { Status: true, position, };
     } catch (error) {
       console.log("getCurrentLatLong::catcherror =>", error);
       return { Status: false, };
     }
  };
  

  const clearInputHandler = () => {
    initInputHandler();
    setIsSearched(false);
  };

  const initInputHandler = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    };
  };

  const goToOrder = useCallback(() => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <PickupSheet />,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoadingRecomand && isLoadingEventSpot && isLoadingPickup) {
    return <div>로딩</div>;
  };

  return (
    <Container>
      <SearchBarWrapper>
        <TextInput
          name="input"
          inputType="text"
          placeholder="도로명, 건물명 또는 지번으로 검색"
          svg="searchIcon"
          fontSize='14px'
          keyPressHandler={getSearchResult}
          eventHandler={changeInputHandler}
          onFocus={() => {
            setInputFocus(true);
          }}
          value={keyword}
          ref={inputRef}
        />
        {
          inputRef.current && inputRef.current?.value.length > 0 && (
            <div className="removeSvg" onClick={clearInputHandler}>
              <SVGIcon name="removeItem" />
            </div>
          )
        }
      </SearchBarWrapper>
      {
        !inputFocus && (
          <FlexEnd padding="16px 24px 0 0">
            <SVGIcon name="locationBlack" />
            <TextH6B margin="0 0 0 2px" padding="3px 0 0 0">
              현 위치로 설정하기
            </TextH6B>
          </FlexEnd>
        )
      }
      {
        (!inputFocus || !isSearched) && (
          <KeyWordWrapper>
            <SpotSearchKeyword onChange={handleSelectedKeywordVaule} />
          </KeyWordWrapper>
        )
      }

      {!inputFocus ? (
        // 스팟 검색 메인 - 검색바 포커싱 x
        <>
        {
          (spotRecommend?.spots.length! > 0 || eventSpotList?.spots.length! < 0) ? (
            // 스팟 검색 메인 - 추천, 이벤트 스팟이 있는 경우 노출
            <>
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
            <BottomContentWrapper>
              <Row />
              <TextH2B padding="24px 24px 24px 24px">{eventSpotList?.title}</TextH2B>
              <EventSlider className="swiper-container" slidesPerView={'auto'} spaceBetween={20} speed={500}>
                {eventSpotList?.spots.map((list, idx) => {
                  return (
                    <SwiperSlide className="swiper-slide" key={idx}>
                      <SpotList list={list} type="event" isSearch />
                    </SwiperSlide>
                  );
                })}
              </EventSlider>
            </BottomContentWrapper>
          </>
          ) : (
            // 스팟 검색 메인 - 추천, 이벤트 스팟 둘다 없는 경우, 최근 픽업 이력 노출
            <>
            {
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
                // 최근 픽업 이력이 없는 경우, 안내 문구 노출
                <DefaultSearchContainer empty>
                  <TextB2R color={theme.greyScale65} center>{'500m 내 프코스팟이 없어요.\n찾으시는 프코스팟을 검색해 보세요. 😭 '}</TextB2R>
                </DefaultSearchContainer>
              )
            }
            </>
          )
        }
        {

        }
        </>
      ) : (
        // 스팟 검색 메인 - 검색바 포커싱 o 
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
                spotRecommend?.spots.length! > 0 && (
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
                )  
              }
              {
                // 픽업 이력 없고, 추천 스팟도 없는 경우
                spotRecommend?.spots.length! < 0 && null
              }
              </>
              )
            )
          }
          {
            isSearched && (
            // 검색 결과
            <SearchResultContainer>
              <SearchResult searchResult={filterResult} isSpot orderId={orderId} hasCart={true} getLocation={getLocation} />
            </SearchResultContainer>
            )
          }
        </>
      )}
    </Container>
  );
};

const Container = styled.main``;

const SearchBarWrapper = styled.div`
  margin: 8px 24px 0 24px;
  position: relative;
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

const DefaultSearchContainer = styled.section<{empty?: boolean}>`
  ${({empty}) => {
    if(empty){
      return css`
        height: 32vh;
        display: flex;
        justify-content: center;
        align-items: end;
      `
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

export default SpotSearchPage;
