import React, { ReactElement, useEffect, useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { homePadding } from '@styles/theme';
import { theme, FlexBetween, FlexEnd, textBody2 } from '@styles/theme';
import { TextH3B, TextB3R, TextH6B, TextH2B, TextB2R } from '@components/Shared/Text';
import { SpotList, SpotRecentPickupList, SpotSearchMapPage, SpotsSearchResultList } from '@components/Pages/Spot';
import { SVGIcon } from '@utils/common';
import { getSpotSearchRecommend, getSpotEvent, getSpotsAllListApi } from '@api/spot';
import { useQuery } from 'react-query';
import { IParamsSpots } from '@model/index';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { destinationForm, SET_LOCATION } from '@store/destination';
import { spotSelector, SET_SPOT_MAP_SWITCH, SET_SPOT_POSITIONS } from '@store/spot';
import { getDestinationsApi } from '@api/destination';
import { IDestinationsResponse, IGetDestinationsResponse } from '@model/index';
import { SpotSearchKeywordSlider } from '@components/Pages/Spot';
import { ISpotsDetail } from '@model/index';
import { SET_ALERT } from '@store/alert';
import TextInput from '@components/Shared/TextInput';
import useCurrentLocation from '@hooks/useCurrentLocation';
import { Loading } from '@components/Shared/Loading';
import { show, hide } from '@store/loading';
// import { getCartsApi } from '@api/cart';
// import { INIT_CART_LISTS, SET_CART_LISTS } from '@store/cart';

const SpotSearchPage = (): ReactElement => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { spotsPosition, isMapSwitch } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);
  const {
    location: currentLocation,
    error: currentError,
    currentArrowed,
    handlerCurrentPosition,
  } = useCurrentLocation();

  const [spotListAllCheck, setSpotListAllCheck] = useState<boolean>(false);
  const [isSeachingPosition, setIsSearchingPosition] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [isFocusing, setIsFocusing] = useState<boolean>(false);
  const [pickUpList, setPickUpList] = useState<any>([]);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const userLocationLen = userLocation.emdNm?.length! > 0;

  const latLen = spotsPosition?.latitude !== null;
  const latitude = latLen ? Number(spotsPosition?.latitude) : null;
  const lonLen = spotsPosition?.longitude !== null;
  const longitude = lonLen ? Number(spotsPosition?.longitude) : null;

  useEffect(() => {
    onLoadKakaoCurrentPositionAddress();
    dispatch(SET_SPOT_MAP_SWITCH(false));
    // getSpotAllList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (Math.round(scrollTop + clientHeight) >= scrollHeight && !isLastPage) {
        // ????????? ?????? ???????????? page ???????????? ?????? +1 ??????, ????????? ????????????.
        setPage((prev) => prev + 1);
      }
    };
    // scroll event listener ??????
    window.addEventListener('scroll', handleScroll);
    return () => {
      // scroll event listener ??????
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickUpList.length > 0]);

  useEffect(() => {
    if (currentLocation) {
      dispatch(
        SET_SPOT_POSITIONS({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        })
      );
      onLoadKakaoCurrentPositionAddress(currentLocation.latitude, currentLocation.longitude);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  useEffect(() => {
    if (currentArrowed) {
      setIsSearchingPosition(false);
    }
  }, [currentArrowed]);

  // ??? ????????? ???????????? - ???????????????api ???????????? ??????????????? ?????? ??????
  const onLoadKakaoCurrentPositionAddress = (currentLat?: number, currentLon?: number) => {
    try {
      window.kakao.maps.load(() => {
        let geocoder = new window.kakao.maps.services.Geocoder();
        let coord = new window.kakao.maps.LatLng(currentLat, currentLon);
        let callback = function (result: any, status: any) {
          if (status === window.kakao.maps.services.Status.OK) {
            const address = result[0];
            setIsSearchingPosition(false);
            setCurrentPositionAddress(address);
          }
        };
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
      });
    } catch (e) {
      dispatch(
        SET_ALERT({
          alertMessage: '??? ??? ?????? ????????? ??????????????????.',
          submitBtnText: '??????',
        })
      );
      console.error(e);
    }
  };

  // ??? ????????? ???????????? - ?????? ?????? ????????? ??????
  // ???????????? ?????? ????????????, ????????? ?????? ?????? & ??? ?????? distance ??????
  const setCurrentPositionAddress = (address: any) => {
    const noneRoadAddress = address.road_address === null;
    const jibunJuso = address.address.address_name;
    const jibunZipNo = `${address.address.main_address_no}-${address.address.sub_address_no}`;

    const setRoadAddressPart1 = noneRoadAddress ? jibunJuso : address.road_address.address_name;
    const setRoadAddress = noneRoadAddress
      ? jibunJuso
      : `${address.road_address.address_name}(${address.address.region_3depth_name})`;
    const setJibunAddr = noneRoadAddress
      ? jibunJuso
      : `${address.address.address_name} ${address.road_address.building_name}`;
    const setZipNo = noneRoadAddress ? jibunZipNo : address.road_address.zone_no;
    const setBdNm = noneRoadAddress ? null : address.road_address.building_name;

    dispatch(
      SET_LOCATION({
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
      })
    );
  };

  // ??? ????????? ???????????? - ??????,?????? ????????? ??????
  const getGeoLocation = () => {
    setIsSearchingPosition(true);
    handlerCurrentPosition();
  };

  // ?????? ?????? - ?????? ?????? api
  const { data: spotRecommendList, isLoading: isLoadingRecomand } = useQuery(
    ['spotRecommendList', spotsPosition],
    async () => {
      const params: IParamsSpots = {
        latitude: latitude,
        longitude: longitude,
        size: 3,
      };
      dispatch(show());
      const response = await getSpotSearchRecommend(params);
      const listSort = response.data.data.spots.sort((a, b) => a.distance - b.distance);
      return {
        data: response.data.data,
        spotList: listSort,
      };
    },
    { 
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true, 
      refetchOnWindowFocus: false 
    }
  );

  // ?????? ?????? - ????????? ?????? api
  const { data: eventSpotList, isLoading: isLoadingEventSpot } = useQuery(
    ['spotList', 'EVENT', spotsPosition],
    async () => {
      const params: IParamsSpots = {
        latitude: latitude,
        longitude: longitude,
        size: 6,
      };
      dispatch(show());
      const response = await getSpotEvent(params);
      return response.data.data;
    },
    { 
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true, 
      refetchOnWindowFocus: false 
    }
  );

  // ?????? ?????? ?????? ?????? api
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
      dispatch(show());
      const response = await getDestinationsApi(params);
      return response.data;
    },
    {
      onSuccess: async (data) => {
        const list = data.data.destinations;
        const lastPage = data.data.pagination.totalPage;
        setPickUpList((prevList: any) => [...prevList, ...list]);
        setIsLastPage(page === lastPage);
      },
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
    }
  );

  const { data: spotAllList } = useQuery<ISpotsDetail[]>(
    ['allList'],
    async () => {
      const params = {
        latitude: latitude,
        longitude: longitude,
      };
      const { data } = await getSpotsAllListApi(params);
      return data.data;
    },
    {
      onSuccess: (data) => {
        setSpotListAllCheck(true);
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const getSearchResult = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (e.key === 'Enter') {
      if (!value) {
        setSpotListAllCheck(true);
        return;
      }
      setSpotListAllCheck(false);
      router.push({
        pathname: '/spot/search/result',
        query: { keyword: keyword },
      });
      // inputRef.current?.blur();
    }
  };

  const handlerSearchKeyword = (value: string) => {
    router.push({
      pathname: '/spot/search/result',
      query: { keyword: value },
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
    }
  };

  const initInputHandler = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  if (isLoadingRecomand || isLoadingEventSpot) {
    return <Loading />;
  }

  if (currentArrowed) {
    if (isSeachingPosition) {
      return <Loading />;
    }
  }

  // ?????? ?????? ?????? ??????
  // -> ??????, ????????? ?????? ????????? ??????
  // -> ??????, ????????? ?????? ????????? ???????????? ??????
  // -> ???????????? ?????? ?????? ?????? ?????? ??????

  // ?????? ?????? ?????? ??????
  // -> ?????? ?????? ??????
  // -> ?????? ?????? ?????? ?????? ?????? ?????? ??????
  return (
    <Container>
      {isMapSwitch ? (
        <SpotSearchMapPage spotSearchList={spotAllList} spotListAllCheck={spotListAllCheck} />
      ) : (
        <>
          <SearchBarWrapper>
            <label className="textLabel">
              {keyword.length === 0 && <span className="textPlaceholde">?????????, ????????? ?????? ???????????? ??????</span>}
              <TextInput
                inputType="text"
                svg="searchIcon"
                fontSize="14px"
                keyPressHandler={getSearchResult}
                eventHandler={changeInputHandler}
                value={keyword}
                ref={inputRef}
                withValue
                onFocus={() => setIsFocusing(true)}
              />
            </label>
            {keyword.length > 0 && (
              <div className="removeSvg" onClick={clearInputHandler}>
                <SVGIcon name="removeItem" />
              </div>
            )}
          </SearchBarWrapper>
          {!isFocusing && (
            <CurrentPositionSetting>
              <SVGIcon name="locationBlack" />
              <TextH6B margin="0 0 0 2px" padding="3px 0 0 0" onClick={getGeoLocation} pointer>
                ??? ????????? ????????????
              </TextH6B>
            </CurrentPositionSetting>
          )}
          <SpotSearchKeywordSlider onChange={handlerSearchKeyword} />
          {isFocusing ? ( // ????????? ?????????
            <>
              {
                // ?????? ?????? ????????? ?????? ??????
                pickUpList.length! > 0 ? (
                  <DefaultSearchContainer>
                    <RecentPickWrapper>
                      <TextH3B padding="0 0 12px 0">?????? ?????? ??????</TextH3B>
                      {pickUpList?.map((item: IDestinationsResponse, index: number) => (
                        // ?????? ?????? ?????? ?????? ?????????
                        <SpotRecentPickupList item={item} key={index} hasCart={true} />
                      ))}
                    </RecentPickWrapper>
                  </DefaultSearchContainer>
                ) : // ??????????????? ?????? ?????? ?????????
                null
              }
            </>
          ) : (
            // ????????? ????????????
            <>
              {
                // ?????? ????????? ?????? ??????
                userLocationLen &&
                  ((spotRecommendList?.spotList.length! > 0 || eventSpotList?.spots.length! > 0) ? ( // ??????, ????????? ????????? ?????? ??????
                    <>
                      {
                        // ????????????
                        spotRecommendList?.spotList.length! > 0 && (
                          <SpotRecommendWrapper>
                            <FlexBetween margin="0 0 12px 0">
                              <TextH2B>{spotRecommendList?.data.title}</TextH2B>
                              {
                                // ????????? ?????? ?????? ?????? ?????? ??????
                                userLocationLen && <TextB3R color={theme.greyScale65}>3km?????? ????????????</TextB3R>
                              }
                            </FlexBetween>
                            {spotRecommendList?.spotList.map((item: any, index: number) => {
                              return <SpotsSearchResultList item={item} key={index} recommand={true} />;
                            })}
                          </SpotRecommendWrapper>
                        )
                      }
                      {
                        // ????????? ?????? ??????
                        eventSpotList?.spots.length! > 0 && (
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
                        )
                      }
                    </>
                  ) : (
                    <>
                      {
                        // ??????, ????????? ????????? ?????? ??????
                        pickUpList?.length! > 0 ? (
                          // ?????? ?????? ????????? ?????? ??????
                          <DefaultSearchContainer>
                            <RecentPickWrapper>
                              <TextH3B padding="0 0 12px 0">?????? ?????? ??????</TextH3B>
                              {pickUpList?.map((item: IDestinationsResponse, index: number) => (
                                // ?????? ?????? ?????? ?????? ?????????
                                <SpotRecentPickupList item={item} key={index} hasCart={true} />
                              ))}
                            </RecentPickWrapper>
                          </DefaultSearchContainer>
                        ) : (
                          // ?????? ?????? ????????? ?????? ??????
                          <DefaultSearchContainer empty>
                            <TextB2R color={theme.greyScale65} center>
                              {'???????????? ??????????????? ????????? ?????????.\n(?????? ?????? ??????: ?????? ??? ????????? ??????)'}
                            </TextB2R>
                          </DefaultSearchContainer>
                        )
                      }
                    </>
                  ))
              }
              {
                //?????? ?????? ?????? ??????
                !userLocationLen && (
                  <>
                    {pickUpList?.length! > 0 ? (
                      // ?????? ?????? ????????? ?????? ??????
                      <DefaultSearchContainer>
                        <RecentPickWrapper>
                          <TextH3B padding="0 0 12px 0">?????? ?????? ??????</TextH3B>
                          {pickUpList?.map((item: IDestinationsResponse, index: number) => (
                            // ?????? ?????? ?????? ?????? ?????????
                            <SpotRecentPickupList item={item} key={index} hasCart={true} />
                          ))}
                        </RecentPickWrapper>
                      </DefaultSearchContainer>
                    ) : (
                      // ?????? ?????? ????????? ?????? ??????
                      <DefaultSearchContainer empty>
                        <TextB2R color={theme.greyScale65} center>
                          {'???????????? ??????????????? ????????? ?????????.\n(?????? ?????? ??????: ?????? ??? ????????? ??????)'}
                        </TextB2R>
                      </DefaultSearchContainer>
                    )}
                  </>
                )
              }
            </>
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
