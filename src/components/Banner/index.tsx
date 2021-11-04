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
  width: 100%;
`;

export default Banner;
