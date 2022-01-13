import React from 'react';
import styled from 'styled-components';
import Home from '@components/Home';
import Footer from '@components/Footer';
import { wrapper } from '@store/index';
import { connect } from 'react-redux';

// import { setRefreshToken } from '@components/Auth';

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    (context): any => {
      console.log(store.getState().destination, 'store');
    }
);

const HomePage = () => {
  return (
    <Container>
      <Home />
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default HomePage;
