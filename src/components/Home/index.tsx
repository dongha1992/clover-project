import React from 'react';
import styled from 'styled-components';
import Banner from '@components/Banner';

function Home() {
  return (
    <Container>
      <Banner />
    </Container>
  );
}

const Container = styled.div`
  margin-top: 56px;
`;

export default Home;
