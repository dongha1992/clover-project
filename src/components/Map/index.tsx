import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '@utils/getMediaQuery';

function index() {
  return <Container>맵</Container>;
}

const Container = styled.div`
  max-width: ${breakpoints.mobile}px;
  width: 100%;
  height: 446px;
  background-color: grey;
`;

export default index;
