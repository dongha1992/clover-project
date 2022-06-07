import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { TextH5B, TextB1R, TextB1B } from '@components/Shared/Text';
import Map from '@components/Map';

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
        <TitleWrapper>
          <TextH5B padding='0 0 16px 0'>연락처</TextH5B>
          <TextH5B padding='0 0 16px 0'>영업시간</TextH5B>
          <TextH5B>휴무일</TextH5B>
        </TitleWrapper>
        <DiscriptionWrapper>
          {/* 연락처 */}
          <Tel>
            {
              placeTel ? 
                <TextB1B textDecoration='underline'>{placeTel}</TextB1B>
              :
                <TextB1R>점주 요청에 의해 제공하지 않습니다.</TextB1R>
            }
          </Tel>
          {/* 영업시간 */}
          <TextB1R padding='0 0 16px 0'>{placeOpenTime}</TextB1R> 
          {/* 휴무일 */}
          <Holiday>
            <TextB1R>{placeHoliday}</TextB1R>
              {
                placeHoliday === '연중무휴' && (
                  <TextB1R>(갑작스런 휴무일은 공지나 소식을 통해 확인할 수 있어요.)</TextB1R>
                )
              }
          </Holiday>
        </DiscriptionWrapper>
      </Wrapper>
      <MapWrapper>
        <Map zoom={19} centerLat={lat ? lat : 37.54669189732} centerLng={lon ? lon : 126.833485621837} />
      </MapWrapper>
    </Container>
  );
}

const Container = styled.section``;

const Wrapper = styled.div`
  padding: 24px;
  display: flex;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 78px;
`;

const DiscriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Tel = styled.div`
  padding: 0 0 16px 0;
`;

const Holiday = styled.div``;

const MapWrapper = styled.div`
  width: 100%;
  height: 350px;
`;

export default DetailBottomStoreInfo;
