import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { TextH4B, TextB1R, TextB1B } from '@components/Shared/Text';
import Map from '@components/Map';
import { FlexColStart } from '@styles/theme';

interface IProps {
  lat?: number;
  lon?: number;
  placeOpenTime?: string;
  placeHoliday?: string;
  placeTel?:string;
}

const DetailBottomStoreInfo= ({lat, lon, placeOpenTime, placeHoliday, placeTel}: IProps): ReactElement => {
  return (
    <Container>
      <Wrapper>
        <FlexWrapper>
          <TextH4B margin="0 33px 0 0">연락처</TextH4B>
          {
            placeTel ? 
              <TextB1B textDecoration='underline'>{placeTel}</TextB1B>
            :
              <TextB1R>점주 요청에 의해 제공하지 않습니다.</TextB1R>
          }
        </FlexWrapper>
        <FlexWrapper>
          <TextH4B margin="0 20px 0 0">영업시간</TextH4B>
          <TextB1R>{placeOpenTime}</TextB1R>
        </FlexWrapper>
        <FlexWrapper>
          <TextH4B margin="0 33px 0 0">휴무일</TextH4B>
          <FlexColStart>
            <TextB1R>{placeHoliday}</TextB1R>
            {
              placeHoliday === '연중무휴' && (
                <TextB1R>(갑작스런 휴무일은 공지나 소식을 통해 확인할 수 있어요.)</TextB1R>
              )
            }
          </FlexColStart>
        </FlexWrapper>
      </Wrapper>
      <MapWrapper>
        <Map centerLat={lat ? lat.toString() : '37.54669189732'} centerLng={lon ? lon.toString() : '126.833485621837'} />
      </MapWrapper>
    </Container>
  );
}

const Container = styled.section``;

const Wrapper = styled.div`
  padding: 24px;
`;

const FlexWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 350px;
`;

export default DetailBottomStoreInfo;
