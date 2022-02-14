import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { CheckDestinationPlace } from '@components/Pages/Destination';
import MapAPI from '@components/Map';
import { Button, ButtonGroup } from '@components/Shared/Button';
import { fixedBottom, FlexCol, FlexRow } from '@styles/theme';
import { TextH5B, TextB2R, TextH6B } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import Checkbox from '@components/Shared/Checkbox';
import router from 'next/router';
import { getLonLatFromAddress } from '@api/location';
import AddressItem from '@components/Pages/Location/AddressItem';
import { useSelector, useDispatch } from 'react-redux';
import { destinationForm, INIT_LOCATION_TEMP, SET_TEMP_DESTINATION, SET_DESTINATION_STATUS } from '@store/destination';
import { checkDestinationHelper } from '@utils/checkDestinationHelper';

/* TODO: receiverName, receiverTel  */

const DestinationDetailPage = () => {
  const [isDefaultDestination, setIsDefaultDestination] = useState(false);

  const [latitudeLongitude, setLatitudeLongitude] = useState({
    latitude: '',
    longitude: '',
  });

  const destinationNameRef = useRef<HTMLInputElement>(null);
  const destinationDetailRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { tempLocation, availableDestination } = useSelector(destinationForm);

  // 배송 가능 여부
  const destinationStatus = checkDestinationHelper(availableDestination);
  const canNotDelivery = destinationStatus === 'noDelivery';

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

  const getDestination = async () => {
    if (canNotDelivery) {
      return;
    }

    if (destinationDetailRef.current && destinationNameRef.current) {
      const addressDetail = destinationDetailRef.current.value.toString();
      const name = destinationNameRef.current.value.toString();

      const userDestinationInfo = {
        name,
        location: {
          addressDetail,
          address: tempLocation.roadAddrPart1,
          dong: tempLocation.emdNm,
          zipCode: tempLocation.zipNo,
        },
        main: isDefaultDestination,
      };

      dispatch(SET_TEMP_DESTINATION(userDestinationInfo));
      dispatch(SET_DESTINATION_STATUS(destinationStatus));
      dispatch(INIT_LOCATION_TEMP());

      router.push('/cart/delivery-info');
    }
  };

  const goToSearch = () => {
    router.push('/destination/search');
  };

  const goToHome = () => {
    router.push('/');
  };
  if (!Object.keys(tempLocation).length) {
    return;
  }

  return (
    <Container>
      <CheckDestinationPlace />
      <MapWrapper>
        <MapAPI centerLat={latitudeLongitude.latitude} centerLng={latitudeLongitude.longitude} />
      </MapWrapper>
      <DestinationInfoWrarpper>
        <FlexCol>
          <AddressItem
            roadAddr={tempLocation.roadAddrPart1}
            bdNm={tempLocation.bdNm}
            jibunAddr={tempLocation.jibunAddr}
            zipNo={tempLocation.zipNo}
          />
        </FlexCol>
        <TextInput placeholder="상세주소 입력 (필수)" ref={destinationDetailRef} />
        <FlexCol padding="24px 0">
          <TextH5B padding="0 0 8px 0">배송지명</TextH5B>
          <TextInput placeholder="배송지명 입력" ref={destinationNameRef} />
        </FlexCol>
        <FlexRow padding="0">
          <Checkbox onChange={() => setIsDefaultDestination(!isDefaultDestination)} isSelected={isDefaultDestination} />
          {isDefaultDestination ? (
            <TextH5B padding="4px 0 0 4px">기본 배송지로 설정</TextH5B>
          ) : (
            <TextB2R padding="4px 0 0 4px">기본 배송지로 설정</TextB2R>
          )}
        </FlexRow>
      </DestinationInfoWrarpper>
      {canNotDelivery ? (
        <ButtonGroup
          leftButtonHandler={goToSearch}
          rightButtonHandler={goToHome}
          leftText="다른 주소 검색하기"
          rightText="닫기"
        />
      ) : (
        <ButtonWrapper>
          <Button height="100%" borderRadius="0" onClick={getDestination}>
            설정하기
          </Button>
        </ButtonWrapper>
      )}
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
