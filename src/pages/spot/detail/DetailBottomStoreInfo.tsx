import React from 'react';
import styled from 'styled-components';
import { TextB2R, TextH5B, TextH4B, TextB1R } from '@components/Shared/Text';
import { theme } from '@styles/theme';

function DetailBottomStoreInfo({ items }: any) {
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
      <Map>맵</Map>
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

const Map = styled.div`
  width: 100%;
  height: 270px;
  background: ${theme.greyScale6};
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default DetailBottomStoreInfo;
