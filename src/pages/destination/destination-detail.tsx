import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { CheckDeliveryPlace } from '@components/Pages/Destination';
import MapAPI from '@components/Map';
import { Button } from '@components/Shared/Button';
import { fixedBottom, FlexCol, FlexRow } from '@styles/theme';
import { TextH5B, TextB3R, TextB2R } from '@components/Shared/Text';
import Tag from '@components/Shared/Tag';
import TextInput from '@components/Shared/TextInput';
import Checkbox from '@components/Shared/Checkbox';
import router from 'next/router';
import { destinationRegister } from '@api/destination';
import { getLonLatFromAddress } from '@api/location';
import { useSelector } from 'react-redux';
import { destinationForm } from '@store/destination';

const DestinationDetailPage = () => {
  const [isDefaultDestination, setIsDefaultDestination] = useState(false);
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
  const [latitudeLongitude, setLatitudeLongitude] = useState({
    latitude: '',
    longitude: '',
  });

  const destinationNameRef = useRef<HTMLInputElement>(null);
  const destinationDetailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('loc') ?? '{}') ?? {};
      setUserLocation(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getLonLanForMap();
  });

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

  const getDestination = async () => {
    if (destinationDetailRef.current && destinationNameRef.current) {
      const addressDetail = destinationDetailRef.current.value;
      const name = destinationNameRef.current.value;

      const reqBody = {
        // address: userLocation.roadAddrPart1,
        // addressDetail,
        // delivery: 'MORNING',
        // deliveryMessage: '',
        // dong: userLocation.emdNm,
        // main: false,
        // name,
        // receiverName: '',
        // receiverTel: '',
        // zipCode: userLocation.zipNo,
        address: '서울 송파구 거마로2길 34',
        addressDetail,
        delivery: 'SPOT',
        deliveryMessage: '1',
        dong: userLocation.emdNm,
        main: false,
        name,
        receiverName: '집',
        receiverTel: '01012341234',
        zipCode: userLocation.zipNo,
      };
      const { data } = await destinationRegister(reqBody);
      router.push('cart/delivery-info');
    }
  };

  if (!Object.keys(userLocation).length) {
    return;
  }

  return (
    <Container>
      <CheckDeliveryPlace />
      <MapWrapper>
        <MapAPI
          centerLat={latitudeLongitude.latitude}
          centerLng={latitudeLongitude.longitude}
        />
      </MapWrapper>
      <DestinationInfoWrarpper>
        <FlexCol margin="0 0 24px 0">
          <TextH5B>{userLocation.roadAddrPart1}</TextH5B>
          <FlexRowStart padding="4px 0 0 0">
            <Tag padding="2px" width="8%" center>
              지번
            </Tag>
            <TextB3R margin="0 0 0 4px">{userLocation.jibunAddr}</TextB3R>
          </FlexRowStart>
        </FlexCol>
        <TextInput
          placeholder="상세주소 입력 (필수)"
          ref={destinationDetailRef}
        />
        <FlexCol padding="24px 0">
          <TextH5B padding="0 0 8px 0">배송지명</TextH5B>
          <TextInput placeholder="배송지명 입력" ref={destinationNameRef} />
        </FlexCol>
        <FlexRow padding="0">
          <Checkbox
            onChange={() => setIsDefaultDestination(!isDefaultDestination)}
            isSelected={isDefaultDestination}
          />
          {isDefaultDestination ? (
            <TextH5B padding="4px 0 0 4px">기본 배송지로 설정</TextH5B>
          ) : (
            <TextB2R padding="4px 0 0 4px">기본 배송지로 설정</TextB2R>
          )}
        </FlexRow>
      </DestinationInfoWrarpper>
      <ButtonWrapper>
        <Button height="100%" borderRadius="0" onClick={getDestination}>
          설정하기
        </Button>
      </ButtonWrapper>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  margin-bottom: 60px;
`;

const ButtonWrapper = styled.div`
  ${fixedBottom}
`;

const DestinationInfoWrarpper = styled.div`
  padding: 24px;
`;

const MapWrapper = styled.div`
  height: 50vh;
`;

export default DestinationDetailPage;
