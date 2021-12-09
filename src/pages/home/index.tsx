import React from 'react';
import styled from 'styled-components';
import Home from '@components/Home';
import Footer from '@components/Footer';
import wrapper from '@store/index';
// import { setRefreshToken } from '@components/Auth';
import { useSelector } from 'react-redux';

function home() {
  return (
    <Container>
      <Home />
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const getServerSideProps = wrapper.getServerSideProps(
  (store: any) => async (context: any) => {
    // await setRefreshToken(context, store);

    return {
      props: {},
    };
  }
);

export default home;
