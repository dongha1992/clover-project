import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import CheckDeliveryPlace from '@components/Pages/Destination/CheckDeliveryPlace';
import Map from '@components/Map';
import Button from '@components/Shared/Button';
import { fixedBottom, FlexCol, FlexRow } from '@styles/theme';
import { TextH5B, TextB3R, TextB2R } from '@components/Shared/Text';
import Tag from '@components/Shared/Tag';
import { destinationForm } from '@store/destination';
import { useSelector } from 'react-redux';
import TextInput from '@components/Shared/TextInput';
import Checkbox from '@components/Shared/Checkbox';
import router from 'next/router';
import { destinationRegister } from '@api/destination';

function DestinationDetailPage() {
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

  // const { tempDestination } = useSelector(destinationForm);

  const destinationNameRef = useRef<HTMLInputElement>(null);
  const destinationDetailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('loc') ?? '{}') ?? {};
      setUserLocation(data);
    } catch (error) {
      console.error(error);
    }
    console.log(userLocation);
  }, []);

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
      console.log(data);
      router.push('cart/delivery-info');
    }
  };

  if (!Object.keys(userLocation).length) {
    return;
  }

  return (
    <Container>
      <CheckDeliveryPlace />
      <Map />
      <DestinationInfoWrarpper>
        <FlexCol margin="0 0 24px 0">
          <TextH5B>{userLocation.bdNm}</TextH5B>
          <FlexRow padding="4px 0 6px">
            <Tag padding="3px">도로명</Tag>
            <TextB3R margin="0 0 0 4px">{userLocation.roadAddr}</TextB3R>
          </FlexRow>
          <FlexRow>
            <Tag padding="3px">지번</Tag>
            <TextB3R margin="0 0 0 4px">{userLocation.jibunAddr}</TextB3R>
          </FlexRow>
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
}

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

export default DestinationDetailPage;
