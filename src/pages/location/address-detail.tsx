import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fixedBottom } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import MapAPI from '@components/Map';
import { destinationForm } from '@store/destination';
import { useSelector, useDispatch } from 'react-redux';
import { CheckDeliveryPlace } from '@components/Pages/Destination/';
import router from 'next/router';
import { getLonLatFromAddress } from '@api/location';

const AddressDetailPage = () => {
  const { tempLocation, availableDestination } = useSelector(destinationForm);

  const [latitudeLongitude, setLatitudeLongitude] = useState({
    latitude: '',
    longitude: '',
  });

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
    // sessionStorage.setItem(
    //   'loc',
    //   JSON.stringify({ ...tempLocation, ...availableDestination })
    // );
    router.push('/category');
  };

  useEffect(() => {
    getLonLanForMap();
  }, []);

  return (
    <Container>
      <CheckDeliveryPlace />
      <MapWrapper>
        <MapAPI
          centerLat={latitudeLongitude.latitude}
          centerLng={latitudeLongitude.longitude}
        />
      </MapWrapper>
      <ButtonWrapper>
        <Button
          width="100%"
          height="100%"
          borderRadius="0"
          onClick={setUserLocationHandler}
        >
          설정하기
        </Button>
      </ButtonWrapper>
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
