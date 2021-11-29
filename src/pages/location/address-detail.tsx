import React from 'react';
import styled from 'styled-components';
import { homePadding, theme } from '@styles/theme';
import Header from '@components/Header';
import Button from '@components/Button';
import Map from '@components/Map';
import { TextB2R, TextB3R } from '@components/Text';
import TextInput from '@components/TextInput';

/*TODO: 버튼 위치 */

function addressDetail() {
  return (
    <Container>
      <PlaceInfo>
        <span className="brandColor">
          새벽배송
          <span className="h2B"> 지역입니다.</span>
        </span>
        <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
          오후 5시까지 주문 시 다음날 새벽에 도착!
        </TextB3R>
        <TextB3R color={theme.greyScale65}>
          서울 전체, 경기/인천 일부 지역 이용 가능해요
        </TextB3R>
      </PlaceInfo>
      <Map />
      <AddressDetailContainer>
        <TextB2R padding="8px 0 0 0">선택한 주소</TextB2R>
        <TextB3R color={theme.greyScale65}>선택 주소 상세</TextB3R>
        <InputWrapper>
          <TextInput placeholder="상세주소 입력 (건물명/동/호)" />
        </InputWrapper>
      </AddressDetailContainer>
      <Button width="100%" margin="34px 0 0 0" borderRadius="0">
        설정하기
      </Button>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const AddressDetailContainer = styled.div`
  ${homePadding}
  margin:8px 0px;
`;

const InputWrapper = styled.div`
  padding-top: 16px;
`;

const PlaceInfo = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;

  .brandColor {
    color: ${theme.brandColor};
    font-size: 20px;
    letter-spacing: -0.4px;
    font-weight: bold;
    line-height: 30px;

    .h2B {
      color: ${theme.black};
    }
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
`;

export default addressDetail;
