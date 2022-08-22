import React from 'react';
import styled from 'styled-components';
import Home from '@components/Home';
import Footer from '@components/Footer';
import dynamic from 'next/dynamic';

const PopupWrapper = dynamic(()=> import('@components/Home/PopupWrapper'));

const HomePage = () => {
  return (
    <Container>
      <PopupWrapper>
        <Home />
        <Footer />
      </PopupWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default HomePage;
