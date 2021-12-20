import React from 'react';
import styled from 'styled-components';
import { homePadding, theme } from '@styles/theme';
import Header from '@components/Header';
import Button from '@components/Shared/Button';
import Map from '@components/Map';
import { TextB2R, TextB3R } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import { breakpoints } from '@utils/getMediaQuery';
/*TODO: 버튼 위치 */

function AddressDetailPage() {
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
      <ButtonWrapper>
        <Button width="100%" margin="0 0 0 0" borderRadius="0">
          설정하기
        </Button>
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  padding-bottom: 20px;
`;

const AddressDetailContainer = styled.div`
  ${homePadding}
  margin: 8px 0px;
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
  position: fixed;
  bottom: 0;
  left: 0;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: 10;
  height: 56px;
  left: calc(50%);
  background-color: ${({ theme }) => theme.black};

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0
  `};
`;

export default AddressDetailPage;
