import type { NextPage } from 'next';
import styled from 'styled-components';
import Home from '@components/Home';
import Bottom from '@components/Bottom';
import HomeHeader from '@components/Header/HomeHeader';
import Footer from '@components/Footer';

const index: NextPage = () => {
  return (
    <Container>
      <HomeHeader />
      <Home />
      <Footer />
      <Bottom />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default index;
