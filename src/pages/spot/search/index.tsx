import React, { ReactElement, useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { SearchResult } from '@components/Pages/Search';
import { homePadding } from '@styles/theme';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { theme, FlexBetween, FlexEnd } from '@styles/theme';
import { TextH3B, TextB3R, TextH6B, TextH2B, TextB2R } from '@components/Shared/Text';
import { SpotList, SpotRecommendList, SpotRecentPickupList } from '@components/Pages/Spot';
import { SVGIcon } from '@utils/common';
import { getSpotSearchRecommend, getSpotEvent, getSpotSearch } from '@api/spot';
import { ISpots, ISpotsDetail } from '@model/index';
import { useQuery } from 'react-query';
import { IParamsSpots } from '@model/index';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { destinationForm } from '@store/destination';
import { spotSelector, INIT_SPOT_FILTERED } from '@store/spot';
import { getDestinationsApi } from '@api/destination';
import { IDestinationsResponse } from '@model/index';
import { SpotSearchKeyword } from '@components/Pages/Spot';
// import { getCartsApi } from '@api/cart';
// import { INIT_CART_LISTS, SET_CART_LISTS } from '@store/cart';

const SpotSearchPage = (): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orderId, isDelivery } = router.query;
  const { spotsPosition, spotsSearchResultFiltered } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);
  const [spotRecommend, setSpotRecommend] = useState<ISpots>();
  const [searchResult, setSearchResult] = useState<ISpotsDetail[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [isLoadingRecomand, setIsLoadingRecomand] = useState<boolean>(false);
  const [keyword, setKeyWord] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const userLocationLen = !!userLocation.emdNm?.length;
  // console.log('spotsSearchResultFiltered', spotsSearchResultFiltered);

  // 스팟 검색 - 추천 스팟 api
  const getSearchRecommendList = async () => {
    const params = {
      latitude: spotsPosition ? spotsPosition.latitude : null,
      longitude: spotsPosition ? spotsPosition.longitude : null,
      size: 3,
    };
    try {
      const { data } = await getSpotSearchRecommend(params);
      if (data.code === 200) {
        setIsLoadingRecomand(true);
        const items = data.data;
        setSpotRecommend(items);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectedKeywordVaule = (value: string) => {
    setKeyWord(value);
  };

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

  // 스팟 검색 - 이벤트 스팟 api
  const { data: eventSpotList, isLoading: isLoadingEventSpot } = useQuery(
    ['spotList'],
    async () => {
      const params: IParamsSpots = {
        latitude: spotsPosition ? spotsPosition.latitude : null,
        longitude: spotsPosition ? spotsPosition.longitude : null,
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
        latitude: spotsPosition ? spotsPosition.latitude : null,
        longitude: spotsPosition ? spotsPosition.longitude : null,
      };
      const { data } = await getDestinationsApi(params);
      const totalList = data.data.destinations;
      return totalList;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const changeInputHandler = () => {
    const inputText = inputRef.current?.value.length;
    if (!inputText) {
      setSearchResult([]);
      setIsSearched(false);
    }
  };

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
        dispatch(INIT_SPOT_FILTERED());

      }
    }
  }, []);

  useEffect(()=> {
    if (keyword.length > 0) {
      fetchSpotSearchData({keyword});
      dispatch(INIT_SPOT_FILTERED());
      // setInputFocus(true);  
    }
  }, [keyword])

  // useEffect(()=> {

  // }, [spotsSearchResultFiltered])

  const fetchSpotSearchData = async({keyword} : {keyword: string}) => {
    try {
      const params = {
        keyword,
        latitude: spotsPosition ? spotsPosition.latitude : null,
        longitude: spotsPosition ? spotsPosition.longitude : null,
      };
      const { data } = await getSpotSearch(params);
      if (data.code === 200) {
        const fetchData = data.data;
        //   // const filtered = fetchData?.spots?.filter((c) => {
        //   //   return c.name.replace(/ /g, '').indexOf(value) > -1;
        //   // });
        setSearchResult(fetchData?.spots);
        setIsSearched(true); 
        setInputFocus(true); 
      };
    } catch (err) {
      console.error(err);
    }
  };

  // console.log(searchResult.forEach(i => console.log('i', i.distance)));
  // console.log(searchResult.sort(function (a: any, b: any): any  { return a.distance - b.distance }));
  const filteredItem = () => {
    const sort = spotsSearchResultFiltered?.sort;
    switch (sort) {
      case '':
        return searchResult;
      case 'nearest':
        return (
          searchResult.sort(function (a: any, b: any): any  { return a.distance - b.distance })
        )
      case 'frequency':
        return (
          searchResult.sort(function (a: any, b: any): any  { return  b.score - a.score })
        )
      case 'user':
        return searchResult;
    }
  }

  // console.log('filteredItem', filteredItem());

  const goToOrder = useCallback(() => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <PickupSheet />,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSearchRecommendList();
    dispatch(INIT_SPOT_FILTERED());
  }, []);

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
  }, []);

  if (isLoadingRecomand && isLoadingEventSpot && isLoadingPickup) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <Wrapper>
        <TextInput
          inputType="text"
          placeholder="도로명, 건물명 또는 지번으로 검색"
          svg="searchIcon"
          keyPressHandler={getSearchResult}
          eventHandler={changeInputHandler}
          onFocus={() => {
            setInputFocus(true);
          }}
          ref={inputRef}
          value={keyword}
        />
      </Wrapper>
      {!inputFocus ? (
        <>
          <SpotRecommendWrapper>
            <FlexEnd padding="0 0 16px 0">
              <SVGIcon name="locationBlack" />
              <TextH6B margin="0 0 0 2px" padding="3px 0 0 0">
                현 위치로 설정하기
              </TextH6B>
            </FlexEnd>
            <SpotSearchKeyword onChange={handleSelectedKeywordVaule} />
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
        <>
          {!isSearched ? (
            recentPickedSpotList?.length! > 0 ? (
              <DefaultSearchContainer>
                <RecentPickWrapper>
                  <SpotSearchKeyword onChange={handleSelectedKeywordVaule} />
                  <TextH3B padding="0 0 24px 0">최근 픽업 이력</TextH3B>
                  {recentPickedSpotList?.map((item: any, index) => (
                    // 스팟 최근 픽업 이력 리스트
                    // <SpotRecentPickupList item={item} key={index} hasCart={cartList?.length! > 0} />
                    <SpotRecentPickupList item={item} key={index} hasCart={true} />
                  ))}
                </RecentPickWrapper>
              </DefaultSearchContainer>
            ) : (
              // 픽업 이력 없는 경우, 추천 스팟 노출
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
          ) : (
            // 검색 결과
            <SearchResultContainer>
              {/* <SearchResult
                searchResult={searchResult}
                isSpot
                onClick={goToOrder}
                orderId={orderId}
                hasCart={cartList?.length! > 0}
              /> */}
              <SearchResult searchResult={filteredItem()} isSpot onClick={goToOrder} orderId={orderId} hasCart={true} />
            </SearchResultContainer>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.main``;

const Wrapper = styled.div`
  padding: 8px 24px;
`;

const SpotRecommendWrapper = styled.section`
  margin-top: 24px;
  margin-bottom: 16px;
  ${homePadding};
`;

const RecentPickWrapper = styled.div`
  margin-top: 24px;
  margin-bottom: 16px;
  ${homePadding};
`;

const Slider= styled(Swiper)`
  width: auto;
  padding-right: 24px;
  margin-bottom: 24px;
  .swiper-slide {
    width: auto;
  }
`;

const KeyWorkdWrapper = styled.section`
  display: flex;
`;

const KeyWord = styled.div`
  background: ${theme.greyScale3};
  border-radius: 100px;
  padding: 8px 16px;
  overflow: auto; 
  white-space: nowrap;
  cursor: pointer;
`;

const DefaultSearchContainer = styled.section``;

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

const RecentSearchContainer = styled.div``;

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
