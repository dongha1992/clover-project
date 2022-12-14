import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import TextInput from '@components/Shared/TextInput';
import { HomeContainer, theme} from '@styles/theme';
import { TextH6B, TextH5B, TextB2R } from '@components/Shared/Text';
import { SVGIcon } from '@utils/common';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { searchAddressJuso } from '@api/search';
import { IJuso } from '@model/index';
import AddressItem from '@components/Pages/Location/AddressItem';
import { SET_LOCATION_TEMP } from '@store/destination';
import { SET_ALERT } from '@store/alert';
import { useQuery } from 'react-query';
import useCurrentLocation from '@hooks/useCurrentLocation';
import { Loading } from '@components/Shared/Loading';
import { show, hide } from '@store/loading';

interface IPosition {
  latitude: number | null;
  longitude: number | null
};

const LocationPage = () => {
  const addressRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { isSpot, keyword, isSub }: any = router.query;
  const { location: currentLocation, error: currentError, currentArrowed, handlerCurrentPosition } = useCurrentLocation();

  const [resultAddress, setResultAddress] = useState<IJuso[]>([]);
  const [totalCount, setTotalCount] = useState<string>('0');
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [currentValueLen, setCurrentValurLen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isSeachingPosition, setIsSearchingPosition] = useState<boolean>(false);
  const [inputKeyword, setInputKeyword] = useState<string>('');
  const [routerQueries, setRouterQueries] = useState({});

  useEffect(() => {
    if (router.isReady) {
      setRouterQueries(router.query);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    onLoadKakaoCurrentPositionAddress();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // if (Math.round(scrollTop + clientHeight) >= scrollHeight && !isLastPage) {
      if (Math.round(scrollTop + clientHeight) >= scrollHeight) {
        // ????????? ?????? ???????????? page ???????????? ?????? +1 ??????, ????????? ????????????.
        setPage((prevPage) => prevPage + 1);
      }
    };
    // scroll event listener ??????
    window.addEventListener('scroll', handleScroll);
    return () => {
      // scroll event listener ??????
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(keyword) {
      startAddressSearch(keyword);
      setIsSearched(true);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  useEffect(()=>{
    if(currentLocation){
      onLoadKakaoCurrentPositionAddress(currentLocation.latitude, currentLocation.longitude);
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  useEffect(()=> {
    if(currentArrowed){
      setIsSearchingPosition(false);
      dispatch(hide());
    };
  }, [currentArrowed]);

  // ??? ????????? ???????????? - ???????????????api ???????????? ??????????????? ?????? ??????
  const onLoadKakaoCurrentPositionAddress = (currentLat?: number, currentLon?: number) => { 
    try {
      window.kakao.maps.load(() => {
        let geocoder = new window.kakao.maps.services.Geocoder();
        let coord = new window.kakao.maps.LatLng(currentLat, currentLon);
        let callback = function(result: any, status: any) {
            if (status === window.kakao.maps.services.Status.OK) {
              const address = result[0];
                setIsSearchingPosition(false);
                setCurrentPositionAddress(address);
                dispatch(hide());
            };
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
    };
  };
    
  // ??? ????????? ???????????? - ?????? ?????? ????????? ?????? 
  // address-detail ???????????? ???????????? ??????
  const setCurrentPositionAddress = (address: any) => {
    const noneRoadAddress = address.road_address === null;
    const jibunJuso = address.address.address_name;
    const jibunZipNo = `${address.address.main_address_no}-${address.address.sub_address_no}`;

    const setRoadAddressPart1 = noneRoadAddress ? jibunJuso : address.road_address.address_name;
    const setRoadAddress = noneRoadAddress ? jibunJuso : `${address.road_address.address_name}(${address.address.region_3depth_name})`;
    const setJibunAddr = noneRoadAddress ? jibunJuso : `${address.address.address_name} ${address.road_address.building_name}`;
    const setZipNo = noneRoadAddress ? jibunZipNo : address.road_address.zone_no;
    const setBdNm = noneRoadAddress? null : address.road_address.building_name;

    dispatch(SET_LOCATION_TEMP({
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
    if (isSpot) {
      router.push({
        pathname: '/location/address-detail',
        query: { isSpot: true },
      });
    } else if (isSub) {
      router.push({
        pathname: '/location/address-detail',
        query: { isSub: true, isLocation: true, },
      });
    } else {
      router.push({
        pathname: '/location/address-detail',
        query: { isLocation: true },
      });
    };
  };

  // ??? ????????? ???????????? - ??????,?????? ????????? ??????
  const getGeoLocation = () => { 
    setIsSearchingPosition(true);
    handlerCurrentPosition();
    dispatch(show());
  };

  const getSearchAddress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if(value.length > 0){
      setCurrentValurLen(true);
    };

    if (e.key === 'Enter') {
      // getSearchAddressResult();
      startAddressSearch(value);
      setIsSearched(true);
      setInputKeyword(value);
      router.replace({
        query: {...routerQueries, keyword: value},
      });

    }
  };

  const {
    error,
    refetch,
    isLoading,
    isFetching,
  } = useQuery(
    ['addressResultList', page],
    async () => {
      const params = {
        query: inputKeyword,
        page: page,
      };
        const { data } = await searchAddressJuso(params);
      return data
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!isSearched,
      onError: () => {},
      onSuccess: (data) => {
        const list = data.results.juso ?? [];
        setResultAddress((prevList) => [...prevList, ...list]);
        setTotalCount(data.results.common.totalCount);
      },
    }
  );

  const startAddressSearch = (keyword: string) => {
    setInputKeyword(keyword);
    setIsSearched(true);
  };


  const clearInputHandler = () => {
    if (addressRef.current) {
      addressRef.current.value = '';
    };
    setResultAddress([]);
    setIsSearched(false);
    setInputKeyword('');
  };

  const changeInputHandler = (e: any) => {
    const value =  e.target.value;
    setInputKeyword(value);
    if(value.length){
      setResultAddress([]);
      setIsSearched(false);
    };
    if (!value) {
      setInputKeyword('');
    };
  };

  const goToMapDetail = (address: any): void => {
    dispatch(SET_LOCATION_TEMP(address));
    if (isSpot) {
      router.push({
        pathname: '/location/address-detail',
        query: { isSpot: true },
      });
    } else if (isSub) {
      router.push({
        pathname: '/location/address-detail',
        query: { isSub: true, isLocation: true, },
      });
    } else {
      router.push({
        pathname: '/location/address-detail',
        query: { isLocation: true, },
      });
    };
  };

  if(isSeachingPosition){
    return <Loading />
  };

  return (
    <HomeContainer>
      <Wrapper>
        <SearchBarWrapper>
          <TextInput
            name="input"
            placeholder="?????????, ????????? ?????? ???????????? ??????"
            inputType="text"
            svg="searchIcon"
            eventHandler={changeInputHandler}
            keyPressHandler={getSearchAddress}
            ref={addressRef}
            value={inputKeyword}
          />
          {
            currentValueLen && (
              <div className="removeSvg" onClick={clearInputHandler}>
                <SVGIcon name="removeItem" />
              </div>
            )
          }
        </SearchBarWrapper>
        <CurrentLocBtn>
          <SVGIcon name="locationBlack" />
          <TextH6B pointer padding="0 0 0 4px" onClick={getGeoLocation}>
            ??? ????????? ????????????
          </TextH6B>
        </CurrentLocBtn>
        {
          isSearched ? (
            <ResultList>
              {resultAddress.length > 0 ? (
                <>
                  <TextH5B padding="0 0 17px 0">?????? ?????? {totalCount}???</TextH5B>
                  {resultAddress.map((address, index) => {
                    return (
                      <AddressItem
                        key={index}
                        roadAddr={address.roadAddrPart1}
                        bdNm={address.bdNm}
                        jibunAddr={address.jibunAddr}
                        zipNo={address.zipNo}
                        onClick={() => goToMapDetail(address)}
                      />
                    );
                  })}
                </>
              ) : (
                <NoResultWrapper>
                  <TextB2R center color={theme.greyScale65}>
                  {'?????? ????????? ?????????. ????\n????????? ????????? ?????? ??? ??? ????????? ?????????.'}
                  </TextB2R>
                </NoResultWrapper>
              )}
            </ResultList>
          ) : (
            null
          )
        }
      </Wrapper>
    </HomeContainer>
  );
};

const Wrapper = styled.div`
  padding: 8px 0px 24px;
`;

const SearchBarWrapper = styled.div`
  position: relative;
  .removeSvg {
    position: absolute;
    right: 0;
    top: 0;
    margin: 15px 14px 0 0;
  }
`;


const TextInputWrapper = styled.div`
  position: relative;
  .removeSvg {
    position: absolute;
    right: 5%;
    top: 32%;
  }
`;

const CurrentLocBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
`;

const ResultList = styled.div``;

const NoResultWrapper = styled.div`
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default LocationPage;
