import React from 'react';
import styled from 'styled-components';
import Home from '@components/Home';
import Footer from '@components/Footer';
import { wrapper } from '@store/index';
import { connect } from 'react-redux';
import { SET_ORDER_TYPE } from '@store/order';

// import { setRefreshToken } from '@components/Auth';

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

// export const getStaticProps = wrapper.getStaticProps((store) => (context) => {
//   store.dispatch(SET_ORDER_TYPE({ orderType: 'TEST' }));
//   console.log(store.getState().order, 'getServerSideProps order');
//   console.log(store.getState().cart, 'getServerSideProps cart');
// });

export default HomePage;
