import React, { ReactElement, useEffect, useState } from 'react';
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
  SET_SEARCH_KEYWORD,
  SET_SPOT_MAP_SWITCH,
  SET_SPOT_POSITIONS,
} from '@store/spot';
import { SET_LOCATION } from '@store/destination';
import { getDestinationsApi } from '@api/destination';
import { IDestinationsResponse, ISpotsAllListResponse } from '@model/index';
import { SpotSearchKeywordSlider } from '@components/Pages/Spot';
import { ISpotsDetail } from '@model/index';
import { SET_ALERT } from '@store/alert';
import { truncate } from 'lodash-es';
// import { getCartsApi } from '@api/cart';
// import { INIT_CART_LISTS, SET_CART_LISTS } from '@store/cart';

declare global {
  interface Window {
    getCurrentPositionAddress: any;
  }
};

const SpotSearchPage = (): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { 
    spotsPosition, 
    isMapSwitch,
  } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);
  const [spotListAllCheck, setSpotListAllCheck] = useState<boolean>(false);
  const [isSeachingPosition, setIsSearchingPosition] = useState<boolean>(false);
  const userLocationLen = userLocation.emdNm?.length! > 0;

  const latLen = spotsPosition?.latitude !== null;
  const latitude = latLen ? Number(spotsPosition?.latitude) : null;
  const lonLen = spotsPosition?.longitude !== null;
  const longitude = lonLen ? Number(spotsPosition?.longitude) : null;

  useEffect(()=> {
    dispatch(SET_SEARCH_KEYWORD(''));
    dispatch(SET_SPOT_MAP_SWITCH(false));
    // getSpotAllList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=> {
    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false&libraries=services,clusterer`;
    document.head.appendChild(mapScript);
  
    mapScript.addEventListener("load", onLoadKakaoMap);
    return () => mapScript.removeEventListener("load", onLoadKakaoMap);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                const searchKeyword = result[0].road_address.address_name;
                setIsSearchingPosition(false);
                dispatch(SET_SEARCH_KEYWORD(searchKeyword));
                router.push('/spot/search/main');
                dispatch(SET_LOCATION({
                  roadAddr: `${address.road_address.address_name}(${address.address.region_3depth_name})`,
                  roadAddrPart1: address.road_address.address_name,
                  roadAddrPart2: null,
                  jibunAddr: `${address.address.address_name} ${address.road_address.building_name}`,
                  engAddr: null,
                  zipNo: address.road_address.zone_no,
                  admCd: null,
                  rnMgtSn: null,
                  bdMgtSn: null,
                  detBdNmList: null,
                  bdNm: address.road_address.building_name,
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

  // 현 위치로 설정하기 - 위도,경도 좌표값 저장
  const getGeoLocation = () => { 
    setIsSearchingPosition(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        dispatch(
          SET_SPOT_POSITIONS({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        );
        window.getCurrentPositionAddress(position.coords.latitude, position.coords.longitude);
      });
    };
  };

  // 스팟 검색 - 추천 스팟 api
  const { data: spotRecommendList, isLoading: isLoadingRecomand } = useQuery(
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
        spotList: listSort
      }
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );
  
  // 스팟 검색 - 이벤트 스팟 api
  const { data: eventSpotList, isLoading: isLoadingEventSpot } = useQuery(
    ['spotList', 'EVENT'],
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

  const {data: spotAllList, isLoading: isLoadingSpotAllList } = useQuery(
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
      refetchOnWindowFocus: false 
    }
  );

  const goToSpotSearch = () => {
    router.push('/spot/search/main');
  };


  const handlerSearchKeyword = (value: string) => {
    dispatch(SET_SEARCH_KEYWORD(value));
    router.push('/spot/search/main');
  };

  if (isLoadingRecomand && isLoadingEventSpot && isLoadingPickup) {
    return <div>로딩</div>;
  };

  if(isSeachingPosition){
    return <div>현재 위치 찾는중...😊</div>
  }

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
            <SearchBarWrapper onClick={goToSpotSearch}>
              <TextInputButton>
                <div className='sgv'>
                  <SVGIcon name="searchIcon" />
                </div>
                <Text>도로명, 건물명 또는 지번으로 검색</Text>
              </TextInputButton>
            </SearchBarWrapper>
            <CurrentPositionSetting onClick={getGeoLocation}>
              <SVGIcon name="locationBlack" />
              <TextH6B margin="0 0 0 2px" padding="3px 0 0 0">
                현 위치로 설정하기
              </TextH6B>
            </CurrentPositionSetting>
            <SpotSearchKeywordSlider onChange={handlerSearchKeyword} />
            {
            // 스팟 검색 메인 
              userLocationLen ?  // 위지 정보가 있는 상태
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
                  recentPickedSpotList?.length! > 0 ? (
                    // 최근 픽업 이력이 있는 경우
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
                    // 최근 픽업 이력이 없는 경우
                    <DefaultSearchContainer empty>
                      <TextB2R color={theme.greyScale65} center>{'찾으시는 프코스팟을 검색해 보세요.\n(이용 가능 지역: 서울 및 경기도 일부)'}</TextB2R>
                    </DefaultSearchContainer>
                  )
                }
                </>
              ) : (
                //위치 없보 없는 경우
                <>
                {
                  recentPickedSpotList?.length! > 0 ? (
                    // 최근 픽업 이력이 있는 경우
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

const CurrentPositionSetting = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px 0 0;
  cursor: pointer;
`;

const TextInputButton = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: 1px solid ${theme.greyScale15};
  outline: none;
  cursor: pointer;
  padding: 13px 48px;
  .sgv {
    position: absolute;
    left: 15px;
    top: 11px;
  }
`;

const Text = styled.div`
  color: ${theme.greyScale45};
  ${textBody2};
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
