import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { TextH4B, TextB1R } from '@components/Shared/Text';
import Map from '@components/Map';

const DetailBottomStoreInfo = ({ items }: any): ReactElement => {
  return (
    <Container>
      <Wrapper>
        <FlexWrapper>
          <TextH4B margin="0 33px 0 0">연락처</TextH4B>
          <TextH4B textDecoration="underline">
            {items?.storeInfo?.number}
          </TextH4B>
        </FlexWrapper>
        <FlexWrapper>
          <TextH4B margin="0 20px 0 0">영업시간</TextH4B>
          <TextB1R>{items?.storeInfo?.time}</TextB1R>
        </FlexWrapper>
        <FlexWrapper>
          <TextH4B margin="0 33px 0 0">연락처</TextH4B>
          <TextB1R>{items?.storeInfo?.off}</TextB1R>
        </FlexWrapper>
      </Wrapper>
      <MapWrapper>
        <Map centerLat='37.54669189732' centerLng='126.833485621837' />
      </MapWrapper>
    </Container>
  );
}

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 24px;
`;

const FlexWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 270px;
`;
export default DetailBottomStoreInfo;
