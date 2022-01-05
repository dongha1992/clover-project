import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { CheckDeliveryPlace } from '@components/Pages/Destination';
import MapAPI from '@components/Map';
import { Button } from '@components/Shared/Button';
import { fixedBottom, FlexCol, FlexRow } from '@styles/theme';
import { TextH5B, TextB2R, TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import Checkbox from '@components/Shared/Checkbox';
import router from 'next/router';
import { destinationRegister } from '@api/destination';
import { getLonLatFromAddress } from '@api/location';
import AddressItem from '@components/Pages/Location/AddressItem';
import { useSelector } from 'react-redux';
import { destinationForm } from '@store/destination';
import { checkDestinationHelper } from '@utils/checkDestinationHelper';

const DestinationDetailPage = () => {
  const [isDefaultDestination, setIsDefaultDestination] = useState(false);

  const [latitudeLongitude, setLatitudeLongitude] = useState({
    latitude: '',
    longitude: '',
  });

  const destinationNameRef = useRef<HTMLInputElement>(null);
  const destinationDetailRef = useRef<HTMLInputElement>(null);

  const { userLocation, availableDestination } = useSelector(destinationForm);

  useEffect(() => {
    getLonLanForMap();
  }, []);

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
    const deliveryType = checkDestinationHelper(availableDestination);
    const canNotDelivery = deliveryType === 'noDelivery';

    if (destinationDetailRef.current && destinationNameRef.current) {
      const addressDetail = destinationDetailRef.current.value.toString();
      const name = destinationNameRef.current.value.toString();

      const reqBody = {
        addressDetail,
        name,
        address: userLocation.roadAddrPart1,
        delivery: canNotDelivery ? '' : deliveryType.toUpperCase(),
        deliveryMessage: '테스트',
        dong: userLocation.emdNm,
        main: isDefaultDestination,
        receiverName: '테스트1',
        receiverTel: '010-1234-1234',
        zipCode: userLocation.zipNo,
        // address: '서울 송파구 거마로2길 34',
        // addressDetail,
        // delivery: 'QUICK',
        // deliveryMessage: 'AAA',
        // dong: userLocation.emdNm,
        // main: true,
        // name,
        // receiverName: '집',
        // receiverTel: '01012341234',
        // zipCode: userLocation.zipNo,
      };
      console.log(reqBody, 'reqBody');
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
      <MapWrapper>
        <MapAPI
          centerLat={latitudeLongitude.latitude}
          centerLng={latitudeLongitude.longitude}
        />
      </MapWrapper>
      <DestinationInfoWrarpper>
        <FlexCol>
          <AddressItem
            roadAddr={userLocation.roadAddrPart1}
            bdNm={userLocation.bdNm}
            jibunAddr={userLocation.jibunAddr}
            zipNo={userLocation.zipNo}
          />
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
