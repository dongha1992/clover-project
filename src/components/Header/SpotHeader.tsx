import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { TextH5B } from '@components/Shared/Text';
import { breakpoints } from '@utils/common/getMediaQuery';
import CartIcon from '@components/Header/Cart';
import router from 'next/router';
import { destinationForm, INIT_USER_DELIVERY_TYPE } from '@store/destination';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from '@components/Shared/Tooltip';
import { getComputeDistance } from '@utils/spot';
import { spotSelector } from '@store/spot';
import useCurrentLocation from '@hooks/useCurrentLocation';

const SpotHeader = () => {
  const dispatch = useDispatch();
  const { spotsPosition } = useSelector(spotSelector);
  const { userLocation } = useSelector(destinationForm);
  const [distance, setDistance] = useState<number>(0);
  const {
    location: currentLocation,
    error: currentError,
    currentArrowed,
    handlerCurrentPosition,
  } = useCurrentLocation();

  useEffect(() => {
    if (userLocation?.emdNm) {
      handlerCurrentPosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotsPosition.latitude, spotsPosition.longitude]);

  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  const getLocation = async () => {
    if (currentLocation) {
      const distance = getComputeDistance(
        spotsPosition.latitude,
        spotsPosition.longitude,
        currentLocation.latitude!,
        currentLocation.longitude!
      );
      setDistance(distance);
    }
  };

  const goToCart = () => {
    router.push('/cart');
    sessionStorage.removeItem('selectedDay');
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
        <Left onClick={goToLocation}>
          <SVGIcon name="location" />
          <AddressWrapper>
            <TextH5B>{userLocation?.emdNm ? <a>{userLocation?.emdNm}</a> : <a>내 위치 설정하기</a>}</TextH5B>
            {distance >= 3 && <Tooltip message="현재 위치가 맞나요?" width="141px" left="-5px" top="29px" />}
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
  height: 100%;
  max-width: ${breakpoints.mobile}px;
  position: absolute;
  top: 0;
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
  width: 100%;
  height: 100%;
  padding: 0 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* margin: 16px 24px; */
`;

const AddressWrapper = styled.div`
  padding-left: 8px;
`;

const Left = styled.div`
  position: relative;
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
