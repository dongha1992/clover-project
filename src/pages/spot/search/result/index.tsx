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
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import 'swiper/css';
import { destinationForm, SET_LOCATION } from '@store/destination';
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
import useCurrentLocation from '@hooks/useCurrentLocation';
import { Loading } from '@components/Shared/Loading';
import { show, hide } from '@store/loading';

const SpotSearchResultPage = (): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { orderId, isDelivery, keyword } = router.query;
  const { spotsPosition, spotSearchSelectedFilters, spotSearchSort, isMapSwitch } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);
  const {
    location: currentLocation,
    error: currentError,
    currentArrowed,
    handlerCurrentPosition,
  } = useCurrentLocation();

  const [searchResult, setSearchResult] = useState<ISpotsDetail[]>([]);
  const [defaultSpotList, setDefaultSpotList] = useState<ISpotsDetail[]>([]);
  const [paginatedSpotList, setPaginatedSpotList] = useState<ISpotsDetail[]>([]);
  const [spotAllList, setSpotAllList] = useState<ISpotsDetail[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [inputKeyword, setInputKeyword] = useState<string>('');
  const [size, setSize] = useState<number>(10);
  const [spotListAllCheck, setSpotListAllCheck] = useState<boolean>(false);
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
    defaultSortRedioId();
    dispatch(INIT_SEARCH_SELECTED_FILTERS());
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
    // scroll event listener ??????
    window.addEventListener('scroll', handleScroll);
    return () => {
      // scroll event listener ??????
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // ????????? ????????? ????????? ?????? api ??????
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
    // ????????? ?????? ??????
    const hasSearchResult = searchResult.length > 0;
    if ((spotSearchSort || spotSearchSelectedFilters) && hasSearchResult) {
      spotFiltered(defaultSpotList);
    }
  }, [spotSearchSelectedFilters, spotSearchSort]);

  useEffect(() => {
    // ???????????? ????????? ??????
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

  useEffect(() => {
    if (currentLocation) {
      onLoadKakaoCurrentPositionAddress(currentLocation.latitude, currentLocation.longitude);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  const onLoadKakaoCurrentPositionAddress = (currentLat?: number, currentLon?: number) => {
    try {
      window.kakao.maps.load(() => {
        let geocoder = new window.kakao.maps.services.Geocoder();
        let coord = new window.kakao.maps.LatLng(currentLat, currentLon);
        let callback = function (result: any, status: any) {
          if (status === window.kakao.maps.services.Status.OK) {
            const address = result[0].address;
            const setAddress = `${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`;
            dispatch(
              SET_ALERT({
                alertMessage: `${setAddress}(???)???\n?????? ??????????????????????`,
                submitBtnText: '??????',
                closeBtnText: '??????',
                onSubmit: () => setCurrentPositionAddress(result[0]),
                onClose: () => {},
              })
            );
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

  // ??? ????????? ?????? ????????? ?????? - ?????? ?????? ????????? ??????
  // ???????????? ?????? ?????? ?????? ?????? & ??? ?????? distance ??????
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
      SET_SPOT_POSITIONS({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      })
    );

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

  const getGeoLocation = () => {
    // ?????? ?????? -> ???????????? ????????? ??? ?????? ??? hanlder
    handlerCurrentPosition();
  };

  // ?????? ?????? ?????? ?????? api
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
      dispatch(show());
      const { data } = await getDestinationsApi(params);
      return data.data.destinations;
    },
    { 
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true, 
      refetchOnWindowFocus: false 
    }
  );

  // ?????? ?????? ?????? ??????
  const getSearchResult = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (e.key === 'Enter') {
      if (!value) {
        getSpotsAllList(); // ?????? ????????? ?????? ????????? ?????? -> ?????? ?????? ????????? ??????
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
        query: { ...routerQueries, keyword: value },
      });
    }
  };

  //?????? ?????? ????????? api
  const {
    error: spotSearchError,
    refetch,
    isLoading,
    isFetching,
  } = useQuery(
    ['spotSearchList', spotsPosition],
    async () => {
      const params = {
        keyword: inputKeyword,
        latitude: latitude,
        longitude: longitude,
      };
      dispatch(show());
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
        if (data.spots.length === 0) {
          // ?????? ???????????? ?????? ?????? ?????? ????????? ??????
          getSpotsAllList();
        }
      },
      onSettled: () => {
        dispatch(hide());
      },
    }
  );

  // ?????? ?????? ????????? api
  const getSpotsAllList = async () => {
    try {
      const params = {
        latitude: latitude,
        longitude: longitude,
      };
      const { data } = await getSpotsAllListApi(params);
      if (data.code === 200) {
        const list = data.data;
        setSpotAllList(list);
        setSpotListAllCheck(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const spotFiltered = (spotList: ISpotsDetail[]) => {
    // ?????? ?????? ?????? ???????????????
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
      query: { ...routerQueries, keyword: keyword },
    });
  };

  const changeInputHandler = (e: any) => {
    const value = e.target.value;
    setInputKeyword(value);
    defaultSortRedioId();
    dispatch(INIT_SEARCH_SELECTED_FILTERS());
    if (!value) {
      setInputKeyword('');
    }
  };

  const clearInputHandler = () => {
    if (inputRef.current?.value.length! > 0) {
      getSpotsAllList();
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
    // ?????? ?????? ?????? ?????????
    if (userLocationLen) {
      return dispatch(SET_SPOT_SEARCH_SORT('nearest'));
    } else if (!userLocationLen) {
      return dispatch(SET_SPOT_SEARCH_SORT('frequency'));
    }
  };

  const noSpotResultSwitchMap = () => {
    // ?????? ?????? ?????? ??????, ??? ?????? ???????????? ?????? ??????
    // getSpotsAllList();
    dispatch(SET_SPOT_MAP_SWITCH(true));
  };

  const goToSpotsRegistrations = () => {
    router.push('/spot/join');
  };

  if (isFetching || isLoadingPickup) {
    return <Loading />
  }

  // ????????? ????????? ??? ??????
  // ?????? ?????? ?????? ??????
  // -> ?????? ?????? ??????
  // -> ?????? ?????? ????????? ?????? ?????? ??????
  // -> ?????? ?????? ????????? ??? ?????? ??????

  // ?????? ?????? ?????? ??????
  // -> ?????? ?????? ??????
  // -> ?????? ?????? ?????? ?????? ??? ?????? ??????
  return (
    <Container>
      {isMapSwitch ? (
        <SpotSearchMapPage
          spotListAllCheck={spotListAllCheck}
          spotSearchList={spotListAllCheck ? spotAllList : searchResult}
          isSearched={isSearched}
        />
      ) : (
        <>
          <SearchBarWrapper>
            <label className="textLabel">
              {inputKeyword.length === 0 && <span className="textPlaceholde">?????????, ????????? ?????? ???????????? ??????</span>}
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
                  <TextH3B padding="0 0 12px 0">?????? ?????? ??????</TextH3B>
                  {recentPickedSpotList?.map((item: any, index) => (
                    // ?????? ?????? ?????? ?????? ?????????
                    <SpotRecentPickupList item={item} key={index} hasCart={true} />
                  ))}
                </RecentPickWrapper>
              </DefaultSearchContainer>
            ) : null)}
          {isSearched && ( // ?????? ??????
            <SearchResultContainer>
              <SpotSearchResult
                searchResult={paginatedSpotList}
                orderId={orderId}
                hasCart={true}
                getLocation={getGeoLocation}
                noSpotResultSwitchMap={noSpotResultSwitchMap}
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
