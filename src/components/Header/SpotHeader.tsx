import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { textH5 } from '@styles/theme';
import { breakpoints } from '@utils/common/getMediaQuery';
import CartIcon from '@components/Header/Cart';
import router from 'next/router';
import { destinationForm, INIT_USER_DELIVERY_TYPE } from '@store/destination';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from '@components/Shared/Tooltip';
import { getComputeDistance } from '@utils/spot';
import { spotSelector, SET_SPOT_POSITIONS } from '@store/spot';
import { searchAddressJuso } from '@api/search';
import { getAddressFromLonLat } from '@api/location';
import { IJuso } from '@model/index';

const SpotHeader = () => {
  const dispatch = useDispatch();
  const { spotsPosition } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);
  const [distance, setDistance] = useState<number>(0);
  // const [cureentPosition, setCurrentPosition] = useState<{latitude: number,longitude: number}> ({
  //   latitude: 0,
  //   longitude: 0,
  // });
  const [currentLocation, setCurrentLocation] = useState('');
  // const [resultAddress, setResultAddress] = useState<IJuso[]>([]);

  useEffect(()=> {
    if(userLocation?.emdNm){
      getLocation();
    };
  }, []);

  //GPS - 현재위치 가져오기
  const getCurrentPosition = () => new Promise((resolve, error) => navigator.geolocation.getCurrentPosition(resolve, error));

  const getLocation = async () => {
    try {
      const position: any = await getCurrentPosition();
      if(position) {
        // console.log('현재 위치', position.coords.latitude + ' ' + position.coords.longitude);
        const distance = getComputeDistance(spotsPosition.latitude, spotsPosition.longitude, position.coords.latitude, position.coords.longitude);
        if (distance > 3) {
          const { data } = await getAddressFromLonLat({
            y: position.coords.latitude?.toString(),
            x: position.coords.longitude?.toString(),
          });
          setCurrentLocation(data.documents[0].address_name);
          // dispatch(
          //   SET_SPOT_POSITIONS({
          //     latitude: position.coords.latitude,
          //     longitude: position.coords.longitude,
          //   })
          // );  
        };
        setDistance(distance);
        // setCurrentPosition({
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,          
        // });
      }
      return { Status: true, position, };
    } catch (error) {
      console.error("getCurrentLatLong::catcherror =>", error);
      return { Status: false, };
    }
  };

  console.log(distance, currentLocation);

  const goToCart = () => {
    router.push('/cart');
  };

  const goToLocation = (): void => {
    router.push({
      pathname: '/location',
      query: { isSpot: true },
    });
  };

  const goToSpotSearch = () => {
    dispatch(INIT_USER_DELIVERY_TYPE());
    router.push('/spot/search');
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <SVGIcon name="location" />
          <AddressWrapper>
            <div onClick={goToLocation}>
              {userLocation?.emdNm ? <a>{userLocation?.emdNm}</a> : <a>내 위치 설정하기</a>}
            </div>
            { distance > 3 && <Tooltip message="현재 위치가 맞나요?" width="139px" left="-5px" top="29px" />}
            {/* { distance > 3 && <Tooltip message="3km 내 프코스팟이 없어 위치를 변경했어요!" width='248px' left="-16px" top="29px" /> } */}
          </AddressWrapper>
        </Left>
        <Right>
          <div className="search" onClick={goToSpotSearch}>
            <a>
              <SVGIcon name="searchIcon" />
            </a>
          </div>
          <CartIcon onClick={goToCart} />
        </Right>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  height: 56px;
  left: calc(50%);
  background-color: white;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;

  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0px;
  `};
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 24px;
`;

const AddressWrapper = styled.div`
  ${textH5}
  padding-left: 8px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Right = styled.div`
  display: flex;
  align-items: center;

  .search {
    padding-right: 27px;
    cursor: pointer;
  }
`;

export default SpotHeader;
