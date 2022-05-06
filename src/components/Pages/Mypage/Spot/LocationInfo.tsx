import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import MapAPI from '@components/Map';
import { IEditRegistration } from '@model/index';

interface IParams {
  item: IEditRegistration;
};

const LocationInfo = ({ item }: IParams) => {
  return (
    <Container>
      <InfoWrapper>
        {
          item?.type === 'PRIVATE' ? (
            <>
              <TextH5B margin='0 0 8px 0'>픽업 정보</TextH5B>
              <TextB3R margin='0 0 24px 0'>{item?.pickupType}</TextB3R>
              <TextH5B margin='0 0 8px 0'>장소 종류</TextH5B>
              <TextB3R margin='0 0 24px 0'>{item?.placeType}</TextB3R>
              <TextH5B margin='0 0 8px 0'>점심시간</TextH5B>
              <TextB3R>{item?.lunchTime}</TextB3R>
            </>
          ) : (
            <>
              <TextH5B margin='0 0 8px 0'>장소 종류</TextH5B>
              <TextB3R>{item?.placeType}</TextB3R>    
            </>
          )
        }
      </InfoWrapper>
      <MapWrapper>
        <MapAPI centerLat={item?.coordinate.lat} centerLng={item?.coordinate.lon} />
      </MapWrapper>
    </Container>
  )
};

const Container = styled.div``;

const InfoWrapper = styled.div`
  padding: 0 24px 24px 24px;
`;

const MapWrapper= styled.div`
  width: 100%;
  height: 270px;
`;

export default LocationInfo;