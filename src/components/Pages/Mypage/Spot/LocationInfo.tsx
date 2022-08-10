import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH5B, TextB2R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { DefaultKakaoMap } from '@components/Map';
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
        return '기타 '
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

  return (
    <Container>
      <InfoWrapper>
        {
          item?.type === 'PRIVATE' ? (
            <>
              <TextH5B margin='0 0 8px 0'>픽업 정보</TextH5B>
              <TextB2R margin='0 0 24px 0'>{item?.pickupType}</TextB2R>
              <TextH5B margin='0 0 8px 0'>장소 종류</TextH5B>
              <div className='placeTypeEtc'>
                <TextB2R margin='0 0 24px 0'>{placeType()}</TextB2R>
                {
                  item?.placeType === 'ETC' &&
                  <TextB2R margin='0 0 24px 0'>{`/ ${item?.placeTypeDetail}`}</TextB2R>
                }
              </div>
              <TextH5B margin='0 0 8px 0'>점심시간</TextH5B>
              <TextB2R>{item?.lunchTime}</TextB2R>
            </>
          ) : (
            <>
              <TextH5B margin='0 0 8px 0'>장소 종류</TextH5B>
              <div className='placeTypeEtc'>
                <TextB2R margin='0 0 24px 0'>{placeType()}</TextB2R>
                {
                  item?.placeType === 'ETC' &&
                  <TextB2R margin='0 0 24px 0'>{`/ ${item?.placeTypeDetail}`}</TextB2R>
                }
              </div>
            </>
          )
        }
      </InfoWrapper>
      <MapWrapper>
        <DefaultKakaoMap centerLat={item?.coordinate.lat} centerLng={item?.coordinate.lon} />
      </MapWrapper>
    </Container>
  )
};

const Container = styled.div``;

const InfoWrapper = styled.div`
  padding: 0 24px 24px 24px;
  .placeTypeEtc {
    display: flex;
  }
`;

const MapWrapper= styled.div`
  width: 100%;
  height: 270px;
`;

export default LocationInfo;