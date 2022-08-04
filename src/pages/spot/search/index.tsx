import React, { ReactElement, useEffect, useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { homePadding } from '@styles/theme';
import { theme, FlexBetween, FlexEnd, textBody2 } from '@styles/theme';
import { TextH3B, TextB3R, TextH6B, TextH2B, TextB2R } from '@components/Shared/Text';
import { 
  SpotList, 
  SpotRecentPickupList, 
  SpotSearchMapPage,
  SpotsSearchResultList
} from '@components/Pages/Spot';
import { SVGIcon } from '@utils/common';
import { 
  getSpotSearchRecommend, 
  getSpotEvent, 
  getSpotsAllListApi, 
} from '@api/spot';
import { useQuery } from 'react-query';
import { IParamsSpots } from '@model/index';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { destinationForm } from '@store/destination';
import { 
  spotSelector,
  SET_SPOT_MAP_SWITCH,
  SET_SPOT_POSITIONS,
} from '@store/spot';
import { SET_LOCATION } from '@store/destination';
import { getDestinationsApi } from '@api/destination';
import { IDestinationsResponse, IGetDestinationsResponse } from '@model/index';
import { SpotSearchKeywordSlider } from '@components/Pages/Spot';
import { ISpotsDetail } from '@model/index';
import { SET_ALERT } from '@store/alert';
import { truncate } from 'lodash-es';
import TextInput from '@components/Shared/TextInput';
import useCurrentLocation from '@hooks/useCurrentLocation';
// import { getCartsApi } from '@api/cart';
// import { INIT_CART_LISTS, SET_CART_LISTS } from '@store/cart';

declare global {
  interface Window {
    getCurrentPositionAddress: any;
  }
};

const SpotSearchPage = (): ReactElement => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { 
    spotsPosition, 
    isMapSwitch,
  } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);
  const { location: currentLocation, error: currentError, currentArrowed, handlerCurrentPosition } = useCurrentLocation();

  const [spotListAllCheck, setSpotListAllCheck] = useState<boolean>(false);
  const [isSeachingPosition, setIsSearchingPosition] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [isFocusing, setIsFocusing] = useState<boolean>(false);
  const [pickUpList, setPickUpList] = useState<any>([]);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [currentPosition, setCurrentPosition] = useState<any>();

  const userLocationLen = userLocation.emdNm?.length! > 0;

  const latLen = spotsPosition?.latitude !== null;
  const latitude = latLen ? Number(spotsPosition?.latitude) : null;
  const lonLen = spotsPosition?.longitude !== null;
  const longitude = lonLen ? Number(spotsPosition?.longitude) : null;

  useEffect(()=> {
    onLoadKakaoMap();
    dispatch(SET_SPOT_MAP_SWITCH(false));
    // getSpotAllList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (Math.round(scrollTop + clientHeight) >= scrollHeight) {
        // 페이지 끝에 도달하면 page 파라미터 값에 +1 주고, 데이터 받아온다.
        setPage((prev) => prev + 1);
      }
    };
    // scroll event listener 등록
    window.addEventListener('scroll', handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickUpList.length > 0]);

  useEffect(()=>{
    if(currentLocation){
      dispatch(
        SET_SPOT_POSITIONS({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        })
      );
      window.getCurrentPositionAddress(currentLocation.latitude, currentLocation.longitude);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  useEffect(()=> {
    if(currentArrowed){
      setIsSearchingPosition(false);
    };
  }, [currentArrowed]);

  // 현 위치로 설정하기 - 카카오지도api 사용하여 좌표값으로 주소 호출
  const onLoadKakaoMap = () => { 
    try {
      window.kakao.maps.load(() => {
        const getCurrentPositionAddress = (lat: number,lng: number) => {
          let geocoder = new window.kakao.maps.services.Geocoder();
          let coord = new window.kakao.maps.LatLng(lat, lng);
          let callback = function(result: any, status: any) {
              if (status === window.kakao.maps.services.Status.OK) {
                const address = result[0];
                setIsSearchingPosition(false);
                setCurrentPositionAddress(address);
              };
          };
          geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
        };
        window.getCurrentPositionAddress = getCurrentPositionAddress;
      });
    } catch (e) {
      dispatch(
        SET_ALERT({
          alertMessage: '알 수 없는 에러가 발생했습니다.',
          submitBtnText: '확인',
        })
      );  
      console.error(e);
    }
  };

  // 현 위치로 설정하기 - 폼에 맞게 주소값 세팅 
  // 현위치에 맞게 추천스팟, 이벤트 스팟 세팅 & 각 스팟 distance 생성
  const setCurrentPositionAddress = (address: any) => {
    const noneRoadAddress = address.road_address === null;
    const jibunJuso = address.address.address_name;
    const jibunZipNo = `${address.address.main_address_no}-${address.address.sub_address_no}`;

    const setRoadAddressPart1 = noneRoadAddress ? jibunJuso : address.road_address.address_name;
    const setRoadAddress = noneRoadAddress ? jibunJuso : `${address.road_address.address_name}(${address.address.region_3depth_name})`;
    const setJibunAddr = noneRoadAddress ? jibunJuso : `${address.address.address_name} ${address.road_address.building_name}`;
    const setZipNo = noneRoadAddress ? jibunZipNo : address.road_address.zone_no;
    const setBdNm = noneRoadAddress? null : address.road_address.building_name;

    dispatch(SET_LOCATION({
      roadAddr: setRoadAddress,
      roadAddrPart1: setRoadAddressPart1,
      roadAddrPart2: null,
      jibunAddr: setJibunAddr,
      engAddr: null,
      zipNo: setZipNo,
      admCd: null,
      rnMgtSn: null,
      bdMgtSn: null,
      detBdNmList: null,
      bdNm: setBdNm,
      bdKdcd: null,
      siNm: null,
      sggNm: null,
      emdNm: address.address.region_3depth_name,
      liNm: null,
      rn: null,
      udrtYn: null,
      buldMnnm: null,
      buldSlno: null,
      mtYn: null,
      lnbrMnnm: null,
      lnbrSlno: null,
      emdNo: null,
    }));
  };

  // 현 위치로 설정하기 - 위도,경도 좌표값 저장
  const getGeoLocation = () => { 
    setIsSearchingPosition(true);
    handlerCurrentPosition();
  };

  // 스팟 검색 - 추천 스팟 api
  const { data: spotRecommendList, isLoading: isLoadingRecomand } = useQuery(
    ['spotRecommendList', spotsPosition],
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
        spotList: listSort
      }
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );
  
  // 스팟 검색 - 이벤트 스팟 api
  const { data: eventSpotList, isLoading: isLoadingEventSpot } = useQuery(
    ['spotList', 'EVENT', spotsPosition],
    async () => {
      const params: IParamsSpots = {
        latitude: latitude,
        longitude: longitude,
        size: 6,
      };
      const response = await getSpotEvent(params);
      return response.data.data;
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  // 최근 픽업 이력 조회 api
  const { data: recentPickedSpotList, isLoading: isLoadingPickup } = useQuery<IGetDestinationsResponse>(
    ['getDestinationList', page, spotsPosition],
    async () => {
      const params = {
        page: page,
        size: 10,
        delivery: 'SPOT',
        latitude: latitude,
        longitude: longitude,
      };
      const response  = await getDestinationsApi(params);
      return response.data;
    },
    { 
      onSuccess: async(data) => {
        const list = data.data.destinations;
        const lastPage = data.data.pagination.totalPage;
        setPickUpList((prevList: any) => [...prevList, ...list]);
        setIsLastPage(page === lastPage);
      },
      refetchOnMount: true, 
      refetchOnWindowFocus: false 
    }
  );

  const {data: spotAllList, isLoading: isLoadingSpotAllList } = useQuery<ISpotsDetail[]>(
    ['allList'],
    async () => {
      const params = {
        latitude: latitude,
        longitude: longitude,
      };
      const { data } = await getSpotsAllListApi(params);
      return data.data
    },
    { 
      onSuccess: (data) => {
        setSpotListAllCheck(true);
      },
      refetchOnMount: true, 
      refetchOnWindowFocus: false,
    }
  );

  const getSearchResult = async(e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (e.key === 'Enter') {
        if (!value) {
          setSpotListAllCheck(true);
          return;
        };
        setSpotListAllCheck(false);
        router.push({
          pathname: '/spot/search/result',
          query: { keyword: keyword, },
        });
        // inputRef.current?.blur();
    }
  };

  const handlerSearchKeyword = (value: string) => {
    router.push({
      pathname: '/spot/search/result',
      query: { keyword: value, },
    });
  };

  const changeInputHandler = (e: any) => {
    const value = e.target.value;
    setKeyword(value);
    if (!value) {
      // setIsSearched(false);
      setKeyword('');
    }
  };

  const clearInputHandler = () => {
    if (inputRef.current?.value.length! > 0) {
      initInputHandler();
      // setIsSearched(false);
      setKeyword('');
    };
  };

  const initInputHandler = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  if (isLoadingRecomand && isLoadingEventSpot && isLoadingPickup) {
    return <div>로딩</div>;
  };

 if(currentArrowed){
  if(isSeachingPosition){
    return <div>현재 위치 찾는중...😊</div>
  };
 };

  // 위치 정보 있는 경우 
  // -> 추천, 이벤트 스팟 있으면 노출
  // -> 추천, 이벤트 스팟 없으면 픽업이력 노출 
  // -> 픽업이력 없는 경우 안내 문구 노출

  // 위치 정보 없는 경우 
  // -> 픽업 이력 노출
  // -> 픽업 이력 없는 경우 안내 문구 노출
  return (
    <Container>
      {
        isMapSwitch ? (
          <SpotSearchMapPage spotSearchList={spotAllList} spotListAllCheck={spotListAllCheck} />
        ) : (
          <>
            <SearchBarWrapper>
              <label className='textLabel'>
                {
                  keyword.length === 0 &&
                    <span className='textPlaceholde'>도로명, 건물명 또는 지번으로 검색</span>
                }
                <TextInput
                  inputType="text"
                  svg="searchIcon"
                  fontSize='14px'
                  keyPressHandler={getSearchResult}
                  eventHandler={changeInputHandler}
                  value={keyword}
                  ref={inputRef}
                  withValue
                  onFocus={() => setIsFocusing(true)}
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
              !isFocusing && (
                <CurrentPositionSetting>
                  <SVGIcon name="locationBlack" />
                  <TextH6B margin="0 0 0 2px" padding="3px 0 0 0" onClick={getGeoLocation} pointer>
                    현 위치로 설정하기
                  </TextH6B>
                </CurrentPositionSetting>
              )
            }
            <SpotSearchKeywordSlider onChange={handlerSearchKeyword} />
            {
              isFocusing ? ( // 검색바 활성화
                <> 
                  { 
                    // 최근 픽업 이력이 있는 경우
                    pickUpList.length! > 0 ? (
                      <DefaultSearchContainer>
                        <RecentPickWrapper>
                          <TextH3B padding="0 0 12px 0">최근 픽업 이력</TextH3B>
                          {pickUpList?.map((item: IDestinationsResponse, index: number) => (
                            // 스팟 최근 픽업 이력 리스트
                            <SpotRecentPickupList item={item} key={index} hasCart={true} />
                          ))}
                        </RecentPickWrapper>
                      </DefaultSearchContainer>
                    ) : (
                      // 픽업이력이 없는 경우 빈화면
                      null
                    )
                  }
                </>
              ) : ( // 검색바 비활성화
                <>
                  {
                  // 위지 정보가 있는 상태
                    userLocationLen && (  
                      spotRecommendList?.spotList.length! > 0 ? (// 추천, 이벤트 스팟이 있는 경우 
                      <>
                      {/* 추천스팟 */}
                        <SpotRecommendWrapper>
                          <FlexBetween margin="0 0 12px 0">
                            <TextH2B>{spotRecommendList?.data.title}</TextH2B>
                            {
                              // 사용자 위치 설정 했을 경우 노출
                              userLocationLen && <TextB3R color={theme.greyScale65}>3km이내 프코스팟</TextB3R>
                            }
                          </FlexBetween>
                          {spotRecommendList?.spotList.map((item: any, index: number) => {
                            return <SpotsSearchResultList item={item} key={index} recommand={true} />;
                          })}
                        </SpotRecommendWrapper>
                        {/* 이벤트 중인 스팟 */}
                        <BottomContentWrapper>
                          <Row />
                          <TextH2B padding="24px 24px 24px 24px">{eventSpotList?.title}</TextH2B>
                          <EventSlider className="swiper-container" slidesPerView={'auto'} spaceBetween={20} speed={500}>
                            {eventSpotList?.spots.map((list, idx) => {
                              return (
                                <SwiperSlide className="swiper-slide" key={idx}>
                                  <SpotList list={list} type="event" />
                                </SwiperSlide>
                              );
                            })}
                          </EventSlider>
                        </BottomContentWrapper>
                      </>
                      ) : (
                      <> 
                        { // 추천, 이벤트 스팟이 없는 경우 
                          pickUpList?.length! > 0 ? (
                            // 최근 픽업 이력이 있는 경우
                            <DefaultSearchContainer>
                              <RecentPickWrapper>
                                <TextH3B padding="0 0 12px 0">최근 픽업 이력</TextH3B>
                                {pickUpList?.map((item: IDestinationsResponse, index: number) => (
                                  // 스팟 최근 픽업 이력 리스트
                                  <SpotRecentPickupList item={item} key={index} hasCart={true} />
                                ))}
                              </RecentPickWrapper>
                            </DefaultSearchContainer>
                          ) : (
                            // 최근 픽업 이력이 없는 경우
                            <DefaultSearchContainer empty>
                              <TextB2R color={theme.greyScale65} center>{'찾으시는 프코스팟을 검색해 보세요.\n(이용 가능 지역: 서울 및 경기도 일부)'}</TextB2R>
                            </DefaultSearchContainer>
                          )
                        }
                      </>
                      )
                    ) 
                  }
                  {
                     //위치 없보 없는 경우
                    !userLocationLen && ( 
                      <>
                        {
                          pickUpList?.length! > 0 ? (
                            // 최근 픽업 이력이 있는 경우
                            <DefaultSearchContainer>
                              <RecentPickWrapper>
                                <TextH3B padding="0 0 12px 0">최근 픽업 이력</TextH3B>
                                {pickUpList?.map((item: IDestinationsResponse, index: number) => (
                                  // 스팟 최근 픽업 이력 리스트
                                  <SpotRecentPickupList item={item} key={index} hasCart={true} />
                                ))}
                              </RecentPickWrapper>
                            </DefaultSearchContainer>
                          ) : (
                            // 최근 픽업 이력이 없는 경우
                            <DefaultSearchContainer empty>
                              <TextB2R color={theme.greyScale65} center>{'찾으시는 프코스팟을 검색해 보세요.\n(이용 가능 지역: 서울 및 경기도 일부)'}</TextB2R>
                            </DefaultSearchContainer>
                          )
                        }
                      </>
                    )
                  }
                </>
              )
            }
          </>
        )
      }
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

const CurrentPositionSetting = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px 0 0;
`;

const SpotRecommendWrapper = styled.section`
  margin-bottom: 16px;
  ${homePadding};
`;

const RecentPickWrapper = styled.div`
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
