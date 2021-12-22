import React from 'react';
import styled from 'styled-components';
import { fixedBottom, theme } from '@styles/theme';
import Button from '@components/Shared/Button';
import Map from '@components/Map';
import { TextB3R } from '@components/Shared/Text';
import { destinationForm } from '@store/destination';
import { useSelector } from 'react-redux';

/*TODO: 지도 연동 + 마커 표시 */

function AddressDetailPage() {
  const { tempDestination } = useSelector(destinationForm);
  console.log(tempDestination);
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
      <ButtonWrapper>
        <Button width="100%" height="100%" margin="0 0 0 0" borderRadius="0">
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
  ${fixedBottom}
`;

export default AddressDetailPage;
