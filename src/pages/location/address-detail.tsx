import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fixedBottom } from '@styles/theme';
import { Button, ButtonGroup } from '@components/Shared/Button';
import MapAPI from '@components/Map';
import { destinationForm } from '@store/destination';
import { useSelector, useDispatch } from 'react-redux';
import { CheckLocationPlace } from '@components/Pages/Destination/';
import router from 'next/router';
import { getLonLatFromAddress } from '@api/location';
import { SET_LOCATION, INIT_LOCATION_TEMP } from '@store/destination';
import { checkDestinationHelper } from '@utils/checkDestinationHelper';

const AddressDetailPage = () => {
  const { tempLocation, availableDestination } = useSelector(destinationForm);

  const dispatch = useDispatch();

  const [latitudeLongitude, setLatitudeLongitude] = useState({
    latitude: '',
    longitude: '',
  });

  // 배송 가능 여부
  const destinationStatus = checkDestinationHelper(availableDestination);
  const canNotDelivery = destinationStatus === 'noDelivery';

  const getLonLanForMap = async () => {
    const params = {
      query: tempLocation.roadAddrPart1,
      analyze_type: 'similar',
      page: 1,
      size: 20,
    };
    try {
      const { data } = await getLonLatFromAddress(params);
      if (data.documents.length > 0) {
        const longitude = data.documents[0].x;
        const latitude = data.documents[0].y;
        setLatitudeLongitude({
          latitude,
          longitude,
        });
      } else {
        // 검색 결과가 없는 경우?
      }
    } catch (error) {}
  };

  const setUserLocationHandler = () => {
    dispatch(SET_LOCATION(tempLocation));
    dispatch(INIT_LOCATION_TEMP());
    router.push('/');
  };

  const goToSearch = () => {
    router.push('/location');
  };

  const goToHome = () => {
    router.push('/');
  };

  useEffect(() => {
    getLonLanForMap();
  }, []);

  return (
    <Container>
      <CheckLocationPlace />
      <MapWrapper>
        <MapAPI
          centerLat={latitudeLongitude.latitude}
          centerLng={latitudeLongitude.longitude}
        />
      </MapWrapper>
      {canNotDelivery ? (
        <ButtonGroup
          leftButtonHandler={goToSearch}
          rightButtonHandler={goToHome}
          leftText="다른 주소 검색하기"
          rightText="닫기"
        />
      ) : (
        <ButtonWrapper>
          <Button
            height="100%"
            borderRadius="0"
            onClick={setUserLocationHandler}
          >
            설정하기
          </Button>
        </ButtonWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const ButtonWrapper = styled.div`
  ${fixedBottom}
`;

const MapWrapper = styled.div`
  height: 75.5vh;
`;

export default AddressDetailPage;
