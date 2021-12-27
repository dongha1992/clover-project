import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '@utils/getMediaQuery';

function Map({ latitudeLongitude }: any) {
  return <Container>맵</Container>;
}

const Container = styled.div`
  max-width: ${breakpoints.mobile}px;
  width: 100%;
  height: 50vh;
  background-color: gray;
`;

export default Map;
