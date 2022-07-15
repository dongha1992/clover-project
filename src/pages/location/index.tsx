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
import { SPECIAL_REGX, ADDRESS_KEYWORD_REGX } from '@constants/regex/index';
import { getAddressFromLonLat } from '@api/location';
import { SET_ALERT } from '@store/alert';
import { SET_SPOT_POSITIONS } from '@store/spot';

declare global {
  interface Window {
    getCurrentPositionAddress: any;
  }
}

interface IPosition {
  latitude: number | null;
  longitude: number | null
};

const LocationPage = () => {
  const [resultAddress, setResultAddress] = useState<IJuso[]>([]);
  const [totalCount, setTotalCount] = useState<string>('0');
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [currentValueLen, setCurrentValurLen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isSeachingPosition, setIsSearchingPosition] = useState<boolean>(false);
  const addressRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const { isSpot } = router.query;

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // if (Math.round(scrollTop + clientHeight) >= scrollHeight && !isLastPage) {
      if (Math.round(scrollTop + clientHeight) >= scrollHeight) {
        // 페이지 끝에 도달하면 page 파라미터 값에 +1 주고, 데이터 받아온다.
        setPage((prevPage) => prevPage + 1);
      }
    };
    // scroll event listener 등록
    window.addEventListener('scroll', handleScroll);
    return () => {
      // scroll event listener 해제
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
      getSearchAddressResult();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
    
  // 현 위치로 설정하기 - 폼에 맞게 주소값 세팅 & address-detail페이지로 이동
  const setCurrentPositionAddress = (address: any) => { 
    dispatch(SET_LOCATION_TEMP({
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
    if (isSpot) {
      router.push({
        pathname: '/location/address-detail',
        query: { isSpot: true, position: true },
      });
    } else {
      router.push({
        pathname: '/location/address-detail',
        query: { isLocation: true, position: true },
      });
    };
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

  const addressInputHandler = () => {
    const keyword = addressRef.current?.value.length;
    if (addressRef.current) {
      if (!keyword) {
        setResultAddress([]);
        setIsSearched(false);
        clearInputHandler();
      }
    }
  };

  const getSearchAddress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if(value.length > 0){
      setCurrentValurLen(true);
    };

    if (e.key === 'Enter') {
      getSearchAddressResult();
      setIsSearched(true);
    }
  };

  const getSearchAddressResult = async () => {
    if (addressRef.current) {
      let query = addressRef.current?.value;
      const params = {
        query,
        page: page,
      };
      if (SPECIAL_REGX.test(query) || ADDRESS_KEYWORD_REGX.includes(query)) {
        alert('포함할 수 없는 문자입니다.');
        return;
      }
      try {
        /* data.results.juso 검색결과 없으면 null */
        let { data } = await searchAddressJuso(params);
        const list = data?.results.juso ?? [];
        setResultAddress((prevList) => [...prevList, ...list]);
        setTotalCount(data.results.common.totalCount);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const clearInputHandler = () => {
    if (addressRef.current) {
      addressRef.current.value = '';
    }
    setResultAddress([]);
    setIsSearched(false);
  };

  const goToMapDetail = (address: any): void => {
    dispatch(SET_LOCATION_TEMP(address));
    if (isSpot) {
      router.push({
        pathname: '/location/address-detail',
        query: { isSpot: true },
      });
    } else {
      router.push({
        pathname: '/location/address-detail',
        query: { isLocation: true },
      });
    }
  };

  if(isSeachingPosition){
    return <div>현재 위치 찾는 중..😊</div>
  };

  return (
    <HomeContainer>
      <Wrapper>
        <SearchBarWrapper>
          <TextInput
            name="input"
            placeholder="도로명, 건물명 또는 지번으로 검색"
            inputType="text"
            svg="searchIcon"
            eventHandler={addressInputHandler}
            keyPressHandler={getSearchAddress}
            ref={addressRef}
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
            현 위치로 설정하기
          </TextH6B>
        </CurrentLocBtn>
        {
          isSearched ? (
            <ResultList>
              {resultAddress.length > 0 ? (
                <>
                  <TextH5B padding="0 0 17px 0">검색 결과 {totalCount}개</TextH5B>
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
                  {'검색 결과가 없어요. 😭\n입력한 주소를 다시 한 번 확인해 주세요.'}
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
