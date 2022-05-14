import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import MapAPI from '@components/Map';
import { IGetRegistrationStatus } from '@model/index';

interface IParams {
  item: IGetRegistrationStatus;
};

const LocationInfo = ({ item }: IParams) => {

  const placeType = (): string | undefined => {
    switch(item?.placeType){
      case 'BOOKSTORE':
        return '서점'
      case 'CAFE':
        return '카페'
      case 'CONVENIENCE_STORE':
        return '편의점'
      case 'DRUGSTORE':
        return '약국'
      case 'ETC':
        return '기타'
      case 'FITNESS_CENTER':
        return '피트니스'
      case 'OFFICE':
        return '오피스'
      case 'SCHOOL':
        return '학교'
      case 'SHARED_OFFICE':
        return '공유오피스'
      case 'STORE':
        return '서점'
    }
  };

  const pickUpType = () => {
    switch(item?.pickupType) {
      case 'COMMUNAL_FRIDGE':
        return '공용 냉장고'
      case 'COMMUNAL_TABLE':
        return '테이블'
      case 'DELIVERY_LOCATION':
        return '배달 위치'
      case 'DOCUMENT_ROOM':
        return ''
      case 'ETC':
        return '기타'
      case 'FRONT_DESK':
        return '프론트 데스크'
      case 'OFFICE_DOOR':
        return '회사 문 앞'
    }
  };

  return (
    <Container>
      <InfoWrapper>
        {
          item?.type === 'PRIVATE' ? (
            <>
              <TextH5B margin='0 0 8px 0'>픽업 정보</TextH5B>
              <TextB3R margin='0 0 24px 0'>{pickUpType()}</TextB3R>
              <TextH5B margin='0 0 8px 0'>장소 종류</TextH5B>
              <TextB3R margin='0 0 24px 0'>{placeType()}</TextB3R>
              <TextH5B margin='0 0 8px 0'>점심시간</TextH5B>
              <TextB3R>{item?.lunchTime}</TextB3R>
            </>
          ) : (
            <>
              <TextH5B margin='0 0 8px 0'>장소 종류</TextH5B>
              <TextB3R>{placeType()}</TextB3R>    
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