import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { TextH5B, TextB1R, TextB1B, TextB2R } from '@components/Shared/Text';
import { DefaultMap } from '@components/Map';
import { textH5 } from '@styles/theme';

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
        <StoreInfoWrapper>
          <th>
            <TextTitle>연락처</TextTitle>
          </th>
          <td>
            <Tel>
            {
              placeTel ? 
                <TextH5B textDecoration='underline'>{placeTel}</TextH5B>
              :
                <TextB2R>점주 요청에 의해 제공하지 않습니다.</TextB2R>
            }
            </Tel>
          </td>
        </StoreInfoWrapper>
        <StoreInfoWrapper>
          <th>
            <TextTitle>영업시간</TextTitle>
          </th>
          <td>
            <TextB2R padding='0 0 16px 0'>{placeOpenTime}</TextB2R> 
          </td>
        </StoreInfoWrapper>
        <StoreInfoWrapper>
          <th>
            <TextTitle>휴무일</TextTitle>
          </th>
          <td>
            <Holiday>
              <TextB2R>{placeHoliday}</TextB2R>
                {
                  placeHoliday === '연중무휴' && (
                    <TextB2R>(갑작스런 휴무일은 공지나 소식을 통해 확인할 수 있어요.)</TextB2R>
                  )
                }
            </Holiday>
          </td>
        </StoreInfoWrapper>
      </Wrapper>
      <MapWrapper>
        <DefaultMap centerLat={lat ? lat.toString() : '37.54669189732'} centerLng={lon ? lon.toString() : '126.833485621837'} />
      </MapWrapper>
    </Container>
  );
}

const Container = styled.section``;

const Wrapper = styled.table`
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

const StoreInfoWrapper = styled.tr`
  display: flex;
  flex-direction: row;
  th {
    text-align: left;
  }
`;

const TextTitle = styled.div`
  width: 70px;
  ${textH5};
`;

const Tel = styled.div`
  padding: 0 0 16px 0;
`;

const Holiday = styled.div`
  width: 100%;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 350px;
`;

export default DetailBottomStoreInfo;
