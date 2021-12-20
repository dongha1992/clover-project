import React from 'react';
import Carousel from '@components/Carousel';
import styled from 'styled-components';

const BANNERS = [
  './images/img1.png',
  './images/img1.png',
  './images/img1.png',
  './images/img1.png',
];

function Banner() {
  return (
    <Container>
      <Carousel images={BANNERS} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

export default Banner;
