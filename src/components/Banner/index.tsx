import React from 'react';
import Carousel from '@components/Carousel';
import styled from 'styled-components';

function Banner() {
  return (
    <Container>
      <Carousel />
    </Container>
  );
}

const Container = styled.div`
  width: 504px;
  height: 378px;
`;

export default Banner;
