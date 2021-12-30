import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fixedBottom, theme } from '@styles/theme';
import Button from '@components/Shared/Button';
import Map from '@components/Map';
import { destinationForm } from '@store/destination';
import { useSelector } from 'react-redux';
import CheckDeliveryPlace from '@components/Pages/Destination/CheckDeliveryPlace';
import router from 'next/router';
import { getLonLatFromAddress } from '@api/location';

function AddressDetailPage() {
  const [latitudeLongitude, setLatitudeLongitude] = useState({
    latitude: '',
    longitude: '',
  });
  const { tempLocation } = useSelector(destinationForm);

  useEffect(() => {
    getLonLanForMap();
  }, []);

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

  const setUserLocation = () => {
    localStorage.setItem('loc', JSON.stringify(tempLocation));
    router.push('/home');
  };

  return (
    <Container>
      <CheckDeliveryPlace />
      <MapWrapper>
        <Map
          centerLat={latitudeLongitude.latitude}
          centerLng={latitudeLongitude.longitude}
        />
      </MapWrapper>
      <ButtonWrapper>
        <Button
          width="100%"
          height="100%"
          margin="0 0 0 0"
          borderRadius="0"
          onClick={setUserLocation}
        >
          설정하기
        </Button>
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const ButtonWrapper = styled.div`
  ${fixedBottom}
`;

const MapWrapper = styled.div`
  height: 75.5vh;
`;

export default React.memo(AddressDetailPage);
