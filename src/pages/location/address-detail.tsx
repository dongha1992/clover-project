import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fixedBottom } from '@styles/theme';
import { Button, ButtonGroup } from '@components/Shared/Button';
import { DefaultKakaoMap } from '@components/Map';
import { destinationForm } from '@store/destination';
import { useSelector, useDispatch } from 'react-redux';
import { CheckDestinationPlace } from '@components/Pages/Destination/';
import router from 'next/router';
import { getLonLatFromAddress } from '@api/location';
import { SET_LOCATION, INIT_LOCATION_TEMP } from '@store/destination';
import { checkDestinationHelper } from '@utils/destination';
import { SET_SPOT_POSITIONS } from '@store/spot';

const AddressDetailPage = () => {
  const { tempLocation, availableDestination, isCanNotDelivery } = useSelector(destinationForm);
  const dispatch = useDispatch();
  const { isSpot, isSub } = router.query;

  const [latitudeLongitude, setLatitudeLongitude] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    getLonLanForMap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 배송 가능 여부
  const destinationDeliveryType = checkDestinationHelper(availableDestination);
  const canNotDelivery = destinationDeliveryType === 'noDelivery';

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
    dispatch(
      SET_SPOT_POSITIONS({
        latitude: latitudeLongitude.latitude,
        longitude: latitudeLongitude.longitude,
      })
    );
    if (isSpot) {
      router.push('/spot');
    } else if (isSub) {
      router.push('/subscription');
    } else {
      router.push('/');
    }
  };

  const goToSearch = () => {
    router.push('/location');
  };

  const goToHome = () => {
    router.push('/');
  };

  return (
    <Container>
      <CheckDestinationPlace />
      <MapWrapper>
        <DefaultKakaoMap centerLat={Number(latitudeLongitude.latitude)} centerLng={Number(latitudeLongitude.longitude)} />
      </MapWrapper>
      {isCanNotDelivery ? (
        <ButtonGroup
          leftButtonHandler={goToSearch}
          rightButtonHandler={goToHome}
          leftText="다른 주소 검색하기"
          rightText="닫기"
        />
      ) : (
        <ButtonWrapper>
          <Button height="100%" borderRadius="0" onClick={setUserLocationHandler}>
            설정하기
          </Button>
        </ButtonWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  height: calc(100vh - 112px);
  overflow: hidden;
`;

const ButtonWrapper = styled.div`
  ${fixedBottom};
`;

const MapWrapper = styled.div`
  height: 100%;
`;

export default AddressDetailPage;
