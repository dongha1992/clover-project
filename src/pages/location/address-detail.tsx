import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fixedBottom } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import MapAPI from '@components/Map';
import { destinationForm } from '@store/destination';
import { useSelector } from 'react-redux';
import { CheckDeliveryPlace } from '@components/Pages/Destination/';
import router from 'next/router';
import { getLonLatFromAddress } from '@api/location';

const AddressDetailPage = () => {
  const [latitudeLongitude, setLatitudeLongitude] = useState({
    latitude: '',
    longitude: '',
  });
  const [userLocation, setUserLocation] = useState({
    roadAddr: '',
    roadAddrPart1: '',
    roadAddrPart2: '',
    jibunAddr: '',
    engAddr: '',
    zipNo: '',
    admCd: '',
    rnMgtSn: '',
    bdMgtSn: '',
    detBdNmList: '',
    bdNm: '',
    bdKdcd: '',
    siNm: '',
    sggNm: '',
    emdNm: '',
    liNm: '',
    rn: '',
    udrtYn: '',
    buldMnnm: '',
    buldSlno: '',
    mtYn: '',
    lnbrMnnm: '',
    lnbrSlno: '',
    emdNo: '',
  });

  useEffect(() => {
    getLonLanForMap();
  }, [userLocation]);

  const getLonLanForMap = async () => {
    const params = {
      query: userLocation.roadAddrPart1,
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

  const setUserLocationInLocal = () => {
    localStorage.setItem('loc', JSON.stringify(userLocation));
    router.push('/home');
  };

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('loc') ?? '{}') ?? {};
      setUserLocation(data);
    } catch (error) {
      console.error(error);
    }
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
          onClick={setUserLocationInLocal}
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
