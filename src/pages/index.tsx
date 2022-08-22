import React, { ReactElement } from 'react';
import styled from 'styled-components';
import Home from '@components/Home';
import Footer from '@components/Footer';
import DefaultLayout from '@components/Layout/Default';
import { NextPageWithLayout } from '@pages/_app';
import HomeBottom from '@components/Bottom/HomeBottom';
import PopupWrapper from '@components/Home/PopupWrapper';

const HomePage: NextPageWithLayout = () => {
  return (
    <Container>
      <PopupWrapper>
        <Home />
        <Footer />
      </PopupWrapper>
    </Container>
  );
};

HomePage.getLayout = (page: ReactElement) => {
  return (<DefaultLayout bottom={<HomeBottom/>}>{page}</DefaultLayout>);
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default HomePage;
