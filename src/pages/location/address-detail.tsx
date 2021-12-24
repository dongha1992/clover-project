import React from 'react';
import styled from 'styled-components';
import { fixedBottom, theme } from '@styles/theme';
import Button from '@components/Shared/Button';
import Map from '@components/Map';
import { destinationForm } from '@store/destination';
import { useSelector } from 'react-redux';
import CheckDeliveryPlace from '@components/Pages/Destination/CheckDeliveryPlace';
/*TODO: 지도 연동 + 마커 표시 */

function AddressDetailPage() {
  const { tempLocation } = useSelector(destinationForm);

  return (
    <Container>
      <CheckDeliveryPlace />
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

const ButtonWrapper = styled.div`
  ${fixedBottom}
`;

export default AddressDetailPage;
